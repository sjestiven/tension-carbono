# Supabase research setup

The application remains on GitHub Pages. Supabase stores research sessions in a private PostgreSQL schema. This is a single-device game with data collection, not multiplayer synchronization or student authentication by student code.

## Project configuration

Project URL: `https://flqdtiyxwpwobgafebla.supabase.co`.

1. Run `supabase/migrations/202611010001_research.sql` in the project's SQL Editor.
   Then run `supabase/migrations/202611010002_batch_market.sql` to support `submitBids` and `finishSales` decisions in version 3.0. Both migrations preserve private tables and write-only participant access. Then apply `20261102051505_automatic_action_origin.sql` for version 3.1. Existing projects apply only missing migrations. The third migration was applied through the connected project on 2 November 2026 and validated without granting participant reads. The owner confirmed applying it on 1 November 2026.
2. Enable Anonymous Sign-Ins under Authentication / Sign In / Providers. These technical accounts own write-only sessions; they do not replace the six student codes.
3. Copy `.env.example` to `.env.local` for local development. Set the project URL, its **publishable** key, and `VITE_RESEARCH_STUDY`. Never use a secret key, service-role key, or database password in browser configuration.
4. In the GitHub repository, define Actions variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `RESEARCH_STUDY`. The Pages build reads them as public Vite configuration. Only the publishable key is included in the browser build.
5. Deploy and test a synthetic session before classroom collection. Use study `validation` for technical probes and filter it out of research analysis. The default classroom study is `pilot-2026`.

## Collection

Each new game requests a student code for government, companies A/B/C, and foundations F1/F2. Codes are strings, retain leading zeros, and have a maximum length of 40 characters. Personal names remain local. The team explicitly opts into research collection when confirming participants; without opt-in the game still works and no new research session is sent.

Codes are fixed after recording starts. A new group must start a new game and confirm its codes. Old exports remain importable, but imports and the built-in example never automatically become live research sessions. Editing names is not permission to begin collection. The six codes also belong to the personal game export, so those JSON files must not be published.

The client records validated engine actions, cabin opening, help opening, structured rejected-action categories, section changes, timer changes, and visibility changes. Successful action events only contain an explicit allowlist of decision fields. Error strings, personal names, raw setup objects, free text, and browser fingerprints are not collected. Year summaries come from the engine, not a second accounting implementation.

Version 3.0 distinguishes withdrawn drafts, binding submissions, accepted offers, explicit rejections, and pending offers rejected by `finishSales`. No-offer seller phases are skipped inside the last buyer submission. Contract IDs still advance only on successful project additions and proposals; the analysis query supports both 2.2 and 3.0 and recognizes implicit rejection at sale finalization. Separate game versions when comparing cohorts: fewer handoffs are a software observation, not proof of learning or faster classroom negotiation.

Client elapsed time and visible-tab time are observations of interface activity. They do not establish attention, understanding, or time spent in face-to-face negotiation. Reload/closed-tab intervals are not counted as observed visible activity. Data is submitted by the browser; it is not a tamper-proof grading record.

## Private tables and access

- `research.sessions`: owner UUID, study, release, consent version, outcome, timer duration, revision, and timestamps.
- `research.participants`: session, logical role, and student code.
- `research.events`: sequenced decisions/interactions and timing fields, without student codes or names.
- `research.rounds`: year-level fiscal/physical outcomes.

All tables have row-level security enabled and no grants to anonymous or ordinary authenticated clients. The `research` schema is not a browser-readable dataset. The single public ingestion function requires Supabase Auth and verifies session ownership before accepting any update. It returns only an acknowledgement number. A retry of an acknowledged snapshot does not create duplicate events.

The project owner and explicitly authorized research staff access data through the protected Supabase Dashboard/SQL Editor. Do not make `research` an exposed public Data API schema or grant students SELECT permissions. `supabase/analysis.sql` contains read-only queries for completion, production, outcomes, errors, timing, identified decision sequences, and contract reconstruction. Keep identified exports restricted; share aggregated results when identifiers are unnecessary.

Supabase Auth limits and abuse protection still apply to anonymous account creation. Configure them for the classroom network and expected number of shared devices. Keep project administration in the owner's account. A public publishable key is not an administrative credential.

## Offline behavior and acknowledgement

An independent browser queue retains pending snapshots and retries them without interrupting game decisions. It persists separately from the economic action log. The footer distinguishes pending uploads from acknowledged data. On reconnect, the client retries. Queue entries are bound to the configured project URL and cannot silently move to a different project.

The research dialog can stop future collection and discard unsent current-session data. An already in-flight request may have reached the server; stopping collection does not delete previously acknowledged records. The project owner manages server-side retention or deletion through the Dashboard. A tab left without a final event remains unresolved, not a confirmed abandonment or climate defeat.

If browser storage is cleared before a pending upload, the local queue and technical authentication may be lost. If a request cannot be authorized for its original owner, the client does not take ownership of the old session under a new account. The game remains usable.

## Verification

Run `npm ci` and `npm run check`. Tests use embedded PostgreSQL to execute the real migration, check write-only ingestion and owner isolation, reject identity changes and unexpected event fields, and verify deduplication. Recorder tests cover absent opt-in, personal-field removal, network failure/reload, in-flight acknowledgements, and withdrawal. A live synthetic probe must also verify the deployed project's actual Auth and API configuration.

Official references: [anonymous authentication](https://supabase.com/docs/guides/auth/auth-anonymous), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), and [database functions](https://supabase.com/docs/guides/database/functions).

## Automatic transitions in version 3.1

Engine action data includes `origin: system` only for generated transitions. Human action data omits that key. The recorder stores every committed frame with its actual pre-action phase/year and logical actor; do not interpret an automatic State/teacher/buyer entry as a new human choice or elapsed decision. The analysis action view exposes `decision_origin` and contract reconstruction accepts 3.1. Compare versions separately. The migration only extends the private event validator; ingestion and owner isolation remain unchanged.
