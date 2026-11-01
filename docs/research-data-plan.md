# Gameplay research data plan

Status: Supabase implementation prepared on 1 November 2026. The owner created the project and enabled its schema and anonymous technical sign-in. See `research-setup.md` for configuration, actual collection behavior, and private analysis access. Publication evidence belongs in `VALIDACION.md`.

## Objective

Record observable decisions and interface interactions to support revisions to the game. Keep the existing game engine authoritative and preserve play when the database is unavailable. GitHub Pages continues to host the game; a separate service stores the research data.

## Data contract

| Dataset | Fields | Purpose |
| --- | --- | --- |
| Study label | Configured cohort label on each session; validation probes use a separate label | Separate classroom trials and game revisions. |
| Sessions | Random session ID, study ID, game version, consent version, selected timer duration, start/receipt timestamps, terminal event, outcome | Distinguish games without identifying people. |
| Events | Session ID, sequential event number, year, phase, logical role, event type, allowlisted values, elapsed active time, server receipt time | Reconstruct decisions and locate interface friction. |
| Annual results | Session ID, year, engine-produced emissions, production, taxes, funding, credits, reductions, and policy parameters | Compare physical and fiscal outcomes without recalculating game accounting in the client. |

The logical roles are `Estado`, `A`, `B`, `C`, `F1`, `F2`, and `Docente`. At the owner’s request, the six player roles supply student codes, stored separately in private `research.participants`. Codes can identify students: this dataset is not anonymous. Events use random session IDs and logical roles. Do not transmit team names, personal names, free text, email addresses, raw setup objects, or raw imported/exported game files.

## Events worth recording

- Successful engine actions: policy publication, production selections and confirmations, project changes, signatures, verification, quotations, proposals, acceptance, cancellation, company confirmations, year closing, and game completion.
- Structured rejected-action categories, with an allowlisted action type and logical role and phase; do not store arbitrary error text.
- Cabin opening, help opening, section changes, timer changes, and restart before completion.
- Checkpoints at each year closing and an explicit final outcome. An unfinished session is not automatically a climate defeat or a confirmed abandonment.

Existing action logs contain decisions but no timestamps. Historical exports can support decision/outcome analysis; they cannot establish past decision times or time spent reading help. New timing events must distinguish visible interaction time, background-tab time, and the selected advisory timer. These are observations of interface use, not measurements of attention or understanding.

## Collection and synchronization

1. Before a research session starts, show a short Spanish opt-in explanation of the collected fields and purpose. Play remains available without collection.
2. Generate a random session ID. Maintain a local event queue, separate from economic game state and personal game exports.
3. Record accepted actions only after `applyAction` succeeds. Use engine results and logical roles; sanitize all values through an explicit field allowlist.
4. Send bounded session snapshots to the authenticated write-only `record_research_session` function. Use a primary key based on session ID and event sequence to avoid duplicate rows after retries.
5. Keep pending batches locally on connection failure and retry without blocking decisions. Mark upload acknowledgement separately from game completion. Do not claim that a game was stored remotely before acknowledgement.
6. Keep imported historical games and built-in examples out of live trial data unless an authorized researcher explicitly imports them as a separate historical dataset. Restart creates a new game/session boundary.

## Access and deployment

The participant-facing API must not expose other sessions or researcher exports. Researcher access needs server-enforced authorization; hiding a dashboard button is insufficient. For a Supabase implementation, enable row-level security and use only the publishable key in the browser. Never place database connection strings, administrative keys, or service-role credentials in Vite variables or public repository files.

The database, ingestion validation, access rules, and query/export path must be tested together before collection is enabled. Configure the project in the owner's account. The existing public game should continue working if the backend is unconfigured or unavailable.

## First analysis outputs

- Completion, restart, and unresolved-session rates by game release and study.
- Duration by role and phase, with missing and background-time observations identified.
- Production and public-policy choices by year and emissions trajectory.
- Quoted, proposed, and accepted prices; quantities; rejection/cancellation rates; each foundation's separate sales.
- Help use and structured errors by step, to identify unclear controls.
- Final emissions, collective defeat, and production from stored engine summaries. Role accounts and scores require replaying the successful action log through the matching engine version; they are not separate stored score columns.

Compare equivalent trials and document changes in timer duration, facilitation, and game version. Associations in these records do not by themselves establish that an interface change caused different learning outcomes.

## Configuration and access

- The owner selected Supabase project `flqdtiyxwpwobgafebla`.
- All tables are private; researchers use the owner-authorized Dashboard/SQL Editor.
- GitHub Actions uses public project configuration; no administrative key is part of the application.
- Read-only analysis queries are supplied in `supabase/analysis.sql`.

Official references: [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Supabase API keys](https://supabase.com/docs/guides/api/api-keys), and [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
