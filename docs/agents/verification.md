# Verification Requirements

- Run `npx tsc --noEmit` before marking complete
- Run `npx prettier . --write` before marking complete
- For API changes, test with `curl`
- Avoid full builds unless necessary. Usually changes are being made in a dev loop with a dev server running, so the build step is not needed.
