# Architecture

Tensión de Carbono is a static React application built by Vite. It uses browser storage and downloadable JSON. There is no application backend, remote database, authentication service, or multiplayer transport.

| Location | Responsibility |
| --- | --- |
| `index.html`, `src/main.jsx` | Metadata, root element, and React startup. |
| `src/engine.js` | Rules, immutable transitions, accounting, scoring, import/export. |
| `src/App.jsx` | Setup, role controls, negotiation, results, guide, persistence. |
| `src/components/GuidedRound.jsx` | Ordered cabin controls, handoffs, validation feedback, and counterpart responses. |
| `src/components/ui.jsx` | Shared fields, buttons, statistics, and accessible contextual help. |
| `src/components/GameNavigation.jsx` | Collapsible navigation content; its display preference is independent of game actions and exports. |
| `src/workflow.js` | Derived interface turn, project-option explanations, and named prerequisites. |
| `src/Valley.jsx` | Lazy-loaded Three.js scene and interactive SVG fallback. |
| `src/styles.css` | Layout, responsive presentation, and reduced motion. |
| `src/demo.js`, `src/demo.json` | Four-round example replayed through the engine. |
| `public/` | Public files copied unchanged into the build. |
| `tests/engine.test.js` | Rules, conservation, scoring, and replay tests. |
| `.github/workflows/` | Validation and Pages deployment. |

`createGame()` creates serializable state. Decisions pass through `applyAction(original, action)`, which clones state and rejects invalid actions with `RuleError`. Failed actions preserve the original state. Components use derived engine views rather than separate accounting logic.

The annual phases are policy, projects, verification, market, and results, repeated for up to four years. `isGameOver()` also recognizes a year closing above 1,400 accumulated physical emissions. `applyAction()` rejects all later actions; the interface automatically shows results and stops `RoundTimer.jsx`. Exactly 1,400 is allowed. Project grants and credit purchases are distinct transfers. Credit retirement changes the tax base; verified external reductions change physical emissions and must not be counted twice.

`exportGame()` stores setup and actions with schema/version identifiers. `importGame()` reconstructs state by replaying validated actions. Browser storage uses the same format under `tension-carbono-v2`.

Version 2.1 exports use the new terminal rule. The private legacy replay path validates every action in a version 2.0 export, including actions following a historical climate overshoot, then returns the first terminal state. New logs cannot continue beyond a terminal state. Timer duration is a separate browser preference, not a financial action or exported rule parameter. Initial navigation always opens home; restart creates a new game and returns home without opening the State curtain.

Vite generates `dist/` with relative asset URLs. React and Three.js have separate chunks; the scene is dynamically imported. Pages publishes only `dist/`. Source documents and tests do not become site assets.

The version 2 engine, current rules, and academic guide define current behavior. `docs/antecedentes/` preserves earlier designs under their existing filenames.

The local guided-flow prototype adds replayable confirmation markers for annual company production, indicative foundation quotes, and foundation market turns. New production confirmations set an engine-enforced annual lock; older logs without the lock preserve their replay behavior. Both quotes precede company proposals and do not reserve stock or buyer capacity. `RoundOverview.jsx` contains the compact economy dashboard and route disclosure. The interface restricts cabin access to the derived current turn; pending offers preempt that turn until the counterpart responds. See `docs/ux-review.md` for compatibility with the older public implementation and the local verification scope.
