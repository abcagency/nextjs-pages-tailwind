import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { hash, run } from '../scripts/optimize-images.mjs';
import { installHook } from '../scripts/install-images-hook.mjs';

const execute = promisify(execFile);
const png = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j7ZkAAAAASUVORK5CYII=',
	'base64'
);
const source = Buffer.concat([png, Buffer.alloc(128)]);
const credentials = { api_key: 'test-key', api_secret: 'test-secret' };

async function fixture(t) {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'kraken-images-'));
	await fs.mkdir(path.join(root, 'images'));
	await fs.writeFile(path.join(root, 'images/photo.png'), source);
	t.after(() => fs.rm(root, { recursive: true, force: true }));
	return root;
}

function mock(output = png, onUpload) {
	let uploads = 0;
	return {
		get uploads() {
			return uploads;
		},
		fetchImpl: async (url, options) => {
			if (url === 'https://api.kraken.io/v1/upload') {
				uploads++;
				const data = JSON.parse(options.body.get('data'));
				assert.equal(data.wait, true);
				assert.deepEqual(data.auth, credentials);
				assert.equal(options.body.get('file').name, 'photo.png');
				await onUpload?.(data);
				return Response.json({
					success: true,
					kraked_url: 'http://dl.kraken.io/test/photo.png',
					kraked_size: output.length
				});
			}
			assert.equal(url, 'https://dl.kraken.io/test/photo.png');
			return new Response(output);
		}
	};
}

const quiet = () => {};
const options = (root, api) => ({
	root,
	credentials,
	log: quiet,
	fetchImpl: api.fetchImpl
});

test('writes smaller source and hashes retained bytes; repeat run uses no API', async t => {
	const root = await fixture(t);
	const api = mock();
	const result = await run(options(root, api));
	assert.equal(result.savedBytes, 128);
	assert.deepEqual(await fs.readFile(path.join(root, 'images/photo.png')), png);
	const manifest = JSON.parse(
		await fs.readFile(path.join(root, 'kraken-images.manifest.json'))
	);
	assert.equal(manifest.files['images/photo.png'].outputHash, hash(png));
	assert.equal(manifest.files['images/photo.png'].inputHash, hash(source));
	assert.equal(JSON.stringify(manifest).includes('test-secret'), false);
	await run(options(root, api));
	assert.equal(api.uploads, 1);
});

test('check/dry-run need no credentials or network and make no writes', async t => {
	const root = await fixture(t);
	for (const mode of ['check', 'dry-run']) {
		const result = await run({
			root,
			mode,
			log: quiet,
			fetchImpl: () => assert.fail('Network call')
		});
		assert.deepEqual(result.pending, ['images/photo.png']);
	}
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
	await assert.rejects(
		fs.stat(path.join(root, 'kraken-images.manifest.json')),
		{ code: 'ENOENT' }
	);
});

test('changed content and compression options become pending', async t => {
	const root = await fixture(t);
	const api = mock();
	await run(options(root, api));
	await fs.writeFile(path.join(root, 'images/photo.png'), source);
	assert.equal(
		(await run({ root, mode: 'check', log: quiet })).pending.length,
		1
	);
	await run(options(root, api));
	await fs.writeFile(
		path.join(root, 'kraken-images.config.json'),
		JSON.stringify({ lossy: true, quality: 85 })
	);
	assert.equal(
		(await run({ root, mode: 'check', log: quiet })).pending.length,
		1
	);
});

test('larger output is discarded and still marked processed', async t => {
	const root = await fixture(t);
	const api = mock(Buffer.concat([source, Buffer.alloc(10)]));
	await run(options(root, api));
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
	await run(options(root, api));
	assert.equal(api.uploads, 1);
});

test('bad downloads and failed API responses preserve source and allow retry', async t => {
	const root = await fixture(t);
	await assert.rejects(
		run(options(root, mock(Buffer.from('<html>failure</html>')))),
		/format or byte count/
	);
	await assert.rejects(
		run({
			...options(root, mock()),
			fetchImpl: async () =>
				Response.json({ success: false, message: 'test-secret' })
		}),
		/successful image result/
	);
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
	await assert.rejects(fs.stat(path.join(root, '.kraken-images.lock')), {
		code: 'ENOENT'
	});
	await run(options(root, mock()));
});

test('untrusted download URL and incorrect size are rejected', async t => {
	const root = await fixture(t);
	for (const result of [
		{
			success: true,
			kraked_url: 'https://example.com/file.png',
			kraked_size: png.length
		},
		{
			success: true,
			kraked_url: 'https://dl.kraken.io/test/photo.png',
			kraked_size: png.length + 1
		}
	]) {
		await assert.rejects(
			run({
				...options(root, mock()),
				fetchImpl: async url =>
					url.endsWith('/upload') ? Response.json(result) : new Response(png)
			}),
			/unexpected/
		);
	}
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
});

test('editing an image during upload preserves the edit', async t => {
	const root = await fixture(t);
	const edited = Buffer.concat([png, Buffer.alloc(20, 3)]);
	const api = mock(png, () =>
		fs.writeFile(path.join(root, 'images/photo.png'), edited)
	);
	await assert.rejects(run(options(root, api)), /changed during optimization/);
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		edited
	);
});

test('lock prevents concurrent optimizer runs', async t => {
	const root = await fixture(t);
	await fs.mkdir(path.join(root, '.kraken-images.lock'));
	const api = mock();
	await assert.rejects(run(options(root, api)), /Another image run/);
	assert.equal(api.uploads, 0);
	await fs.stat(path.join(root, '.kraken-images.lock'));
});

test('successful files survive a later batch failure', async t => {
	const root = await fixture(t);
	await fs.writeFile(path.join(root, 'images/z.png'), source);
	const api = mock();
	const fetchImpl = async (url, opts) => {
		if (url.endsWith('/upload') && opts.body.get('file').name === 'z.png')
			return new Response('', { status: 429 });
		return api.fetchImpl(url, opts);
	};
	await assert.rejects(run({ ...options(root, api), fetchImpl }), /HTTP 429/);
	const manifest = JSON.parse(
		await fs.readFile(path.join(root, 'kraken-images.manifest.json'))
	);
	assert.equal(manifest.files['images/photo.png'].outputHash, hash(png));
	assert.deepEqual((await run({ root, mode: 'check', log: quiet })).pending, [
		'images/z.png'
	]);
});

test('renamed optimized bytes reuse their record without uploading', async t => {
	const root = await fixture(t);
	const api = mock();
	await run(options(root, api));
	await fs.rename(
		path.join(root, 'images/photo.png'),
		path.join(root, 'images/renamed.png')
	);
	await run(options(root, api));
	assert.equal(api.uploads, 1);
	assert.deepEqual(
		(await run({ root, mode: 'check', log: quiet })).pending,
		[]
	);
});

test('exclusions, missing roots, SVGs and overlapping roots behave correctly', async t => {
	const root = await fixture(t);
	await fs.writeFile(path.join(root, 'images/icon.svg'), '<svg/>');
	await fs.writeFile(
		path.join(root, 'kraken-images.config.json'),
		JSON.stringify({
			roots: ['images', 'images/photo.png', 'public'],
			exclude: ['images/photo.png']
		})
	);
	assert.deepEqual(
		(await run({ root, mode: 'check', log: quiet })).pending,
		[]
	);
});

test('symlinks, malformed manifests, invalid options and oversized images fail safely', async t => {
	const root = await fixture(t);
	await fs.symlink('photo.png', path.join(root, 'images/link.png'));
	await assert.rejects(run({ root, mode: 'check', log: quiet }), /symlink/);
	await fs.unlink(path.join(root, 'images/link.png'));
	await fs.writeFile(path.join(root, 'kraken-images.manifest.json'), '{broken');
	await assert.rejects(run({ root, mode: 'check', log: quiet }), /JSON syntax/);
	await fs.unlink(path.join(root, 'kraken-images.manifest.json'));
	await fs.writeFile(
		path.join(root, 'kraken-images.config.json'),
		JSON.stringify({ roots: ['../outside'] })
	);
	await assert.rejects(
		run({ root, mode: 'check', log: quiet }),
		/repository-relative/
	);
	await fs.writeFile(
		path.join(root, 'kraken-images.config.json'),
		JSON.stringify({ maxFileBytes: 10 })
	);
	await assert.rejects(run(options(root, mock())), /maxFileBytes/);
});

test('commit check uses staged image, config and manifest instead of working files', async t => {
	const root = await fixture(t);
	await execute('git', ['init', '--quiet'], { cwd: root });
	await execute('git', ['add', 'images/photo.png'], { cwd: root });
	await run(options(root, mock()));
	assert.equal(
		(await run({ root, mode: 'check-staged', log: quiet })).pending.length,
		1
	);
	await execute(
		'git',
		['add', 'images/photo.png', 'kraken-images.manifest.json'],
		{ cwd: root }
	);
	assert.equal(
		(await run({ root, mode: 'check-staged', log: quiet })).pending.length,
		0
	);
	await fs.writeFile(path.join(root, 'images/photo.png'), source);
	assert.equal(
		(await run({ root, mode: 'check-staged', log: quiet })).pending.length,
		0
	);
	assert.equal(
		(await run({ root, mode: 'check', log: quiet })).pending.length,
		1
	);
});

test('hook installation is idempotent and preserves existing hooks', async t => {
	const root = await fixture(t);
	await execute('git', ['init', '--quiet'], { cwd: root });
	await execute('git', ['config', '--local', 'core.hooksPath', '.git/hooks'], {
		cwd: root
	});
	await installHook(root);
	const destination = path.join(root, '.git/hooks/pre-commit');
	const installed = await fs.readFile(destination, 'utf8');
	assert.match(installed, /--check-staged/);
	await installHook(root);
	assert.equal(await fs.readFile(destination, 'utf8'), installed);
	await fs.writeFile(destination, '#!/bin/sh\nexit 0\n');
	const originalError = console.error;
	console.error = quiet;
	try {
		await installHook(root);
	} finally {
		console.error = originalError;
	}
	assert.equal(process.exitCode, 1);
	process.exitCode = undefined;
	assert.equal(await fs.readFile(destination, 'utf8'), '#!/bin/sh\nexit 0\n');
});

test('standalone CLI loads local env and dev continues without credentials', async t => {
	const root = await fixture(t);
	const script = path.join(root, 'optimize-images.mjs');
	await fs.copyFile(
		new URL('../scripts/optimize-images.mjs', import.meta.url),
		script
	);
	const env = {
		...process.env,
		KRAKEN_API_KEY: '',
		KRAKEN_API_SECRET: '',
		CI: '',
		NODE_ENV: 'development'
	};
	const result = await execute(process.execPath, [script, '--on-dev'], {
		cwd: root,
		env
	});
	assert.equal(result.stdout, '');
	assert.match(
		result.stderr,
		/optimization skipped.*KRAKEN_API_KEY.*KRAKEN_API_SECRET/
	);
	await assert.rejects(
		execute(process.execPath, [script, '--check'], { cwd: root, env }),
		error => error.code === 1
	);
	await fs.writeFile(path.join(root, '.env.local'), 'CI=1\n');
	delete env.CI;
	const skipped = await execute(process.execPath, [script, '--on-dev'], {
		cwd: root,
		env
	});
	assert.equal(skipped.stdout, '');
	assert.equal(skipped.stderr, '');
	await execute(process.execPath, [script, '--dry-run'], { cwd: root, env });
});

test('manual and startup commands warn and succeed if either credential is missing', async t => {
	const root = await fixture(t);
	const script = path.join(root, 'optimize-images.mjs');
	await fs.copyFile(
		new URL('../scripts/optimize-images.mjs', import.meta.url),
		script
	);
	for (const flags of [[], ['--on-dev']]) {
		for (const [key, secret] of [
			['', 'test-secret'],
			['test-key', ''],
			[' ', ' ']
		]) {
			const result = await execute(process.execPath, [script, ...flags], {
				cwd: root,
				env: {
					...process.env,
					NODE_ENV: 'development',
					CI: '',
					KRAKEN_API_KEY: key,
					KRAKEN_API_SECRET: secret
				}
			});
			assert.equal(result.stdout, '');
			assert.match(result.stderr, /optimization skipped/);
			assert.equal(result.stderr.trim().split('\n').length, 1);
		}
	}
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
	await assert.rejects(
		fs.stat(path.join(root, 'kraken-images.manifest.json')),
		{ code: 'ENOENT' }
	);
});

test('manual and startup optimization failures exit successfully without console output', async t => {
	const root = await fixture(t);
	await fs.copyFile(
		new URL('../scripts/optimize-images.mjs', import.meta.url),
		path.join(root, 'optimize-images.mjs')
	);
	const harness = path.join(root, 'harness.mjs');
	await fs.writeFile(
		harness,
		`
import { main } from './optimize-images.mjs';
import * as fs from 'node:fs/promises';
globalThis.fetch = async () => {
 await fs.writeFile('request-marker', 'called');
 return new Response('', { status: 503 });
};
process.argv = [process.execPath, 'optimize-images.mjs', ...(process.env.TEST_MODE === 'on-dev' ? ['--on-dev'] : [])];
await main();
`
	);
	const env = {
		...process.env,
		NODE_ENV: 'development',
		CI: '',
		KRAKEN_API_KEY: 'test-key',
		KRAKEN_API_SECRET: 'test-secret'
	};
	for (const mode of ['optimize', 'on-dev']) {
		const result = await execute(process.execPath, [harness], {
			cwd: root,
			env: { ...env, TEST_MODE: mode }
		});
		assert.equal(result.stdout, '');
		assert.equal(result.stderr, '');
		assert.equal(
			await fs.readFile(path.join(root, 'request-marker'), 'utf8'),
			'called'
		);
		await assert.rejects(fs.stat(path.join(root, '.kraken-images.lock')), {
			code: 'ENOENT'
		});
	}
	assert.deepEqual(
		await fs.readFile(path.join(root, 'images/photo.png')),
		source
	);
	await fs.writeFile(path.join(root, 'kraken-images.config.json'), '{broken');
	const invalid = await execute(process.execPath, [harness], {
		cwd: root,
		env
	});
	assert.equal(invalid.stdout, '');
	assert.equal(invalid.stderr, '');
});

test('production does nothing and logs nothing before loading env or config', async t => {
	const root = await fixture(t);
	await fs.copyFile(
		new URL('../scripts/optimize-images.mjs', import.meta.url),
		path.join(root, 'optimize-images.mjs')
	);
	await fs.writeFile(path.join(root, 'kraken-images.config.json'), '{broken');
	await fs.mkdir(path.join(root, '.env.local'));
	const harness = path.join(root, 'production.mjs');
	await fs.writeFile(
		harness,
		`
import { main, run } from './optimize-images.mjs';
globalThis.fetch = () => { throw new Error('Production must not upload'); };
process.argv = [process.execPath, 'optimize-images.mjs', ...(process.env.TEST_MODE === 'on-dev' ? ['--on-dev'] : [])];
await main();
await run({ root: '/nonexistent-kraken-test-root', mode: process.env.TEST_MODE });
`
	);
	for (const mode of ['optimize', 'on-dev']) {
		for (const key of ['', 'test-key']) {
			const result = await execute(process.execPath, [harness], {
				cwd: root,
				env: {
					...process.env,
					NODE_ENV: 'production',
					TEST_MODE: mode,
					CI: '',
					KRAKEN_API_KEY: key,
					KRAKEN_API_SECRET: key
				}
			});
			assert.equal(result.stdout, '');
			assert.equal(result.stderr, '');
		}
	}
});
