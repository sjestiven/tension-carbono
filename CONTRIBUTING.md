# Contributing

Read [the development guide](docs/development.md), [the architecture](docs/architecture.md), and [the current rules](docs/REGLAS.md). Create a focused branch, install with `npm ci`, and run `npm run check`. Explain the change, relevant validation, and remaining limitations in the pull request.

Keep new technical names and documentation in English; keep the interface and academic teaching prose in Spanish. Preserve existing source filenames and data identifiers. Game rules belong in the engine.

When changing rules, update the engine, regression tests, interface guide, current rule document, and teaching guide consistently. Explain any change to the four-round example's reference results. Deployment work must preserve existing rules.

Commit source and `package-lock.json`. Exclude generated output, credentials, personal student exports, local PDFs, and the original package. No project redistribution license has been selected.
