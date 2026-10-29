# Project instructions

- Use English for new identifiers, scripts, folders, technical filenames, comments, and technical documentation. Keep the interface and academic prose in Spanish. Preserve original source filenames, data fields, and required external identifiers.
- Treat `src/engine.js` and `docs/REGLAS.md` as the current game specification. Historical documents and `CONTEXTO_PARA_CODEX.md` are dated snapshots; see `docs/antecedentes/LEER_PRIMERO.md`.
- Route decisions through `applyAction`. Keep accounting and scoring in the engine rather than duplicating them in React.
- For rule changes, update the engine, meaningful tests, interface guide, current rules, and academic guide together. Preserve version 2 rules for deployment-only work.
- Install with `npm ci` and run `npm run check`. Validate assets beneath a repository subdirectory when changing publication configuration.
- Keep dependencies, generated output, archives, secrets, local reference PDFs, and personal game exports out of Git. Only intended public assets belong in `public/`.
- Pages publishes `dist/` using `.github/workflows/pages.yml`. Record a successful workflow and verified live URL before claiming public deployment.
