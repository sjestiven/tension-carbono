# Interface design review — version 3.1

Review date: 2 November 2026. Scope: one shared computer, six student roles, teacher moderation. Evidence combines source inspection, deterministic replays, local browser interaction, computed styles, and published UX/accessibility guidance. This is an expert review and technical validation, not a usability study with students or a complete WCAG audit.

## Findings and implemented responses

| Priority | Finding | Implemented response | Remaining qualification |
| --- | --- | --- | --- |
| High | Repeated bookkeeping creates ownership changes without a new economic choice. | Automatic valid zero grants, unavailable seller/buyer steps, empty/exhausted seller completion, annual settlement, and direct results/next-year navigation. | Nonzero State grants, production, firm bids, usable-credit no-purchase choices, seller allocation and environmental verification remain explicit. |
| High | Execution and two verifications are separate controls inside one teacher responsibility. | One review form with two independent, initially unanswered radio groups; one final commitment executes, verifies and opens in engine order. | The teacher still needs evidence/scenario criteria; this is not automatic certification. |
| High | The State balance competes with its policy form for the first screen. | Keep a compact climate/loss/reduction summary, with optional detailed evidence. | Annual results retain the fuller balance for discussion. |
| High | Supporting financial labels and hints are faint/small. | Darker neutral green text, 12 px financial labels, 11 px field/production hints, tabular money, blue keyboard focus. | Projector and classroom-distance legibility still need field observation. |
| Medium | A handoff can obscure transfer feedback. | Move the same six-avatar cast into the acknowledgement while it is open; show the last new receipt there, with full receipt retained in the workspace. | Handoffs remain acknowledgements because accidental commitments for the next person are costly. |
| Medium | Avatars could become a second dashboard or misleading navigation. | One compact group, stable positions, State/A/B/C/F1/F2 labels, static active marker. No inactive-role navigation. | On narrow screens labels replace the decorative figures; the shared computer remains the primary target. |
| Medium | Continuous smoke/orbit rendering consumes resources without explaining a choice. | Persistent valley scene and render-on-change; cast renders only on state/size changes and a bounded effect window. Hidden scenes stop. | No measured classroom GPU/frame-rate guarantee. |
| Medium | A sticky banner reduces small-screen workspace. | Keep desktop orientation; use normal document flow on narrow or short displays. Collapse navigation and optional map/route. | Long financial forms still require scrolling; avoid removing decision consequences to shorten them. |
| Medium | Color can imply individual blame or that buying credits cleans the world. | Stable role colors; autumn remains a separate collective confirmed-emissions signal, paired with text and budget bar. | Autumn bands are pedagogical styling, not ecological thresholds. |

## Palette and hierarchy

Keep warm white surfaces, dark forest-green primary actions, and restrained pale green grouping. This preserves the existing environmental identity while making the decision form the strongest surface. Use blue only for visible keyboard focus; use ochre/terracotta for the collective climate context and dark red plus explicit text for errors/defeat. Foundation and company colors stay stable as climate changes. Labels, marker shapes, amounts and wording carry information independently of hue.

Do not recolor the whole decision form red near defeat, tint avatar identity with climate, add red flashing, or animate every balance change. Those choices could make valid controls look like errors and obscure who controls a decision. The small collective signal is visible before defeat without presenting every participant as personally failing.

Selected sRGB foreground/background calculations after the update:

| Text/use | Pair | Contrast |
| --- | --- | ---: |
| Supporting text | `#4d604f` / `#fffefa` | 6.71:1 |
| Financial label | `#4d604f` / `#f9faf5` | 6.45:1 |
| Field label | `#435b48` / `#fffefa` | 7.36:1 |
| Primary action | `#ffffff` / `#214e3e` | 9.44:1 |
| Active role label | `#173e2d` / `#dce8c8` | 9.31:1 |
| Production hint | `#526352` / `#fffefa` | 6.37:1 |
| Former hint, for comparison | `#929b85` / `#fffefa` | 2.87:1 |

These checks cover selected solid-color pairs, not every component, state, transparency or graphic. WCAG 1.4.3 uses 4.5:1 for ordinary text and 3:1 for qualifying large text [1]. Main cabin actions are at least 42 px high; supporting controls are generally at least 32 px, and teacher radio rows provide larger clickable labels. The WCAG 2.5.8 AA minimum is 24×24 CSS px or a permitted exception such as spacing; do not confuse that minimum with a universal 44 px requirement [2].

## Motion and transaction meaning

Six low-poly figures share one renderer and basic geometry. Helmets distinguish companies; a folder and tree pin identify government/foundations in addition to labels. The active role has a static marker. No idle bouncing, facial rigs, walking, camera fly-throughs, audio, celebration dialogs or delayed counters were added.

Committed purchases move money toward the foundation and a credit marker toward the company; tax/grant effects follow actual engine transfers. Concurrent effects are capped to prevent a visual queue; the full receipt lists every committed entry, including a sale and the immediately following annual settlement. Figures do not perform accounting. Quantities, balances and controls update immediately, even when motion is off. A draft, signature, quotation, rejected action, import, reload or historical result does not start a fictitious payment. Installed capacity is distinct from verified annual reductions.

The effect window is 450 ms, within the short range recommended for frequent purposeful UI motion [3]. The visible toggle and OS reduced-motion preference suppress decorative effects without losing receipts, labels or decisions. Hidden/offscreen valley scenes pause, and no idle animation loop remains. Rendering on demand follows the Three.js guidance for mostly static scenes [4]. Performance budgets must be measured on classroom hardware before claiming achieved frame rates.

## Consequences and deliberately deferred changes

Automatic closing reduces an opportunity to stop on a separate teacher confirmation. Results therefore remain a deliberate discussion point, and advancing the year is still explicit. The timer pauses in results. Automatic zero grants remove a redundant State acknowledgement but positive spending remains its decision. Automatic rejection after stock reaches zero releases reservations; it does not route bids to another seller or silently choose the highest bidder.

Binding offers remain pedagogically consequential: they emphasize commitment and seller selection, but prevent later redirection and reduce bilateral renegotiation. Early project-plus-quote forms and automatic positive-grant approval were deferred because they change information timing and State discretion. Likewise, eliminating all curtains could reduce clicks but increase mistaken-actor commitments on a shared computer. A rotating operator is an optional classroom practice, not an assumption of equal participation.

Avatars increase initial graphics work and still require a static fallback. Use labels on narrow screens and when WebGL is unavailable. The existing Three.js chunk remains about 510 kB minified (128 kB gzip); no new runtime dependency was added. Numerical behavior is independent of graphics.

The reference four-year replay has 58 required decision-owner visits and 57 ownership changes, versus 64/63 in 3.0: 9.5% fewer changes on this trace. It contains 14 recorded automatic actions. These are workflow counts, not observed hand movements or 9.5% time savings. Automatic actions carry `origin: system` so research does not count them as student choices.

## Verification and next classroom test

The 76-test suite covers both trading versions, 32 mixed-market games per version, conservation/solvency, early defeat, strict import, automatic-step edge cases, financial effects and private PostgreSQL ingestion. A local browser year used 200/150/150 production, two P2 projects and one purchase of 20 credits at USD 18: A profit was USD 1,540, annual tax USD 5,625, reserve USD 1,687.50, and physical emissions 365. Results opened automatically, and the next year returned to the State. The local synthetic research session was acknowledged, including system-origin events, under study `validation`.

Desktop, 375 px and 320 px checks found no page-level horizontal overflow in the production cabin. The mobile banner uses normal flow, text-only role indicators and readable production hints. Manual no-motion mode preserves the flow; the OS preference and no-WebGL fallback are implemented but were not separately emulated in this browser run. No frame-rate benchmark or complete screen-reader audit was performed.

For the next six-person classroom observation, record wrong-role confirmations, teacher interventions, mouse transfers, reading/negotiation versus navigation time, completion, participation by role, and explanations of physical versus fiscal accounting. Compare versions separately, and exclude automatic-origin events from human decision counts. Start novices at 12 minutes; 8 and 4 minutes are shorter variants to test after familiarization, not validated equal learning experiences.

## Sources

1. [W3C — Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
2. [W3C — Understanding Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
3. [Nielsen Norman Group — Animation Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/).
4. [Three.js — Rendering on Demand](https://threejs.org/manual/pages/rendering-on-demand.html).
