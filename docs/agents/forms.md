# Forms

- Zod validation files live in `/lib/validators` and are imported client-side and server-side.
- Use react-hook-form with zod for forms.
- Prepopulate forms with dummy data in dev mode.
- Forms should validate on client-side and server-side.
- Inputs need `autocomplete` and meaningful `name`.
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`.
- Never block paste (`onPaste` + `preventDefault`).
- Labels clickable (`htmlFor` or wrapping control).
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`).
- Checkboxes/radios: label + control share single hit target (no dead zones).
- Submit button stays enabled until request starts; spinner during request.
- Errors inline next to fields; focus first error on submit.
- Placeholders end with `…` and show example pattern.
- `autocomplete="off"` on non-auth fields to avoid password manager triggers.
- Warn before navigation with unsaved changes (`beforeunload` or router guard).
