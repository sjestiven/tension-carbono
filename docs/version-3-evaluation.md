# Version 3 combined evaluation

Date: 1 November 2026. Scope: after-tax production feedback, live credit-purchase projections, binding batch offers, formative policy balance, and collective climate presentation. Changes were evaluated together against version 2.2. This report separates software checks from unmeasured classroom effects.

## Implemented behavior

- Production shows expected tax, profit after tax, and closing cash before confirmation. No future credit purchase is assumed. Loss and cash insolvency are distinct.
- A proposed purchase shows payment, tax saving, marginal profit change, combined projected profit, cash after all proposed payments, and closing cash. It also shows a price-dependent maximum quantity. Drafts reserve no actual payment; money moves once on acceptance.
- Buyer commitments span both foundations. Upfront cash and compensation capacity cannot be overcommitted. Worst-case closing solvency is checked even if a seller rejects beneficial offers and accepts only costly ones.
- Policy publication leaves at least one solvent production choice per company; production confirmation itself cannot depend on an uncertain future credit purchase for closing solvency. Tax choices that would make every production level insolvent for a company are explained and blocked before publication.
- Both foundations quote; all buyers submit; sellers compare offers and choose whole contracts. Drafts can be removed before explicit confirmation. Confirmed offers cannot be withdrawn; accepted contracts cannot be cancelled or the market reopened. A seller can reject, leave inventory unsold, or finish and reject remaining offers. Sellers with no offers are skipped automatically.
- The policy balance summarizes the last closed year at the next State decision and in annual results. Detailed automatic criteria remain expandable; the scoring formula is preserved.
- Autumn accents and a compact budget indicator reflect confirmed physical emissions. Annual predictions are explicitly provisional. Credit transactions do not subtract physical emissions again. Exactly 1,400 is still allowed; defeat remains a year-closing event above that total.
- Old 2.x logs retain bilateral rules and refund behavior, even after the application updates. New exports identify version 3.0. The original version 2.2 rules are retained separately.

## Reproducible scenario comparison

Run `node scripts/compare-market-flows.mjs`. The script replays the same choices through both mechanisms, including the same production locks and seller quotations. A handoff counts a change in the role returned by the actual workflow, not a click or a measured student delay.

| Scenario | Bilateral market handoffs | Batch market handoffs | Economic comparison |
| --- | ---: | ---: | --- |
| Four-year reference | 58 | 28 | Identical accounts, emissions, production, and scores |
| No trades or projects, terminating in year three | 15 | 15 | Identical; empty seller turns are skipped |
| First reference year with one trade | 7 | 6 | Identical annual accounts |

In the reference, total handoffs fall from 93 to 63; market handoffs fall by approximately 51.7%. Engine actions rise from 139 to 147 because binding submission and sale finalization are explicit decisions. This is evidence of fewer device transfers in that replay, not evidence of faster classroom sessions or better learning. The reference remains at 1,345 tCO2e, 2,250 tonnes of production, and scores State 95.5, A 100, B 100, C 75, F1 100, F2 100.

## Numerical financial checks

At 200 tonnes of A production and a tax of USD 25, income is USD 10,000, production cost USD 6,600, and unoffset tax USD 2,000. Profit is USD 1,400; with initial cash USD 5,000, closing cash is USD 6,400.

Buying 20 credits at USD 18 costs USD 360 and saves USD 500 of tax: profit rises by USD 140 to USD 1,540, while immediate cash falls to USD 4,640. Buying at USD 35 instead costs USD 700 and reduces profit by USD 200. The interface does not manufacture a profit reduction when the tax saving exceeds the purchase expense.

The browser trial combined A offers for 20 credits at USD 18 to F1 and 20 at USD 35 to F2. It showed total conditional payment USD 1,060, conditional profit USD 1,340, immediate cash USD 3,940, and closing cash USD 6,340. A trial price of USD 300 for the second offer was blocked before submission as unaffordable. F1 subsequently selected B's 20 at USD 20 and C's 20 at USD 22, leaving A's competing offer unfilled. F2 accepted A's 20 at USD 35. Actual closing profits matched the resulting accepted portfolio: A USD 1,200, B USD 725, C USD 310. Physical emissions stayed 365 tCO2e; tax was USD 4,625 and the next public fund USD 1,387.50.

## Negative consequences found and handling

1. Delaying acceptance without changing reservations preserved first-arrival stock blocking. Version 3 reserves seller stock only on acceptance, so competing buyers can be compared.
2. Separate pending offers could spend the same cash twice. Combined buyer commitments now prevent it.
3. Checking only the all-accepted portfolio was insufficient. A C-production stress case with tax-saving free credits and expensive credits produced positive cash if all were accepted but negative cash if only the expensive offer was accepted. Worst-case subset solvency now prevents this commitment.
4. Irreversible production could leave a cash-poor company dependent on acceptance of a favorable bid. Policy and production feasibility checks now prevent this dead end. This also narrows available tax/production choices for cash-poor companies; it is an explicit version 3 rule change, not hidden automatic borrowing.
5. Empty seller turns originally added two handoffs per year. They are now skipped. Low-trade markets should still be measured in a pilot; fewer total actions are not guaranteed.
6. Keeping a just-added offer in the purchase form looked like an additional accidental purchase and produced misleading errors. Successful draft addition now resets the candidate form; commitment review hides the entry form and displays the actual basket.
7. Whole-offer acceptance can leave both unsold inventory and unmet demand. A 30-credit bid cannot consume a remaining 20. This limitation is intentional for the first batch pilot; partial acceptance would require another explicit rule and interface design.
8. Binding bids reduce correction and price discovery after submission. The interface provides draft withdrawal, financial previews, and an explicit commitment review, but it does not guarantee a buyer receives credits or allow strategic withdrawal later.
9. Student behavior may change even when fixed-choice accounting does not. Visible profit might encourage higher output; price-ranked offers might encourage sellers to focus on revenue. The collective budget and policy balance remain visible. No claim of improved environmental outcomes or comprehension is made before classroom evidence exists.
10. The unchanged State formula still gives an 80-point baseline whenever climate and production prerequisites are met. The new balance gives feedback more prominence; it does not fix the scoring incentive. A scoring redesign remains a separate calibration task.

## Research and compatibility

The owner applied migration `202611010002_batch_market.sql`. It only extends the private ingestion allowlist for the two new decisions. Embedded PostgreSQL tests replay complete bilateral and batch sessions through both migrations and the analysis queries. Real browser collection received acknowledgements after the new decisions and first-year closing using synthetic codes under study `validation`. No real student codes were used.

The analysis supports both versions and recognizes implicit rejection by seller finalization. Comparisons should separate game versions and keep timer duration, instructions, and facilitation comparable. Consent, private tables, identity separation, and offline retry are retained. Research is not a tamper-proof grading system; visible interaction time is not a measurement of attention.

See `VALIDACION.md` for final test counts, browser/viewport evidence, and any subsequent public deployment record.
