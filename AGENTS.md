# AGENTS.md

## Formatting

- Follow Prettier config from `.prettierrc` (trailing commas none, tabs, semicolons, single quotes, etc.).
- Respect `.editorconfig`: tabs for indent, LF line endings, trim trailing whitespace (except in Markdown).

## Language and framework

- Use JavaScript/JSX (no TypeScript in this repo).
- Use Next.js (pages router) for routing.
- Use TailwindCSS v4 for styling.
- Use motion/react for animations and transitions.
- Use React hooks and functional components.
- Use ES6+ features (arrow functions, destructuring, template literals, etc.).
- Use async/await for asynchronous code.
- Prefer BaseUI components when possible.

## Project structure

- Business logic and data retrieval live in `/lib`.
- General layout components live in `/components/layout`.
- UI components live in `/components/modules`.
- Pages live in `/pages`.
- Hooks live in `/hooks`.
- Data files live in `/data`.

## Components

- Whenever logical, consider breaking files into smaller components. Especially if a component exceeds ~150 lines or has multiple responsibilities.
- Whenever logical, avoid duplicating code within the same file or across files; create reusable components or functions instead.
- Use descriptive names for components and files (e.g., `UserProfileCard` instead of `Card1`).
- Use kebab case for file names (e.g., `user-profile-card.js`).
- Prefer functional components and React hooks over class components.

## State, forms, and effects

- Use nuqs for state that should persist in the URL (filters, sort order, visibility, dialog/sheet open state).
- Avoid using `useEffect` whenever possible.
- Prefer `const` over `let`.

## Forms

- Yup validation files live in `/lib/validators` and are imported client-side and server-side.
- Use react-hook-form with yup for forms.
- Prepopulate forms with dummy data in dev mode.
- Forms should validate on client-side and server-side.

## Commit messages

- Use past tense.
- Keep messages general (describe semantics, not file names or components).
