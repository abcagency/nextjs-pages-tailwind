import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const gitExec = promisify(execFile);
const configName = 'kraken-images.config.json';
const manifestName = 'kraken-images.manifest.json';
const extensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
const defaults = {
	roots: ['images', 'public'],
	exclude: [],
	lossy: true,
	onDev: true,
	maxFileBytes: 20 * 1024 * 1024,
	timeoutMs: 120000
};

export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const emptyManifest = () => ({ version: 1, files: {} });
const plainObject = value =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

function relativePath(value) {
	return (
		typeof value === 'string' &&
		value.length > 0 &&
		!path.posix.isAbsolute(value) &&
		!value.includes('\\') &&
		!value.split('/').some(part => ['', '.', '..'].includes(part)) &&
		!value.includes(':')
	);
}

export function validateConfig(input) {
	if (!plainObject(input)) throw new Error('Image config must be an object.');
	const config = { ...defaults, ...input };
	const allowed = new Set([...Object.keys(defaults), 'quality']);
	if (Object.keys(input).some(key => !allowed.has(key))) {
		throw new Error(
			'Unknown image config field; see docs/image-optimization.md.'
		);
	}
	for (const name of ['roots', 'exclude']) {
		if (!Array.isArray(config[name]) || !config[name].every(relativePath)) {
			throw new Error(
				`${name} must contain repository-relative paths without globs.`
			);
		}
	}
	if (config.roots.length === 0)
		throw new Error('Configure at least one image root.');
	if (typeof config.lossy !== 'boolean' || typeof config.onDev !== 'boolean') {
		throw new Error('lossy and onDev must be booleans.');
	}
	for (const name of ['maxFileBytes', 'timeoutMs']) {
		if (!Number.isSafeInteger(config[name]) || config[name] <= 0) {
			throw new Error(`${name} must be a positive integer.`);
		}
	}
	if (
		config.quality !== undefined &&
		(!config.lossy ||
			!Number.isInteger(config.quality) ||
			config.quality < 1 ||
			config.quality > 100)
	) {
		throw new Error(
			'quality requires lossy: true and an integer from 1 to 100.'
		);
	}
	return config;
}

export function validateManifest(value) {
	if (!plainObject(value) || value.version !== 1 || !plainObject(value.files)) {
		throw new Error(
			'Invalid image manifest; restore it from Git or resolve its merge conflict.'
		);
	}
	for (const [name, record] of Object.entries(value.files)) {
		if (
			!relativePath(name) ||
			!plainObject(record) ||
			!['inputHash', 'outputHash', 'optionsHash'].every(key =>
				/^[a-f0-9]{64}$/.test(record[key])
			) ||
			!['originalBytes', 'retainedBytes'].every(
				key => Number.isSafeInteger(record[key]) && record[key] > 0
			) ||
			record.retainedBytes > record.originalBytes ||
			typeof record.processedAt !== 'string'
		) {
			throw new Error(
				`Invalid manifest entry: ${name}. Restore or resolve the manifest.`
			);
		}
	}
	return value;
}

async function readJson(file, fallback) {
	try {
		return JSON.parse(await fs.readFile(file, 'utf8'));
	} catch (error) {
		if (error.code === 'ENOENT') return fallback;
		throw new Error(
			`Cannot read ${path.basename(file)}; check JSON syntax and merge conflicts.`
		);
	}
}

async function regularFile(root, name) {
	const absolute = path.join(root, name);
	const info = await fs.lstat(absolute);
	const resolved = await fs.realpath(absolute);
	if (!info.isFile() || resolved !== absolute) {
		throw new Error(`Refusing a symlink or non-regular image file: ${name}`);
	}
	return info;
}

async function scan(root, config) {
	const names = new Set();
	async function visit(name) {
		if (
			config.exclude.some(
				excluded => name === excluded || name.startsWith(`${excluded}/`)
			)
		)
			return;
		if (
			name
				.split('/')
				.some(part =>
					['.git', 'node_modules', '.next', 'out', 'build'].includes(part)
				)
		)
			return;
		let info;
		try {
			info = await fs.lstat(path.join(root, name));
		} catch (error) {
			if (error.code === 'ENOENT') return;
			throw error;
		}
		if (info.isSymbolicLink())
			throw new Error(`Refusing a symlink in image roots: ${name}`);
		if ((await fs.realpath(path.join(root, name))) !== path.join(root, name)) {
			throw new Error(
				`Refusing an image root reached through a symlink: ${name}`
			);
		}
		if (info.isDirectory()) {
			for (const child of await fs.readdir(path.join(root, name)))
				await visit(`${name}/${child}`);
		} else if (
			info.isFile() &&
			extensions.has(path.extname(name).toLowerCase())
		) {
			names.add(name);
		}
	}
	for (const name of config.roots) await visit(name);
	return [...names].sort();
}

async function git(root, args) {
	return (
		await gitExec('git', args, {
			cwd: root,
			encoding: 'buffer',
			maxBuffer: 64 * 1024 * 1024
		})
	).stdout;
}

async function stagedSnapshot(root) {
	const listing = (await git(root, ['ls-files', '--stage', '-z'])).toString();
	const entries = new Map();
	for (const line of listing.split('\0').filter(Boolean)) {
		const tab = line.indexOf('\t');
		const [mode, object, stage] = line.slice(0, tab).split(' ');
		if (stage !== '0')
			throw new Error('Resolve Git index conflicts before checking images.');
		entries.set(line.slice(tab + 1), { mode, object });
	}
	async function read(name, fallback) {
		const entry = entries.get(name);
		return entry
			? JSON.parse(
					(await git(root, ['cat-file', 'blob', entry.object])).toString()
				)
			: fallback;
	}
	const config = validateConfig(await read(configName, {}));
	const manifest = validateManifest(await read(manifestName, emptyManifest()));
	const names = [...entries.keys()]
		.filter(
			name =>
				extensions.has(path.extname(name).toLowerCase()) &&
				config.roots.some(dir => name === dir || name.startsWith(`${dir}/`)) &&
				!config.exclude.some(dir => name === dir || name.startsWith(`${dir}/`))
		)
		.sort();
	return {
		config,
		manifest,
		names,
		read: async name => {
			const entry = entries.get(name);
			if (!['100644', '100755'].includes(entry.mode))
				throw new Error(`Refusing staged symlink: ${name}`);
			return git(root, ['cat-file', 'blob', entry.object]);
		}
	};
}

async function atomicWrite(file, bytes, mode = 0o644) {
	const temp = `${file}.${randomUUID()}.kraken-tmp`;
	try {
		await fs.writeFile(temp, bytes, { flag: 'wx', mode });
		await fs.rename(temp, file);
	} finally {
		await fs.rm(temp, { force: true });
	}
}

function imageType(bytes) {
	if (
		bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
	)
		return 'png';
	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg';
	if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString()))
		return 'gif';
	if (
		bytes.subarray(0, 4).toString() === 'RIFF' &&
		bytes.subarray(8, 12).toString() === 'WEBP'
	)
		return 'webp';
	if (
		bytes.subarray(4, 8).toString() === 'ftyp' &&
		['avif', 'avis'].includes(bytes.subarray(8, 12).toString())
	)
		return 'avif';
	return undefined;
}

async function boundedBody(response, limit) {
	if (Number(response.headers.get('content-length')) > limit)
		throw new Error('Kraken download exceeds the configured limit.');
	if (!response.body) throw new Error('Kraken returned an empty download.');
	const reader = response.body.getReader();
	const chunks = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > limit)
				throw new Error('Kraken download exceeds the configured limit.');
			chunks.push(Buffer.from(value));
		}
	} finally {
		await reader.cancel();
	}
	return Buffer.concat(chunks);
}

async function optimize(name, source, config, credentials, fetchImpl) {
	const form = new FormData();
	const options = {
		lossy: config.lossy,
		...(config.quality === undefined ? {} : { quality: config.quality })
	};
	form.append(
		'data',
		JSON.stringify({ auth: credentials, wait: true, ...options })
	);
	form.append('file', new Blob([source]), path.basename(name));
	const signal = AbortSignal.timeout(config.timeoutMs);
	let result;
	try {
		const response = await fetchImpl('https://api.kraken.io/v1/upload', {
			method: 'POST',
			body: form,
			signal,
			redirect: 'error'
		});
		if (!response.ok)
			throw new Error(
				`Kraken upload returned HTTP ${response.status}. Check account quota and credentials.`
			);
		result = JSON.parse((await boundedBody(response, 1024 * 1024)).toString());
	} catch (error) {
		if (error.message.startsWith('Kraken upload returned')) throw error;
		const code = error.cause?.code;
		const detail =
			typeof code === 'string' && /^[A-Z0-9_]+$/.test(code) ? ` (${code})` : '';
		throw new Error(
			`Kraken upload failed or timed out${detail}. Source is unchanged; retry manually.`
		);
	}
	// Do not print raw API responses; they may echo credentials or signed URLs.
	if (
		result.success !== true ||
		typeof result.kraked_url !== 'string' ||
		!Number.isSafeInteger(result.kraked_size) ||
		result.kraked_size <= 0
	) {
		throw new Error(
			'Kraken did not return a successful image result. Check account quota, credentials, and format.'
		);
	}
	const url = new URL(result.kraked_url);
	if (
		url.hostname !== 'dl.kraken.io' ||
		!['http:', 'https:'].includes(url.protocol) ||
		url.username ||
		url.password ||
		url.port
	) {
		throw new Error(
			'Kraken returned an unexpected download host. Source is unchanged.'
		);
	}
	url.protocol = 'https:';
	let output;
	try {
		const download = await fetchImpl(url.href, { signal, redirect: 'error' });
		if (!download.ok) throw new Error('Download failed.');
		output = await boundedBody(download, config.maxFileBytes);
	} catch {
		throw new Error(
			'Kraken download failed or timed out. Source is unchanged; retry manually.'
		);
	}
	if (
		output.length !== result.kraked_size ||
		imageType(output) !== imageType(source) ||
		!imageType(output)
	) {
		throw new Error(
			'Kraken returned an unexpected image format or byte count. Source is unchanged.'
		);
	}
	return output.length < source.length ? output : source;
}

export async function run({
	root = process.cwd(),
	mode = 'optimize',
	fetchImpl = fetch,
	log = console.log,
	warn = console.warn,
	credentials
} = {}) {
	const optimizing = ['optimize', 'on-dev'].includes(mode);
	if (
		(optimizing && process.env.NODE_ENV === 'production') ||
		(mode === 'on-dev' && process.env.CI)
	)
		return { pending: [], savedBytes: 0 };
	root = await fs.realpath(root);
	const staged =
		mode === 'check-staged' ? await stagedSnapshot(root) : undefined;
	const config =
		staged?.config ??
		validateConfig(await readJson(path.join(root, configName), {}));
	if (mode === 'on-dev' && !config.onDev) return { pending: [], savedBytes: 0 };
	credentials ??= {
		api_key: process.env.KRAKEN_API_KEY,
		api_secret: process.env.KRAKEN_API_SECRET
	};
	if (
		optimizing &&
		(!credentials.api_key?.trim() || !credentials.api_secret?.trim())
	) {
		warn(
			'Images: optimization skipped. Set KRAKEN_API_KEY and KRAKEN_API_SECRET in .env.local.'
		);
		return { pending: [], savedBytes: 0 };
	}
	const manifest =
		staged?.manifest ??
		validateManifest(
			await readJson(path.join(root, manifestName), emptyManifest())
		);
	const names = staged?.names ?? (await scan(root, config));
	const optionsHash = hash(
		JSON.stringify({
			version: 1,
			lossy: config.lossy,
			quality: config.quality ?? null
		})
	);
	const snapshots = new Map();
	const pending = [];
	for (const name of names) {
		if (!staged) {
			const info = await regularFile(root, name);
			if (info.size > config.maxFileBytes || info.size === 0)
				throw new Error(`Image is empty or exceeds maxFileBytes: ${name}`);
		}
		const bytes = staged
			? await staged.read(name)
			: await fs.readFile(path.join(root, name));
		const outputHash = hash(bytes);
		snapshots.set(name, { outputHash, size: bytes.length });
		if (
			manifest.files[name]?.outputHash !== outputHash ||
			manifest.files[name]?.optionsHash !== optionsHash
		)
			pending.push(name);
	}
	log(
		`Images: ${names.length - pending.length} current, ${pending.length} pending.`
	);
	if (['check', 'check-staged', 'dry-run'].includes(mode)) {
		for (const name of pending) log(`  ${name}`);
		if (pending.length)
			log(
				'Run npm run images:optimize, review, and stage images plus kraken-images.manifest.json.'
			);
		return { pending, savedBytes: 0 };
	}
	const removed = Object.keys(manifest.files).filter(
		name => !names.includes(name)
	);
	if (!pending.length && !removed.length) return { pending: [], savedBytes: 0 };
	const lock = path.join(root, '.kraken-images.lock');
	try {
		await fs.mkdir(lock);
	} catch (error) {
		if (error.code === 'EEXIST')
			throw new Error(
				'Another image run holds .kraken-images.lock. Remove it only after confirming that run has stopped.'
			);
		throw error;
	}
	let savedBytes = 0;
	const persist = () =>
		atomicWrite(
			path.join(root, manifestName),
			`${JSON.stringify(manifest, null, '\t')}\n`
		);
	try {
		// Reload under the lock so concurrent runs cannot overwrite a newer manifest.
		Object.assign(
			manifest,
			validateManifest(
				await readJson(path.join(root, manifestName), emptyManifest())
			)
		);
		const knownRecords = Object.values(manifest.files);
		for (const name of removed) delete manifest.files[name];
		if (removed.length) await persist();
		for (const name of pending) {
			const info = await regularFile(root, name);
			if (info.size > config.maxFileBytes || info.size === 0)
				throw new Error(`Image is empty or exceeds maxFileBytes: ${name}`);
			const source = await fs.readFile(path.join(root, name));
			const inputHash = hash(source);
			if (inputHash !== snapshots.get(name).outputHash)
				throw new Error(`Image changed while scanning: ${name}. Run again.`);
			if (!imageType(source))
				throw new Error(`Unrecognized raster image: ${name}`);
			const known = [...knownRecords, ...Object.values(manifest.files)].find(
				record =>
					record.outputHash === inputHash && record.optionsHash === optionsHash
			);
			const output = known
				? source
				: await optimize(name, source, config, credentials, fetchImpl);
			await regularFile(root, name);
			if (hash(await fs.readFile(path.join(root, name))) !== inputHash)
				throw new Error(
					`Image changed during optimization: ${name}. New content was preserved; run again.`
				);
			if (output !== source)
				await atomicWrite(path.join(root, name), output, info.mode & 0o777);
			manifest.files[name] = known ?? {
				inputHash,
				outputHash: hash(output),
				optionsHash,
				originalBytes: source.length,
				retainedBytes: output.length,
				processedAt: new Date().toISOString()
			};
			await persist();
			savedBytes += source.length - output.length;
			log(
				`  ${name}: ${known ? 'already processed bytes' : `${source.length} -> ${output.length} bytes`}`
			);
		}
	} finally {
		await fs.rmdir(lock);
	}
	log(
		`Images: saved ${savedBytes} bytes. Review and commit images with ${manifestName}.`
	);
	return { pending: [], savedBytes };
}

export async function main() {
	const flags = process.argv.slice(2);
	// Production does not read local env/config, scan images, or contact Kraken.
	if (process.env.NODE_ENV === 'production') return;
	const modes = {
		'--check': 'check',
		'--check-staged': 'check-staged',
		'--dry-run': 'dry-run',
		'--on-dev': 'on-dev'
	};
	if (flags.length > 1 || (flags.length && !modes[flags[0]])) {
		console.error(
			'Usage: node scripts/optimize-images.mjs [--check | --check-staged | --dry-run | --on-dev]'
		);
		process.exitCode = 1;
		return;
	}
	const mode = modes[flags[0]] ?? 'optimize';
	const optimizing = ['optimize', 'on-dev'].includes(mode);
	const messages = [];
	try {
		if (mode === 'on-dev' && process.env.CI) return;
		if (optimizing) {
			for (const name of [
				'.env.development.local',
				'.env.local',
				'.env.development',
				'.env'
			]) {
				try {
					process.loadEnvFile(name);
				} catch (error) {
					if (error.code !== 'ENOENT') throw error;
				}
			}
		}
		const result = await run({
			mode,
			log: optimizing ? message => messages.push(message) : console.log
		});
		for (const message of messages) console.log(message);
		if (['check', 'check-staged'].includes(mode) && result.pending.length)
			process.exitCode = 1;
	} catch (error) {
		// Optional optimization must never interrupt development or manual use.
		if (optimizing) return;
		console.error(`Images: ${error.message}`);
		process.exitCode = 1;
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(await fs.realpath(process.argv[1])).href
)
	await main();
