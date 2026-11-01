# Architecture

Tensión de Carbono is a static React application built by Vite. It uses browser storage and downloadable JSON. Optional Supabase research collection adds authenticated write-only ingestion into private tables. Core play remains local and there is no multiplayer transport. Student codes are identifiers, separated from decision events in the private database.

| Location | Responsibility |
| --- | --- |
| `index.html`, `src/main.jsx` | Metadata, root element, and React startup. |
| `src/engine.js` | Rules, immutable transitions, accounting, scoring, import/export. |
| `src/App.jsx` | Setup, role controls, negotiation, results, guide, persistence. |
| `src/components/GuidedRound.jsx` | Ordered cabin controls, handoffs, validation feedback, and counterpart responses. |
| `src/components/MarketDecisions.jsx` | Draft review, explicit binding confirmation, financial projections, and foundation selection. |
| `src/components/PolicyBalance.jsx` | Compact prior-year feedback with optional scoring evidence. |
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

The version 3 engine, current rules, and teaching supplement define current behavior. `docs/rules-v2.2.md` preserves the bilateral specification. `docs/antecedentes/` preserves earlier designs under their existing filenames.

New games use version 3.0 binding batch offers. `batchMarketTurn()` enforces the market sequence in the engine; `currentTurn()` exposes it to React. All companies submit before foundation selection. Draft/pending offers reserve buyer capacity and cash but not seller stock. `companyCommitment()` checks both total upfront payment and worst-case closing cash, excluding uncertain tax-saving offers from the solvency guarantee. `purchasePreview()` reuses the same company accounting; views never post transactions. Accepted stock and money change in one transition. No-offer seller turns are skipped, pending offers expire on `finishSales`, and accepted contracts cannot be cancelled. `policyIssues()` and production confirmation prevent reliance on uncertain purchases for basic solvency. Historical 2.x imports replay under version 2.2, including refunds; exports preserve the game's rule version. The complete example can replay either mechanism with identical economic choices.

`climateStatus()` derives confirmed budget consumption and a separately labeled engine projection. CSS and both valley renderers apply autumn accents without changing emission accounting or termination thresholds. `policyReview()` keeps balance summaries and rating contributions in the engine; React only formats the evidence. Scoring formulas are unchanged, including the known government score baseline. See `docs/version-3-evaluation.md` for the combined validation and remaining tradeoffs.

## Research boundary

`src/research/recorder.js` maintains a project-bound persistent outbox independent of financial actions. `data.js` allowlists event values and projects engine-produced annual summaries. `transport.js` initializes the official Supabase client only for opted-in collection and signs in through technical anonymous Auth before calling the write-only ingestion function. The React context records contextual-help openings without sending free-text labels. Student codes remain strings in setup/export for compatibility and are mandatory in new-game UI. Importing an old game does not activate research collection.

The migration in `supabase/migrations/` creates private, RLS-enabled tables and an authenticated security-definer function with an empty search path and explicit owner checks. There are no participant SELECT grants. `supabase/analysis.sql` is for the owner's SQL Editor, not a public application endpoint. Build configuration rejects non-publishable keys; administrative credentials are never part of browser configuration.
