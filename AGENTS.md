# AGENTS.md

## Formatting

- Follow Prettier config from `.prettierrc` (trailing commas none, tabs, semicolons, single quotes, etc.).
- Respect `.editorconfig`: tabs for indent, LF line endings, trim trailing whitespace (except in Markdown).

## Language and framework

- Use JavaScript/JSX (no TypeScript in this repo).
- Use Next.js (pages router) for routing.
- Use TailwindCSS v4 for styling.
- Use framer motion for animations and transitions.

## Project structure

- Business logic and data retrieval live in `/lib`.
- Components live in `/components/modules`.
- Pages live in `/pages`.
- Hooks live in `/hooks`.
- Yup validation files live in `/lib/validators` and are imported client-side and server-side.

## State, forms, and effects

- Use nuqs for state that should persist in the URL (filters, sort order, visibility).
- Use react-hook-form with yup for forms.
- Avoid using `useEffect` whenever possible.
- Prefer `const` over `let`.

## Output behavior

- Output the entire file when changes are made throughout.
- If changes are limited to a specific section/function/component, output just that section/function/component.

## Commit messages

- Use past tense.
- Keep messages general (describe semantics, not file names or components).
