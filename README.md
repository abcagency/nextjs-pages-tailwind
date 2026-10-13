<!-- markdownlint-disable -->

[![AB&C](https://avatars3.githubusercontent.com/u/22617576?s=200&v=4)](https://abccreative.com/)

<!-- markdownlint-enable -->

# Next.js Starter Tailwind

A minimal starter template using Next.js with pages routing and Tailwind.

![Repo Size](https://img.shields.io/github/repo-size/badges/shields.svg?style=for-the-badge)
[![License: 0BSD](https://img.shields.io/badge/license-0BSD-blue.svg?style=for-the-badge)](http://unlicense.org/)

---

## Directory Layout

```shell
├── /components/                # Components
├── /data/                      # Site data
├── /hooks/                     # Custom hooks
├── /images/                    # Images
├── /public/                    # Static assets
├── /pages/                     # Pages
├── /styles/                    # Styles
├── /types/                     # Types
├── /.env.*                     # Environment variables
├── /next-config.js             # Next.js configuration
├── /postcss.config.js          # PostCSS config
├── /tailwind.config.js         # Tailwind config
```

---

## Features

### Tech Stack

- [Next.js](https://nextjs.org/)
- [Apollo](https://www.apollographql.com/)

### UI

- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [BaseUI](https://base-ui.com/)
- [Motion](https://motion.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Iconify](https://iconify.design/)

---

## Get started

Create a new Next.js project using this starter:

```sh
npx create-next-app my-new-website -e "https://github.com/abcagency/nextjs-pages-tailwind"
```

```sh
cd my-new-website
npm i
```

Run the project in development mode ([http://localhost:3000](http://localhost:3000)):

```sh
npm run dev
```

### Lint

- `npm run lint` - Run ESLint

### Build your site for production

```sh
npm run build
```

---

## Image Minification

Images are optimized with [Kraken.io](https://kraken.io/) before `npm run dev`
starts. The script runs once per startup and uses a SHA-256 manifest to skip
unchanged images, avoiding repeated API calls. It also detects changes to the
compression settings.

### Setup

Use Node.js 22 or newer. Add your Kraken.io API credentials to the ignored
`.env.local` file:

```dotenv
KRAKEN_API_KEY=your-api-key
KRAKEN_API_SECRET=your-api-secret
```

Keep these credentials local and use the variable names shown above. If either
credential is missing, optimization logs a console warning and exits successfully.
Other optimization failures are silent and do not interrupt development or the
manual command. Use `npm run images:check` to identify images still pending.

### Commands

- `npm run images:optimize` - Optimize new or changed images and update the
  manifest.
- `npm run images:dry-run` - List pending images without uploading or changing
  files.
- `npm run images:check` - Check for pending images; exit with an error if any
  need processing.
- `npm run images:install-hook` - Install the optional local pre-commit check.
- `npm run test:images` - Run the image workflow tests without real Kraken uploads.

There is no continuous watcher. If you add or edit images while the dev server is
running, run `npm run images:optimize` before committing. Optimization does not
run during production builds or requests. With `NODE_ENV=production`, the CLI
skips processing entirely and logs nothing, even without credentials.

### Configuration and Committing

Edit `kraken-images.config.json` to choose image roots and exclusions. By default,
the script processes JPG/JPEG, PNG, GIF, WebP, and AVIF files in `images/` and
`public/`, using Kraken's automatic lossy compression. SVG and ICO files are
excluded. Set `onDev` to `false` to disable the startup pass while keeping manual
commands available. Set `lossy` to `false` for lossless compression. By default,
`quality` is unset so Kraken chooses the compression level. See the workflow
documentation before changing quality settings on previously compressed images.

Smaller results replace source images in place. If Kraken returns an equal or
larger file, the original is kept and the successful attempt is recorded. Review
and commit image changes together with `kraken-images.manifest.json`. Keep the
manifest in Git so other developers can skip images already processed. The script
does not stage or commit files automatically.

The optional pre-commit hook checks the **staged** images, configuration, and
manifest without credentials or API calls. If it blocks a commit, optimize the
pending images, review the results, and stage the images and manifest together.
Each developer installs the hook locally; existing unrelated hooks are preserved.
For a repository with an existing hook manager, add
`node scripts/optimize-images.mjs --check-staged` to its pre-commit workflow.

See the [full workflow documentation](docs/image-optimization.md) for
configuration, recovery, and workflow tradeoffs. To apply this integration to
another repository, use the `migrate-image-minification` skill from
[AB&C Agent Skills](https://github.com/abcagency/abc-skills).

---

## UI Documentation

See `docs/components/ui-components.md` for the compound form API, masking, and the
new Base UI wrappers.

### Run production build

```sh
npm run build
```

---

## Upgrade `package.json` package versions

Install [npm-check-updates](https://www.npmjs.com/package/npm-check-updates):

```sh
npm i -g npm-check-updates
```

Upgrade a project's package file:

```sh
# Inside of project root folder

ncu -u    # Upgrade package.json
npm i     # Update installed packages and package-lock.json
```

---

## [React Scan](https://github.com/aidenybai/react-scan)

React Scan automatically detects performance issues in your React app.

```sh
# Start normal dev server

npm run dev

# Start React Scan

npx react-scan@latest http://localhost:3000
```

---

## [Unlighthouse](https://unlighthouse.dev/)

Run lighthouse performance metrics on your entire site.

```sh
npx unlighthouse --site <your-site>
```

`<your-site>` is the URL of your site, e.g. `https://www.example.com`.

---

## Contributors

<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center" style=""><img src="https://avatars.githubusercontent.com/u/6616625?s=60&v=4" width="100px;"  style="background-color: #000; border-radius: 9999px;" alt="Jason Cockerham"/><br /><sub><b>Jason Cockerham</b></sub></td>
		<td align="center"><img src="https://avatars.githubusercontent.com/u/650202?s=120&v=4" width="100px;"  style="border-radius: 9999px;" alt="Chris Marts"/><br /><sub><b>Chris Marts</b></sub></td>
  </tr>
</table>
<!-- markdownlint-enable -->

---

### Enjoy

:metal:
