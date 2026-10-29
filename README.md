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

## Staff Analytics Exclusion

Visit any page with `?exclude=true` (or `&exclude=true` if it already has a query) to exclude this browser from tracking. Use `?exclude=false` to clear the preference. Missing or unrecognized values leave it unchanged; exact lowercase `true` and `false` take precedence over the cookie. If repeated, the first `exclude` value wins.

A small red dot in the top-right corner means this browser is explicitly excluded. Hover or keyboard-focus it for “Analytics excluded.” It is an indicator, not a toggle. Automatic development/preview suppression alone does not show the dot.

The host-only `hc_tracking_excluded` cookie applies to all paths on the **current hostname in this browser only**. Other browsers, devices and subdomains need their own preference. It requests ten years of persistence, renewed on excluded visits, with `SameSite=Lax` and `Secure` on HTTPS. Browser lifetime limits, blocked storage and clearing cookies can shorten or prevent persistence.

Tracking stays off until the browser policy resolves. GTM and custom analytics events use the same policy, including on the first exclusion visit. Exclusion controls must be opened with a full page load (for example, enter the URL in the address bar or use a normal document link). The policy resolves once per page load; client-side route and hash changes do not update it. Previously sent events cannot be undone.

Tracking also requires a production build, an exact hostname match with `data/site.json` → `url`, and a production deployment context. Local/IP/test hosts, preview/staging/development hostnames, Netlify preview/branch hostnames containing `--` and non-production deployment contexts are suppressed. Production `.netlify.app` sites and embedded widgets can track when their own hostname matches `site.url`; embedding does not change the hostname used by this policy. Automatic hostname suppression does not show the red dot or set the exclusion cookie. Netlify `CONTEXT` and Vercel `VERCEL_ENV` are captured at build time; builds outside those platforms default to production context, with the build and hostname restrictions still enforced. Keep `site.url` set to the canonical production hostname. Development overrides cannot bypass the policy.

The current starter has only GTM and the custom event helper; its GTM ID is empty until configured. There are no Iubenda, marketing, footer tracker or Marker.io loaders. Essential forms, maps, videos, structured data, ordinary policy links and preview feedback tools remain independent of tracking. Future analytics/marketing/consent loaders (including Iubenda) must use `useTrackingPolicy()` and recheck `tracking.initialize()` before starting; custom events must go through `trackEvent`. Do not put trackers in server-rendered script tags, `beforeInteractive` scripts or the general-purpose `useScript` hook. Exclusion does not disable analytics internal to essential third-party embeds.

There are currently no active redirects in `data/redirects.ts`. Next's redirect query forwarding is covered by `npm run test:tracking`; future redirect destinations must retain `exclude` and avoid overriding it with a fixed value. Redirects across hostnames retain the query control, but cookies cannot cross hostname boundaries.

Verification: `npm run test:tracking`, `npm run lint`, and `npx tsc --noEmit`. Browser checks and a production deployment/network check are separate verification steps; unit/static checks do not establish that no production requests were made.
