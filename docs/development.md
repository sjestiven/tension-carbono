# Development guide

## Runtime and installation

Use Node.js 22 or later and npm. `.nvmrc` and the workflows select Node.js 22. Run commands from the root containing `package.json`:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. The npm scripts bind to `127.0.0.1`. For access from a trusted classroom network, explicitly append `-- --host 0.0.0.0`. No environment variables or external application services are required.

## Verification

```sh
npm run check
npm run preview
```

`check` runs Node's test suite and Vite's production build. `preview` serves the existing `dist/`; build first. Read [VALIDACION.md](VALIDACION.md) for actual evidence and remaining classroom checks.

For deployment changes, also serve the production site below a repository path such as `/tension-carbono/`. Open the welcome screen, create a table, open the guide, and load the complete example. Check dynamic scene assets and `ejemplos/partida_demo_v2.json`. Vite uses `base: './'` for relative compiled asset URLs.

## Editing and data

`src/engine.js` owns state transitions and accounting. React sends actions and renders engine views. Add regression tests for meaningful rule or data-integrity failures. Keep new technical names and comments in English, and user-facing copy and academic prose in Spanish. Editor and Git settings standardize UTF-8 and line endings without reformatting all existing code.

The browser saves a table under `tension-carbono-v2`. Export before changing origin or browser profile; avoid editing one table in two tabs. Imports validate replayed actions but do not authenticate participants.

`src/demo.json` is a source template. `public/ejemplos/partida_demo_v2.json` is an importable export. Keep them aligned; the tests compare replayed states. Never add personal student exports to `public/` or Git.

The unchanged original ZIP and its checksum manifest remain in ignored `archive/`. That manifest verifies the original package, not the edited working tree. The root handoff document is preserved as a historical snapshot.
