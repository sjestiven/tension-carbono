# Gameplay design review

Date: 1 November 2026. Baseline: version 2.2.0, application commit `b32e1d0435a0cfd6db74c147224fc28fa6255cb8`. This is a proposal and impact assessment, not an implemented rule revision. Existing deployment, engine, scoring, and research schema remain the baseline.

Follow-up: the owner subsequently authorized implementation together with financial decision previews. The implemented version 3 behavior, deviations discovered during testing, and measured replay differences are recorded in [the combined evaluation](version-3-evaluation.md). The proposal below preserves the original assessment of version 2.2.

## Automatic government assessment

The current five annual assessments are computed by `automaticRatings` in `src/engine.js`. They are performance criteria, not votes cast by students. Each assessment gives +1, 0, or -1; the sum contributes `10 + votes / 2` to the government's final score.

In every valid game that meets both government victory prerequisites, the non-assessment components already total 80 points: climate 30, production 20, financial compliance 20, and publication 10. The victory threshold is 70. Therefore assessment changes the reported score but cannot change government victory once those prerequisites are met. Conversely it cannot rescue a failed climate or production prerequisite.

Some criteria are invariant under valid engine play: publication precedes execution; grants apply the common subsidy percentage; financial limits are enforced. Foundations consequently pass at least the transparency and common-treatment criteria. Other criteria describe collective or private outcomes rather than causal effects of government policy. Company profit should not be presented as proof that the government caused that outcome.

### Recommendation

Replace the five expanded default cards with a compact formative policy balance, keeping detailed evidence available on demand. Suggested Spanish heading: **Balance de la política pública**.

- In the government cabin, show prior-year results before the next policy decision: collective emissions versus the reference path, company profitability, verified foundation capacity, and available public funds. Year one should show targets rather than invented prior observations.
- At year closing, show the result, the observed contributing decisions, and one discussion prompt for next year. For example: **La mesa superó la referencia de este año. ¿Qué pueden ajustar en producción y financiación el próximo año?** Avoid claiming one tax change necessarily solves emissions.
- Keep automatically enforced compliance as a small factual status rather than a prominent achievement score. Do not add another mandatory handoff or confirmation to read the assessment.
- Separate optional student feedback from automatic accounting. A subjective approval vote would introduce bargaining over points and a different learning objective.

A separate scoring revision could make government performance consequential, but changing only this panel's prominence or raising its weight would not address the guaranteed baseline points. Calibrate any replacement with whole-game scenarios; do not choose a new pass threshold without testing.

### Removing the segment

Hiding the expanded panel while preserving an accessible score explanation changes presentation only. Removing the assessment calculation would remove up to 20 score points, making the maximum 80 unless the scoring scale is redesigned. Keeping 70 as the threshold would still leave government victory determined by the same climate and production prerequisites in valid play. Normalizing the remaining 80 points to 100 would also fail to create new strategic discrimination.

Removal saves reading and can improve focus, but loses structured discussion of profitability, verified reductions, and policy tradeoffs. Preserve that evidence in annual results or the teacher discussion. Never remove the panel while leaving an unexplained assessment contribution in final scores. Historical games must continue to use their original scoring specification.

## Collective climate feedback

Use an autumn palette as a visible metaphor for collective budget consumption, not a scientific claim about seasonal change or actual vegetation loss. Preserve neutral decision surfaces, dark readable text, distinguishable focus/error states, and normal button hierarchy. Avoid a full red overlay, blinking, shaking, or repeated announcements.

Use engine physical emissions: company emissions plus the external baseline minus verified external reductions. Credit purchases affect fiscal allocation; they must not subtract a second time from physical emissions or reset the palette.

Proposed consumption bands are design choices, not new game rules:

| Confirmed budget consumed | Accent proposal | Information |
| --- | --- | --- |
| Below 50% | Existing green with gradual ochre | Confirmed emissions and remaining budget |
| 50% to below 75% | Ochre | Budget consumption remains visible |
| 75% to below 90% | Terracotta | Small reminder that the budget is collective |
| 90% through 100% | Deep autumn red | Explicit remaining amount; this is not yet defeat |
| Above 100%, after year closing | Dark red | Collective defeat and final results |

The confirmed palette uses accumulated closed-year emissions and never becomes greener merely because time advances. An explicitly labeled annual projection can warn earlier using `previewRound`; it remains provisional until projects are executed, lots verified, and the year closed. Distinguish this projection visually and numerically from confirmed consumption. Do not announce defeat from a preview.

Absolute consumption alone does not establish whether the team is on a sustainable path: 90% in year four and 90% in year one imply different remaining challenges. Show year context and the existing `350 × year` reference separately. That path is an assessment reference, not a second defeat threshold. Exactly 1,400 remains within the rules.

Add visible copy such as **Presupuesto colectivo restante: 210 tCO₂e** and a compact progress indicator, with optional projection text, to the existing summary. Do not add a tall dashboard. Color must have text or shape equivalents, following [W3C's guidance on use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

## Buyer offers followed by foundation selection

### Current constraints

The UI immediately hands each pending proposal to its counterpart and then returns to the buyer. Pending and accepted contracts both reserve foundation inventory and company compensation capacity. Cash is checked on acceptance but is not reserved across pending proposals. Merely delaying counterpart turns would therefore preserve first-arrival inventory priority and could produce unaffordable combined acceptances.

The learning objective in `docs/REGLAS.md` is to understand project financing, credit supply, and tax-induced demand. Batch bidding preserves these mechanisms if verified supply, the 50% compensation limit, cash payment, independent foundation inventories, and the physical/fiscal distinction remain intact. It places more emphasis on commitment and rationing and less on repeated bilateral renegotiation. These are expected design effects, not measured classroom outcomes. Experimental-market literature treats trading institutions as part of the experiment; it does not establish that one interface is universally better for this six-player game. See [Vernon Smith's account of market-design experiments](https://www.nobelprize.org/prizes/economic-sciences/2002/smith/biographical/).

### Recommended flow for a pilot

1. Both foundations publish indicative quotes before any bids. Quotes remain nonbinding and do not reserve credits.
2. Companies A, B, and C each prepare bids addressed to a named foundation, specifying quantity and unit price. They can edit drafts until an explicit **Confirmar ofertas vinculantes** action. All companies must finish before sellers act. Offer visibility must be specified; hiding submitted details until collection finishes reduces straightforward copying, but the current shared-device curtain is not secure sealed bidding.
3. On submission, reserve the company's combined purchase budget and compensation capacity across both foundations. Validate both cash available for immediate settlement and projected closing solvency if every firm offer is accepted. Do not reserve foundation inventory at this stage: competing bids may legitimately exceed supply.
4. Each foundation compares all bids addressed to its lot and chooses which to accept or reject, including a **No vender los créditos restantes** action. Do not automatically select the highest price if seller discretion is a teaching objective. Show the financial and unsold-inventory consequences. Alternate seller order by year, while acknowledging that this does not remove all strategic effects of sequential play.
5. Acceptance validates remaining verified stock, consumes the buyer reservation, pays once, and creates a final contract in one engine transition. Start with whole-offer acceptance to minimize scope and cognitive load. An oversubscribed or rejected offer remains unfilled, and a partial sale is not silently substituted for the quantity the company committed to.
6. When both foundations finish, release reservations for rejected or unfilled offers and close the market. Permit a second bounded bidding phase only if a pilot shows substantial avoidable unfilled demand; it adds handoffs and weakens the intended simplicity.

**Binding** means the company cannot withdraw or worsen a submitted offer during the decision phase, and an accepted contract cannot be unilaterally cancelled. It does not force a foundation to sell, guarantee acceptance, or require impossible delivery. Draft correction and a final confirmation should occur before commitment. A teacher reset or a replacement session is different from an ordinary cancellation action and needs its own explicit data semantics.

In the first pilot, do not add penalties, forced sales, automatic highest-bid allocation, or a new price cap simultaneously. Buying above the tax can still be a strategic choice because coverage also contributes to company scores; fiscal savings are not the only incentive in this game.

### Benefits and costs to evaluate

Expected benefits are fewer repeated device handoffs, simultaneous consideration of buyers, stronger seller agency, clearer commitment, and less cancellation/replanning. Potential costs include unfilled complementary bids, less price discovery, costly beginner mistakes, and remaining first-mover/visibility effects. Current maximum throughput, completion rate, price distribution, and scores cannot be assumed unchanged.

## Reproducible checks performed

The following probes used the current engine only, with synthetic data and no Supabase writes:

- The built-in four-year replay produces 1,345 accumulated tCO₂e, 2,250 tonnes of production, and a government score of 95.5, including 15.5 assessment points. At fixed final accounts, substituting the formula's theoretical rating extremes gives 80 and 100 government points, both victories. This sensitivity check does not assert that every substituted rating total is reachable in actual play.
- With verified F1 supply of 40, an A proposal for all 40 at USD 10 reserves the entire lot. A later B proposal for 20 at USD 20 is rejected as unavailable before the foundation compares buyers. In a proposed batch mechanism, B's 20 at USD 20 plus C's 20 at USD 18 would yield USD 760 versus A's USD 400; this is an allocation illustration, not a simulated new market engine.
- With A's initial USD 5,000 and compensation capacity 40, two pending offers of 20 credits at USD 200, one to each foundation, can both be submitted. Accepting the first leaves too little cash for the second, which the engine rejects. A firm-offer redesign therefore requires combined cash reservations before submission. The high price is a valid stress case, not a claim about typical student bids.
- Physical emissions in that market remain 365 tCO₂e before and after accepting a credit purchase. The visual feedback must preserve this accounting fact.

## Release and evaluation boundary

Implement climate feedback and the compact policy balance as a separately identifiable interface revision, preserving historical scoring. A binding batch market is a rule revision: update engine transitions, workflow, meaningful tests, in-app guide, current rules, teaching supplement, export compatibility, and Supabase ingestion/action allowlists together. Preserve old cancellation/replay behavior for older versions. The current analysis reconstructs contract IDs from existing proposal/project counters and must be revised if new actions change ID generation.

Measure market duration and handoffs, completion and unfilled quantities, prices by seller/buyer, rejected offers, help use, and observed errors. Separate cohorts/releases and keep timer duration and facilitation comparable. Add a brief debrief question about why credit purchases do not reduce physical emissions again. A faster round alone does not demonstrate better understanding; compare decision records with student explanations before adopting the new mechanism permanently.
