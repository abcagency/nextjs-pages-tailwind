import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const execute = promisify(execFile);
const hook = `#!/bin/sh
# kraken-images: credential-free check of the Git index
cd "$(git rev-parse --show-toplevel)" || exit 1
node scripts/optimize-images.mjs --check-staged
`;

export async function installHook(root = process.cwd()) {
	try {
		const { stdout } = await execute(
			'git',
			['rev-parse', '--git-path', 'hooks/pre-commit'],
			{ cwd: root }
		);
		const destination = path.resolve(root, stdout.trim());
		await fs.mkdir(path.dirname(destination), { recursive: true });
		try {
			await fs.writeFile(destination, hook, { flag: 'wx', mode: 0o755 });
		} catch (error) {
			if (error.code !== 'EEXIST') throw error;
			if ((await fs.readFile(destination, 'utf8')) !== hook) {
				throw new Error(
					'An existing pre-commit hook was preserved. Add node scripts/optimize-images.mjs --check-staged to your hook manager.'
				);
			}
		}
		console.log(`Installed image check: ${destination}`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(await fs.realpath(process.argv[1])).href
)
	await installHook();
