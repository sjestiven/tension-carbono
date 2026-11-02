# Shared-computer flow and motion review

Initial review: 1 November 2026. Implementation update: 2 November 2026. Baseline: application version 3.0.0. This is an evaluation and proposed design, not an implemented trading-rule revision or a benchmark of student behavior. The six student roles are government, A, B, C, F1, and F2. The teacher workflow is an additional control responsibility, not a seventh student role.

## Observed workflow

Run `node scripts/evaluate-shared-computer-flow.mjs` to reproduce the reference trace. It replays actual actions through the engine and counts changes in `currentTurn()` ownership. It does not equate engine actions, visible clicks, physical mouse handovers, or elapsed classroom time.

The four-year reference contains 64 role visits and 63 ownership changes. Per year there are normally 16 visits:

| Owner | Visits per year | Tasks |
| --- | ---: | --- |
| Government | 2 | Publish policy; confirm grants |
| Each company | 2 | Confirm production; confirm bids |
| Each foundation | 3 | Confirm project plan; quote; choose buyers |
| Teacher workflow | 2 | Execute/verify; close the year |

The normal handoff currently opens one curtain with a begin-turn acknowledgement. The separate turn-banner entry button is a recovery path if the curtain is dismissed; these are not two mandatory entry clicks on every visit. Within a teacher visit, execution, two verification decisions, and market opening still require separate actions. Several UI buttons already bundle engine actions, so the number of engine actions is not a reliable click count.

With a four-minute advisory timer, 16 visits leave an arithmetic average of 15 seconds per visit, including reading, negotiation, and mouse transfer. Eight minutes gives 30 seconds; twelve gives 45 seconds. These are time-budget illustrations, not measured completion rates. Twelve minutes is the more defensible starting point for a first six-person trial; shorter settings can be tested after familiarization.

## Preserve meaningful decisions

- Keep company production explicit and separate from firm bids. Verified supply and seller quotations are established between these stages. Combining them would require moving information or changing when commitments occur, not merely simplifying screens.
- Keep each buyer's final binding commitment identifiable. Draft entries are not accepted purchases.
- Keep seller choice among competing offers. Automatic highest-price allocation would change seller agency and the trading institution.
- Keep an explicit decision to leave usable credits unbought or unsold. Omit it only when the feasible choice set is genuinely empty.
- Keep rejection of a lot when the teaching exercise provides evidence or a scenario requiring verification. A financing calculation is not environmental certification.
- Keep the public climate budget, loss condition, and collective annual discussion. Faster navigation should not remove the opportunity to explain outcomes.

## Steps to omit or group

| Candidate | Proposed behavior | Qualification |
| --- | --- | --- |
| Teacher close and results navigation | After all seller decisions are final and engine checks pass, calculate the annual close and display results directly. Offer one next-year button. | Closing is bookkeeping in version 3; it is not an additional market decision. Preserve a deliberate pause for discussion before advancing the year. |
| Government approval with zero grant | Apply the already-published zero-support policy automatically. | In the reference, years one and four have zero new public contribution. Record this as automatic application, not a human approval. |
| Government approval of eligible nonzero grants | Automatically apply the common policy if both plans are signed, affordable, and within the fund; return to government only for a renegotiation or unresolved exception. | This removes a discretionary review opportunity and changes the approval procedure. It needs an explicit rule revision and clear teaching instructions. |
| Foundation project plan and quotation | Collect an indicative quote with the project plan; publish it only when both foundations have submitted and the relevant lot is verified. | This changes the quotation's information/timing. Invalidate or reopen it if financing, the plan, or verification changes. Do not silently treat an earlier quote as a guaranteed sale. |
| No verified seller lot | Mark the seller unavailable without asking for a price and a separate decline. | Do not skip a seller who has stock and may genuinely choose whether to quote. |
| No verified supply anywhere | Skip the bidding/sale forms and report the consequence. | There is no feasible purchase in this case. System-generated transitions must remain distinguishable from player decisions. |
| Finishing a seller turn with no pending offers | Include finalization with the last acceptance/rejection. | No new offer can arrive after all buyers have submitted. Keep an explicit finish action when it would reject unresolved offers. |
| Empty buyer basket | Use one clearly labeled finish-without-buying action. | There is no payment to review, but choosing no purchase should remain explicit when supply exists. |
| Buyer commitment review | Show one readable basket and the binding warning together; avoid redundant navigation to review the same basket. | Keep a deliberate commitment control. Removing all confirmation would make irreversible errors easier. |
| Execution and verification controls | Retain the two independent lot decisions, but let one final button apply the checked decisions, execute in the correct order, and open the market. | Validate prerequisites before committing. Do not default both lots to approved if evidence matters. A fully automatic classroom mode would be a separate teaching choice. |

The safest first implementation is annual closing/results grouping, automatic zero grants, omission of impossible market steps, and clearer in-place handoff ownership. Conditional early quotes and automatic nonzero approvals should be a second, explicitly evaluated rule variant.

## Handoff projections

The script also filters visits under proposed assumptions. It does not execute those alternate procedures or prove unchanged pricing and student strategy.

| Reference-path variant | Visits | Ownership changes |
| --- | ---: | ---: |
| Current version 3.0 | 64 | 63 |
| Automatic annual close/results | 60 | 59 |
| Above plus automatic zero-grant approval | 58 | 57 |
| Automatic close and all eligible grant applications | 56 | 55 |
| Above plus conditional quotation during project planning | 48 | 47 |

The conservative first two omissions project 57 versus 63 changes, a 9.5% reduction in this trace. The combined procedural variant projects 47, approximately 25.4% fewer. Exception handling can add visits back. These percentages describe modeled workflow ownership, not time saved or learning improvement.

## Operating one computer with six people

Offer a shared-table presentation that keeps all six roles visible, with the current role highlighted and only its controls editable. Do not confuse a shared display with secure private bidding: the existing curtain is not authentication.

An optional rotating operator can enter decisions spoken by the active role and rotate annually. Keep decision authority with each role: read back the actor, amount, and consequences before commitment. This may reduce physical mouse movement without reducing logical turns, but may also concentrate participation in the operator. Compare it with direct handoff in a trial rather than assuming it is better.

Use the role name in primary commitments, for example **Empresa A: confirmar 200 t**. A compact inline handoff can replace a full-screen curtain in shared-table mode, but removing an acknowledgement entirely introduces risks of confirming for the next actor or double-clicking into the next form. Preserve a deliberate acknowledgement when the operator changes; provide keyboard focus and actor identification when the operator stays.

Do not make inactive avatars look like buttons for opening an unauthorized decision cabin. They can display read-only organization information; only the current role should expose its decision action. The teacher can receive a separate moderation badge rather than a seventh avatar among the student roles.

## Six-avatar design

Use six low-poly figures with a common base geometry, consistent scale, stable positions, and role labels. Company avatars need A/B/C identifiers; foundations need F1/F2 identifiers; government needs its own administrative symbol. Do not rely only on color, gender, clothing stereotypes, or a changing autumn palette to distinguish them. Personal photos, student codes, and custom-character setup are unnecessary for role recognition.

Place the figures in the existing turn banner on a wide display, using its spare horizontal space rather than adding a tall dashboard. Highlight the active figure with a static marker and a short optional transition. On narrow displays, show the active figure and a compact organization disclosure. The decision form remains the visual priority. Keep the larger valley available on demand; do not automatically open it after every transaction.

Six avatars should share a renderer rather than use six independent WebGL canvases. Prefer simple procedural figures initially. Facial animation, full walking rigs, large textures, asset customization, and permanent idle loops add implementation and rendering cost without explaining the economic decision.

## Proposed motion vocabulary

Durations below are starting design values to test, not requirements copied from a standard and not measured implementation results. Frequent feedback should be brief and local. NN/g recommends most interface motion within roughly 100–500 ms, adjusted for distance, complexity, and repetition [1].

| Event after successful engine commitment | Animation | Initial duration | Persistent explanation |
| --- | --- | --- | --- |
| Role handoff | A small highlight moves to the active avatar; other figures remain still. | 150–250 ms | Current role and next task |
| Buyer submits firm offers | A proposal marker becomes a locked marker. | 150–250 ms | Reserved capacity/cash; no payment yet |
| Seller accepts a purchase | One compact settlement effect: credits from seller to buyer, money in the opposite direction. | 300–500 ms total, concurrent | Exact quantity, payment, and resulting balances |
| Seller rejects a bid | Remove the pending marker and release its reservation. No coins move. | 100–200 ms | Offer not accepted; no payment |
| Project execution | Show installation/capacity on the foundation's location, plus actual grant/cost deltas where nonzero. | 300–500 ms | Project installed; verified reductions are a separate matter |
| Lot verification | Add a valid/invalid lot marker. | 150–250 ms | Verified quantity or reason the lot is unavailable |
| Tax collection at annual closing | Brief company-to-government flow, with the public reserve separated from general revenue. | 300–500 ms | 30% reserved fund; 70% general budget |
| Annual climate accounting | Update the confirmed budget bar and autumn setting. | 250–400 ms | Confirmed cumulative physical emissions and remaining budget |

Do not animate money on a quotation, draft addition, project-plan signature, or grant signature when no payment has occurred. Do not imply that purchasing credits cleans the physical valley or subtracts emissions a second time. New trees at execution mean installed project capacity, not an automatically verified environmental outcome. Re-verifying an existing project in a later year should not appear as new construction or new investment.

Avoid walking avatars between buildings, long handshakes, cinematic camera travel, zooms on every sale, confetti, constant bouncing, shaking errors, and movement of the form or its buttons. Update numeric balances immediately rather than making users wait for animated counters. Use motion to explain the already-committed result, not as a loader or an extra confirmation.

## Nonblocking implementation boundary

The current valley is normally unmounted during cabin decisions and shown only at home or in the organization disclosure. An effect attached only to that valley would often be invisible. An effect attached to a role cabin can also disappear when ownership changes. A stable compact avatar/settlement layer in the turn banner can remain present across handoffs; the large map can mirror the event when already open.

Trigger effects from successful actions committed through `applyAction`, using resulting transfers, not raw button clicks. Group a project's related transfers or a rapid set of purchases instead of making users watch a long animation queue. Errors, imports, replay, reload, and restored history must not replay transactions or apply payments. Animation completion must never trigger settlement, scoring, or next-turn validity.

Keep controls usable throughout; keep overlays out of the pointer and keyboard path. Provide one status announcement per result, not per frame. Leave a readable transaction receipt available after the effect disappears. When actions arrive faster than effects finish, aggregate or finish the older effect without delaying state or extending a visual backlog.

The existing `Valley.jsx` recreates its renderer/scene when production, foundation capacity, or confirmed climate ratio changes. Keep a stable renderer and update objects before adding animated figures; otherwise objects and motions can reset at each update. It also runs a continuous animation/render loop. On-demand rendering, short active effect windows, and pausing while hidden are more suitable for mostly static decision forms [4]. Share simple geometry/materials and avoid unnecessary draw calls [5]. These are identified code risks, not measured GPU bottlenecks.

## Accessibility and performance conditions

- Respect the operating-system reduced-motion preference and offer a visible reduced/no-animation setting. WCAG 2.3.3 is a Level AAA criterion about disabling nonessential interaction-triggered motion; use it as a design target, not an unsupported claim of full conformance [2].
- Continuous automatic movement lasting more than five seconds alongside other content needs pause/stop/hide controls unless essential, under the applicable Level A criterion. A short duration alone does not guarantee overall accessibility [3]. Avoid continuous idle movement by default.
- Keep text, symbols, focus, readable contrast, and status receipts equivalent in animated, reduced-motion, and non-WebGL modes. A static avatar or SVG receipt is a complete fallback.
- Do not enable audio automatically or add another required click to dismiss a celebration. Do not change or pause the advisory timer solely to accommodate a decorative effect.
- Treat 60 fps on the intended classroom computer as a target to measure, with a simpler 30 fps mode or static fallback on weaker devices. These are proposed performance budgets, not achieved benchmark results. Measure input responsiveness independently of animation smoothness.
- Stop rendering hidden/offscreen scenes, avoid six active canvases, and verify memory/render-loop cleanup across all four years and repeated role changes.

## Validation plan

Start with avatars as static role identifiers, transaction receipts, and nonblocking short effects. Test the conservative grouping variant before combining quotation timing and nonzero grant approval.

Observe a real six-person group on the intended single computer. Compare role confusion, physical mouse transfers, confirmation errors, teacher interventions, time spent reading/negotiating versus navigating, completion, and participation by all six students. Ask students to explain who paid, who received credits, when payment occurred, and why purchasing credits does not reduce physical emissions again. Fewer clicks or more attractive avatars alone do not demonstrate understanding.

Test keyboard use, reduced motion, a hidden organization view, a missing WebGL context, quick repeated acceptances, rejected operations, low stock, year closing, early climate defeat, imported 2.x logs, and screen resize. In every visual mode, accounts and final outcomes must remain identical for the same decisions. Automatic bookkeeping must be marked as such in the research log, rather than attributed to a student's new choice.

## Sources consulted

1. [Nielsen Norman Group: Executing UX Animations—Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/). Purpose, frequency, duration, local movement, and reduced motion.
2. [W3C: Understanding SC 2.3.3, Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Nonessential motion and user preferences; Level AAA.
3. [W3C: Understanding SC 2.2.2, Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Automatically moving content and user control; Level A conditions.
4. [Three.js: Rendering on Demand](https://threejs.org/manual/pages/rendering-on-demand.html). Avoid continuous rendering when the scene does not change.
5. [Three.js: Optimize Lots of Objects](https://threejs.org/manual/pages/optimize-lots-of-objects.html). Rendering overhead, shared geometry, and scene complexity.

## Implemented version 3.1

The conservative variant is now implemented: valid zero grants, grouped explicit teacher verification, unavailable supply/empty or exhausted seller bookkeeping, automatic closing/results, and one next-year control. The script also executes the actual 3.1 reference and counts 58 decision-owner visits, 57 ownership changes, and 14 system-origin actions, excluding results navigation. Earlier projection rows remain hypotheses for procedures not selected. See `interface-design-review.md` for palette, contrast, avatars, nonblocking motion, observed checks, and limitations. Production, binding commitment, positive public spending, seller allocation and verification remain meaningful decisions.
