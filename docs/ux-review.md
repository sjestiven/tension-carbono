# Guided gameplay usability revision

## Home, terminal climate rule, and timer durations (30 October 2026)

Version 2.1 opens at home even with a saved game. Confirmed restart creates a fresh year-one game with preserved names, clears the curtain, stops the clock, and returns home. Home offers Continue for unfinished games, Start for a fresh saved table, and Results for completed games. A new table can select its duration before creation; existing tables use the header selector.

Annual timers offer 12, 8, or 4 minutes, stored as a browser preference outside the exported economic log. Selecting a different duration resets and pauses the clock; reset-clock uses the selected duration. Opening the initial State cabin starts it automatically once per year. Ending the game disables Start and stops the clock. Reaching zero remains advisory and does not end a round.

Closing a year above 1,400 accumulated physical emissions immediately opens collective-defeat results, removes the next-year handoff, and blocks all later engine actions. Exactly 1,400 is permitted. Partial scores describe the recorded rounds and do not grant victory after collective defeat. Version 2.0 logs are fully validated, then migrated to their first terminal state; version 2.1 logs reject decisions after termination. Teacher comparison accepts either four-year completion or early climate defeat.

Local checks verified home on reload with a saved losing game, home after restart without a State curtain, all three timer values, automatic start with eight minutes, four-minute reset/pause, and persisted duration. A synthetic import just before the third-year closing produced 1,590 accumulated tCO2e, automatically displayed final results, removed the fourth-year action, and disabled timer Start. The 320 px layout had no page-level horizontal overflow; the temporary viewport override was reset. The suite has 49 passing tests, including the exact-limit boundary, blocked terminal actions, loss-result rendering, and legacy migration with validation of the complete historical log.

Date: 29 October 2026. Scope: gameplay changes developed and tested locally in response to user trials. Publication evidence is recorded in `VALIDACION.md`.

Release status: published to the existing GitHub Pages site after local validation. Application commit `6e7173d332acb88329e00efd25eb119037876eef` passed workflow `40872073522`; all eight live assets matched the local build. Public browser checks confirmed final results and automatic State-cabin timer start. The local-trial evidence below remains a record of development testing.

## Decision workspace refinement

Published application commit `ed140c265dd515c5d505008a003c8341c0cd2f8d` passed workflow `40876051365`. All eight live files matched the local build, and public browser checks confirmed the 66.2 px desktop summary, navigation controls, and organization disclosure. No warning or error messages were captured. The viewport override was reset after validation.

Further user feedback identified that the opening metrics inherited the height of the organizations scene, reducing the prominence of the decision cabin. The summary is now a compact horizontal strip: approximately 66 px at the reported 1496 by 727 viewport. Emissions, tax, and funding remain visible; the scene and organization names open from a labeled Organizations disclosure. The route uses the adjacent disclosure button. Both panels close with Escape or an outside click and return keyboard focus when explicitly dismissed. Only one panel opens at a time. The scene is loaded on demand in the game summary.

Navigation starts collapsed to reserve space for the active decision. The header Menu button opens and closes it with a 240 ms transition; the existing reduced-motion rule disables that transition when requested. Desktop navigation expands horizontally, while narrow layouts expand vertically without covering the decision with an overlay. The preference is stored separately from game state and exports. Selecting a destination closes the menu. Hidden navigation is inert and excluded from the accessibility tree; closing it restores focus to the Menu button. The menu itself and its trigger support Escape.

Targeted local checks covered desktop 1496 by 727, mobile 375 by 812, and 320 by 800: menu opening/closing, persistence after reload, keyboard operation, guide/results navigation, popup placement, and no page-level horizontal overflow. At 320 px both popups stayed within the available viewport after a width correction. With the State cabin opened at desktop size, its complete policy form and confirmation button were visible. Game rules, scoring, and action history are unchanged by this layout revision.

## Findings and changes

The previous interface persisted selections without defining an explicit handoff. Participants could open any cabin, production planning had no confirmation action, and the teacher control appeared below the valley. The same subsidy value was presented as two apparently separate inputs. These choices made successful state changes look like an unresponsive application.

| Observed problem | Local revision |
| --- | --- |
| Unclear first, next, and final participant | A fixed route, current-turn banner, next-participant label, and automatic handoff curtain. |
| No clear production confirmation | Explicit selection feedback and a confirm-and-continue action for A, B, and C. |
| Repeated subsidy input | One field named `Cofinanciación pública (%)`; the later government step displays it read-only and signs the grants. Renegotiation is an explicit secondary action. |
| Hidden teacher controls | Execution, verification, closing, and next-year actions occupy the active cabin at the top of the task flow when the teacher's turn arrives. |
| Generic missing-signature error | Named requirements and disabled progression until prerequisites are complete. Engine diagnostics identify the missing organizations. |
| Unexplained economic constraints | Contextual Details controls and inline reasons for unavailable project/production options. |
| Repeated navigation | One guide entry per screen; the extra rules shortcut is removed. The logo now opens a real home screen and preserves progress. |
| Ambiguous restart | The timer menu separates resetting the clock from restarting the whole game. Restarting the game requires confirmation and offers export first. |
| Incorrect institution name | Header and footer identify Laboratorio de Economía Aplicada. |

## Turn sequence

Planning: government policy, company A production, B production, C production, foundation F1 plan, F2 plan, government grant signatures, teacher execution and verification.

Market: both foundations publish indicative quotes before any purchase; F1 quotes first in odd years, F2 in even years. Then A, B, and C compare both independent stocks and prices, explicitly choose a supplier, and propose bilateral purchases. No supplier is selected by default. A pending offer temporarily hands control to its counterpart. Acceptance or rejection returns control to the interrupted main turn. The teacher can explicitly reopen negotiation before closing; agreements remain until canceled and confirmations restart. Production stays fixed after its annual confirmation.

The mandatory cabin order is an interface workflow, not an authentication boundary. Financial validation and action replay remain in `applyAction`. The added `confirmProduction`, `publishQuote`, `finishFoundationTurn`, and `reopenNegotiation` actions persist progress. New interface production confirmations include `lock: true`, enforced by the engine through contract review and released the following year. Older action logs omit the lock and retain their original replay semantics. Foundation signatures validate the signing foundation's plan; government signature and execution still validate the complete allocation. Funding limits, accounting, and score formulas are unchanged.

## Follow-up findings

- Results failed because the results renderer referenced `FOUNDATIONS` after its import was removed in the earlier local refactor. Restored that import, added a component-render regression, and checked the actual final-game button in the browser. Results navigation also scrolls to the results heading.
- Foundation stock was already separate, but sequential seller negotiation could exhaust shared buyer demand before the second seller participated. Both now quote before purchases. Indicative quotes reserve neither stock nor company capacity; bilateral offers do. This provides an opportunity to compare both sellers without guaranteeing equal sales. Annual quotation and comparison order alternate.
- Quote and purchase price controls increment by USD 0.50. Existing cent-valued action logs remain importable.
- The opening dashboard contains accumulated emissions, annual tax, public funding, and a compact organizations scene. Cabin opening scrolls to this summary so it remains visible. The former large route sidebar is an upper-right sticky disclosure with the current step, `aria-expanded`, `aria-controls`, outside-click dismissal, Escape dismissal, and focus restoration. A narrow-screen overflow in the navigation grid was corrected. The compact scene supplements the required-turn banner rather than controlling the order.
- The twelve-minute timer starts once per year when the initial government policy cabin opens. It remains paused before that opening and permits manual pause or reset afterward.
- Government guidance distinguishes financing approval from the teacher's later lot verification. The current rules and academic teaching supplement include approval criteria and a budget example.

## Verification

The suite has 46 passing tests. The legacy four-round replay reproduces the full reference history exactly. A second four-round replay uses fixed production and buyer proposals after both quotations; it reproduces all economic history and scores after normalizing proposal authors, generated contract IDs, and contract order. Additional tests cover result rendering, independent stocks and shared buyer capacity, lock persistence and release, alternating quote order, reload persistence, revised signatures, named blockers, counterpart interruptions, reopening negotiation, and repair of an imported draft.

Browser checks completed locally: full revised first year with two P1 projects, both quotations before purchases, a purchase from F2 followed by cancellation and refund, restored F2 availability, bilateral acceptance, all company confirmations, teacher closing (405 tCO2e and USD 4,100 tax), annual results, and opening the second year with USD 1,230 fund. The clock was paused before opening the new State cabin and running afterward. Loading the full reference example and clicking the final-game results action displayed all final scores. The 320-pixel viewport had no page-level horizontal overflow after the navigation correction; the route popup remained inside the viewport and dismissed with Escape. The viewport override was reset afterward. Earlier checks also covered Details, single-guide navigation, logo/home, reload, and game restart. These are targeted checks, not broad device or assistive-technology certification.

Continue testing at the public game or at `http://127.0.0.1:5173/` while the local development server is running. The game still needs user and classroom feedback; these checks are not a completed classroom usability study.

## Compatibility

Existing version 2 exports remain importable and are replayed by the engine. The guided workflow adds action types, so exports created with these new confirmations require this updated implementation. Older releases do not recognize those new actions. Use the updated game when importing a guided-workflow export.
