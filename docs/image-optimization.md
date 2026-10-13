# Kraken.io repository image optimization

## Chosen workflow

Run once before `npm run dev`, optimize new or changed images in place, and commit optimized source plus `kraken-images.manifest.json`. A successful hash match uses no API quota. There is no watcher and no build or production hook. Both startup and manual optimization warn once and exit successfully if either credential is missing; other optimization failures exit successfully without console output. Explicit checks still fail for pending images or invalid configuration outside production. With `NODE_ENV=production`, the CLI returns immediately without reading local env/config, scanning, uploading, or logging.

| Trigger                          | Advantages                                                   | Costs and limitations                                                                                |
| -------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Manual command                   | Predictable uploads, easy review                             | You must remember it                                                                                 |
| Dev startup, chosen default      | Fits normal work; hashes avoid repeated uploads              | Images added later require a manual run or restarting development                                    |
| Continuous watcher               | Processes new images during the session                      | May upload intermediate exports, use quota, and conflict with editors                                |
| Automatic optimization on commit | Covers late additions                                        | Network latency and credentials interrupt commits; automatic staging interferes with partial staging |
| Optional check on commit         | Offline, checks actual staged bytes, reminds you when needed | Each developer installs the hook; hooks can be bypassed                                              |
| CI check                         | Enforces the manifest centrally without secrets              | Existing pending assets must be processed first; CI cannot compress without credentials              |
| CI optimization                  | Central credentials and automation                           | Requires a bot PR or artifact policy to return changes to Git                                        |
| Build or production requests     | Useful for dynamic uploads if results live in object storage | Adds dependencies, quota use, and latency; deployment outputs do not flow back to source             |

Production optimization belongs in an upload/CMS ingestion pipeline with durable result storage when images are created at runtime. Repository assets already have a development and Git review workflow. Next.js image delivery can still generate responsive variants; this integration does not alter Next's image configuration or generated build outputs.

## Credentials and commands

Use Node 22 or newer. Add the following to an ignored `.env.local` file, filling in your Kraken account credentials locally:

```dotenv
KRAKEN_API_KEY=your-api-key
KRAKEN_API_SECRET=your-api-secret
```

Do not use `NEXT_PUBLIC_` prefixes. The script reads `.env.development.local`, `.env.local`, `.env.development`, then `.env`, without overriding variables already present. Use simple literal values; Node's environment loader does not expand `$OTHER_VARIABLE` references. Optimization CLI commands use these development files even if run outside dev startup; checks never load environment files.

```sh
npm run images:dry-run        # List pending files; no requests, credentials, or writes
npm run images:check          # Same check; exits 1 if anything needs processing
npm run images:optimize       # Upload pending images and save smaller results
npm run dev                   # One pass via predev, then starts Next
npm run images:install-hook   # Optional, local Git hook; preserves existing hooks
npm run test:images           # Local behavioral tests, no real Kraken requests
```

Images added while the dev server is already running need `npm run images:optimize`. To avoid forgetting, install the optional hook. It does no uploading or staging. When it blocks a commit, optimize, review, then stage the intended image changes and manifest together. Re-run the commit. If your repo uses Husky, Lefthook, or another hook manager, add this command to its existing pre-commit flow:

```sh
node scripts/optimize-images.mjs --check-staged
```

The installer respects Git's configured hook path and refuses to replace an unrelated existing pre-commit hook. Do not install it into this template unless you want it active for your own checkout. Git hooks are local, not transferred by cloning. CI can optionally run `npm run images:check` after checkout/install; it needs no Kraken secrets. No CI workflow is installed by default.

## Configuration

`kraken-images.config.json` is committed. Example:

```json
{
	"roots": ["images", "public"],
	"exclude": ["public/vendor", "images/originals"],
	"lossy": true,
	"onDev": true,
	"maxFileBytes": 20971520,
	"timeoutMs": 120000
}
```

- Roots and exclusions are exact repository-relative paths or directory prefixes, using `/`. No globs, absolute paths, or `..`. Missing roots are fine; overlapping roots are deduplicated. Roots may also select individual files.
- Supported extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, case-insensitive. SVGs, ICO files, fonts, remote CMS assets, and build outputs are excluded. Symlinks within configured roots are refused. Choose roots that contain repository-owned assets; non-Git local image files in them are included in working-tree runs.
- `lossy: true` is the default, using Kraken's automatic quality selection for stronger compression, matching the web interface's Lossy mode. No custom `quality` is supplied by default. Review resulting images visually.
- Set `lossy: false` for lossless compression that preserves visual image data. Kraken's metadata handling is separate; this integration doesn't request metadata preservation, format conversion, or resizing. Keep archival originals outside the processed roots if needed.
- An optional integer `quality` from 1–100 is accepted only with lossy mode. Do not add quality in lossless mode. Changed compression settings make current files pending again; deliberately lossy processing of previously compressed source can compound quality loss. Prefer restoring original inputs before changing settings.
- `onDev: false` disables startup processing while keeping explicit commands available. Startup also skips when `CI` is set or `NODE_ENV=production`. Direct `next dev` bypasses npm's `predev` lifecycle.
- `maxFileBytes` is a local safety limit, not a claimed Kraken account limit. `timeoutMs` covers each upload and its subsequent download. Large images may exceed it; consider a purpose-built async ingestion workflow for those cases.

## Manifest and retained-byte hashes

The committed manifest contains version 1 and a `files` object keyed by relative file paths. Each processed file records:

```json
{
	"inputHash": "sha256-of-uploaded-source",
	"outputHash": "sha256-of-retained-bytes-on-disk",
	"optionsHash": "sha256-of-compression-options-and-algorithm-version",
	"originalBytes": 123456,
	"retainedBytes": 78901,
	"processedAt": "2026-10-13T12:00:00.000Z"
}
```

The displayed hash labels illustrate the schema; real hashes are 64 hexadecimal characters. A file is current only when its path's `outputHash` matches current bytes and its `optionsHash` matches `lossy`/`quality`. Modification times don't matter. The options hash excludes scan roots, exclusions, timeouts, and startup preferences, so those changes don't force recompression.

The original is retained when output is equal or larger, and that successful attempt is recorded to prevent repeated paid uploads. Renamed or duplicated bytes can reuse an existing successful output record during optimization. Deleted or excluded entries are pruned during an optimization pass. Checks report missing path entries as pending even if a rename can be resolved locally without uploading.

When adding this workflow to an existing repository, start with an empty manifest so its existing images are pending. Repositories created from the updated template may already have current entries for its bundled images. Do not fabricate processed entries to make a check pass. Credentials and a successful optimization pass are needed to establish the baseline.

## Failures, recovery, and review

Uploads run serially and stop silently on the first failure. Optimization commands do not signal failures through their exit status; use `images:check` or dry-run outside production to discover pending work. Successful progress logs are printed after the batch succeeds; a failed batch emits none. There are no automatic retries: an upload timeout may already have consumed quota. Each completed file is recorded immediately, so the next run skips those successes. A `.kraken-images.lock` directory prevents concurrent writing runs. After an interrupted process, confirm it has stopped before removing a stale lock. Temporary `.kraken-tmp` files are ignored and may be removed after interruption.

An image and its manifest are individually replaced with atomic renames. They are not a single transaction: interruption between those writes can leave optimized bytes pending and require another upload. Restore a consistent image/manifest pair from Git if needed. Keep and review them together. The script checks for concurrent edits just before replacement; stop editing an image during optimization to avoid the remaining filesystem race between that check and rename.

Failed uploads, malformed API responses, rejected download hosts, unexpected file signatures, byte-count mismatches, and downloads exceeding the local limit do not mark a file processed. The downloaded bytes must match the original raster format, but signature checks are not a complete image decode or visual-quality test. Review changed assets visually, especially with lossy compression. The script never stages or commits changes automatically.

Do not delete the manifest as routine cleanup: it prevents repeated compression and quota use. Resolve merge conflicts by retaining records whose output hashes match the selected images and compression settings; then run the check. If unsure, restore the manifest from Git and run optimization for remaining pending files.

## API implementation and authoritative references

The script uses native `fetch`, `FormData`, and `Blob` to POST a JSON `data` field and binary `file` to `https://api.kraken.io/v1/upload`. Options include `auth`, `wait: true`, and `lossy`, with optional `quality`. It downloads `kraked_url` immediately, checks `kraked_size`, validates the raster signature, and keeps only smaller output. The download must be on `dl.kraken.io`; documented legacy HTTP URLs are upgraded to HTTPS. Redirects are refused. If Kraken changes its download host, verify official documentation before adjusting this restriction.

This local CLI uses `wait: true` to avoid needing a public callback server. Kraken recommends callbacks for workloads where large-image timeouts are a concern. Review current account limits before large batches; this integration does not embed pricing or quota assumptions.

- [Direct upload API](https://kraken.io/docs/upload-url)
- [Wait and callback options](https://kraken.io/docs/wait-callback)
- [Lossless optimization](https://kraken.io/docs/lossless-optimization)
- [Custom image quality](https://kraken.io/docs/custom-image-quality)
- [Current OpenAPI reference](https://api.kraken.io/v1/docs)
