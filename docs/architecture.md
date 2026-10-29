# Architecture

Tensión de Carbono is a static React application built by Vite. It uses browser storage and downloadable JSON. There is no application backend, remote database, authentication service, or multiplayer transport.

| Location | Responsibility |
| --- | --- |
| `index.html`, `src/main.jsx` | Metadata, root element, and React startup. |
| `src/engine.js` | Rules, immutable transitions, accounting, scoring, import/export. |
| `src/App.jsx` | Setup, role controls, negotiation, results, guide, persistence. |
| `src/Valley.jsx` | Lazy-loaded Three.js scene and interactive SVG fallback. |
| `src/styles.css` | Layout, responsive presentation, and reduced motion. |
| `src/demo.js`, `src/demo.json` | Four-round example replayed through the engine. |
| `public/` | Public files copied unchanged into the build. |
| `tests/engine.test.js` | Rules, conservation, scoring, and replay tests. |
| `.github/workflows/` | Validation and Pages deployment. |

`createGame()` creates serializable state. Decisions pass through `applyAction(original, action)`, which clones state and rejects invalid actions with `RuleError`. Failed actions preserve the original state. Components use derived engine views rather than separate accounting logic.

The annual phases are policy, projects, verification, market, and results, repeated for four years. Project grants and credit purchases are distinct transfers. Credit retirement changes the tax base; verified external reductions change physical emissions and must not be counted twice.

`exportGame()` stores setup and actions with schema/version identifiers. `importGame()` reconstructs state by replaying validated actions. Browser storage uses the same format under `tension-carbono-v2`.

Vite generates `dist/` with relative asset URLs. React and Three.js have separate chunks; the scene is dynamically imported. Pages publishes only `dist/`. Source documents and tests do not become site assets.

The version 2 engine, current rules, and academic guide define current behavior. `docs/antecedentes/` preserves earlier designs under their existing filenames.
