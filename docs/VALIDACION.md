# Validation history and current workspace status

## Country and organization labels public release

Application commit `e665bad4ccc04a7f0a870c2cbf75c4969fcc70b7` passed [Actions run 41754868795](https://github.com/sjestiven/tension-carbono/actions/runs/41754868795). The 80 tests passed in the release snapshot. The [public game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and served the five country options, the three company sectors, and both conservation labels. The production research validator accepted all five country codes and the previous aliases, rejected an invalid code, and denied direct execution by participant roles.

## Rules 3.2.0 public release

Application commit `c74af2618f5fba2540a9903f7bd8a802fd19d63b` passed the build and deployment jobs in [Actions run 41718973264](https://github.com/sjestiven/tension-carbono/actions/runs/41718973264). All 79 local tests passed. The [public game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and served the JavaScript bundle with the 3.2.0 rules, production progress, and emissions by role.

## Version 3.1.3 public release on 3 November 2026

Application commit `736467d592aa5d4bfac8662362116dcee0512048` passed [Actions run 41647101160](https://github.com/sjestiven/tension-carbono/actions/runs/41647101160). All 77 tests passed, and all eight files at the [public game](https://sjestiven.github.io/tension-carbono/) matched the validated build.

Browser checks covered opening the home menu by keyboard, dismissing it with Escape and an outside pointer action, switching and persisting motion modes, and rotating the valley. The guided example opened in year 1, showed each annual balance and final scores, allowed backward navigation, and returned to a saved game with its published policy and next turn intact. The renderer uses refresh-driven orbit damping, a limited pixel ratio and cached shadows. A frame-rate benchmark was outside this validation.

## Version 3.1.2 public release on 3 November 2026

Application commit `36ede1a4b1f1f3f6125cbe02dcc76e47590ee87c` passed [Actions run 41644312669](https://github.com/sjestiven/tension-carbono/actions/runs/41644312669). All 76 tests passed, and all eight files at the [public game](https://sjestiven.github.io/tension-carbono/) matched the validated build.

The classroom scenario uses Postobón, Cristalería Peldar, Cementos Argos, Fundación Natura and Fundación Omacha. A replay check confirmed that saved games with the previous preset names load the new labels and retain their actions and custom names. The setup explains that game figures are simulated.

## Version 3.1.1 public release on 3 November 2026

Application commit `a71107c7946391d31bf614d74c0905713c262f49` passed [Actions run 41641810139](https://github.com/sjestiven/tension-carbono/actions/runs/41641810139) with all 76 tests, production build and Pages deployment. All eight files at the [public game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and matched the validated local build. The public browser opened the new home menu.

Browser checks covered setup from the home menu, all five aliases, a named avatar, entry without student codes, mandatory codes after opt-in and both 200 t and 250 t production previews. At USD 25 per tonne of emissions, 250 t and 300 t yield the same USD 1,600 profit for company A, while the former emits 20 tCO2e less. The turn banner scrolls in normal document flow. The local screenshot is `.local/validation/Cabina de producción - Comparación y avatares.jpg`.

The connected database accepted a synthetic `validation` profile with the alias `hyrule` and the company A avatar choice `other`. The browser confirmed receipt. The validator rejects free text in the profile, and participant access to the research schema remains denied. The embedded database test verifies the new profile, legacy consent records and analysis extraction. No real student codes were used.

## Version 3.1 public release on 2 November 2026

Application commit `e223ab6626332c057daad535fa7c0d9d39c1eb10` passed [Actions run 41396066288](https://github.com/sjestiven/tension-carbono/actions/runs/41396066288): locked installation, all 76 tests, production build and both successful build/deploy jobs. All eight files at the [live game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and matched the final local `pilot-2026` build byte for byte.

The public browser showed the 3.1 guide with grouped teacher review, automatic zero-contribution agreements, direct annual results/next-year navigation and paused results timer. The saved 3.0 table was preserved with its compatibility notice; the site was left at home. No synthetic `pilot-2026` session was submitted. Public guide evidence is `.local/validation/shared-table-guide-public.jpg`; asset hashes are in `shared-public-assets.json`. The local production-cabin screenshot is `shared-table-production-local.jpg`. A subsequent documentation-only record does not change deployed application assets.

## Version 3.1 local validation on 2 November 2026

Locked installation and `npm run check` pass: 76 tests and production compilation. Both 3.0 and 3.1 run 32 deterministic mixed-market games, plus strict replay, no-supply/zero-grant/exhausted-stock transitions, receipts and imported mid-verification display. The four-year reference retains 1,345 emissions, 2,250 production and all six scores. Actual workflow ownership falls from 63 to 57 changes; this is not measured classroom time.

A complete synthetic local browser year tested explicit State policy, fixed production, both projects, zero-grant omission, one teacher review with unselected verification radios, both quotes, binding purchase, direct empty baskets, seller acceptance, automatic closing/results and direct next-year handoff. Expected first-year values were 365 tCO2e, 20 purchased credits at USD 18, A profit USD 1,540, total tax USD 5,625 and reserve USD 1,687.50. No-motion mode and 375/320 px production layouts remained usable with no page-level horizontal overflow; temporary viewport overrides were reset. The compiled repository-subdirectory preview loads all eight files with matching bytes and reproduces the full example without captured warning/error logs.

The third private-validator migration was applied to the connected Supabase project. The browser footer acknowledged the synthetic study `validation`; the server contains its 3.1 system-origin events. Participant schema reads remain denied. Security advisors have the same baseline notices: intentional deny-all private RLS tables and the authenticated, owner-checked ingestion RPC; password leak protection is irrelevant to this anonymous-only game flow. No new read grants or administrator keys were introduced.

Evidence is kept outside Git under `.local/validation/shared-*`. The detailed design assessment and source references are in `interface-design-review.md`. OS reduced-motion emulation, a separate no-WebGL run, performance measurements on classroom devices and a six-student usability trial remain outstanding. No claim of complete WCAG compliance is made.

## Version 3.0 public release on 1 November 2026

Final application commit `86b1c350aae21d5cefdbcadb3776045f4bdfd0fb` was published by [successful Actions run 41340482490](https://github.com/sjestiven/tension-carbono/actions/runs/41340482490), including locked installation, all 69 tests, production compilation, and deployment. The main implementation commit `eb44e268283cb3fa8ffaac71efc0ec71b90a14e6` had also passed [run 41340119619](https://github.com/sjestiven/tension-carbono/actions/runs/41340119619). Final online review found and corrected a stale guide paragraph before this final verification.

All eight files at the [public game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and matched the locally validated `pilot-2026` build byte for byte. Browser verification confirmed the 3.0 guide and expanded the corrected binding-market explanation: buyer cash/capacity reservation, seller acceptance after all submissions, final contracts, rejected-offer release, empty-sale skipping, financial distinctions, and legacy 2.x behavior. No warning/error messages were captured during that check. The home compatibility notice preserves the saved 2.x table and explains starting a fresh game for the new rules. No synthetic `pilot-2026` session was submitted from the public page.

Evidence remains in ignored `.local/validation/version-3-assets.json`, `version-3-guide-public.jpg`, `version-3-production-local.jpg`, and `version-3-purchase-local.jpg`. Temporary narrow viewport overrides were reset. A subsequent documentation-only record does not change the deployed assets.

## Version 3.0 combined local validation on 1 November 2026

Locked installation completed after stopping the project's development/preview processes, which held esbuild open on Windows. All 69 tests and the production build passed. Thirteen new tests cover tax-inclusive production, exact purchase-preview/settlement parity for prices below/equal/above tax and free credits, competing offers without first-arrival stock reservation, binding and final contracts, combined cash limits, worst-case acceptance-subset solvency, fiscal/production feasibility, automatic empty-sale skipping, old bilateral affordability, version 3 early defeat, full four-year equivalence, and 32 deterministic mixed-market games with replay checks. Embedded PostgreSQL also tests both migrations and complete sessions for both rule versions with private analysis.

An actual browser trial completed a year with two A bids and competing B/C bids. F1 selected B and C and implicitly rejected A; F2 selected A. Annual profits matched the accepted portfolio (A USD 1,200, B USD 725, C USD 310), physical emissions were 365, and the next public fund was USD 1,387.50. The footer received a real Supabase acknowledgement after new decisions and closing under the separate `validation` study. The owner confirmed the incremental migration. No real student identifiers were used.

A reachable imported third-year stress case had C cash USD 500: policy publication was disabled at tax 40, explained why, and enabled at tax 35. Production selection updated after-tax profit. The full example showed autumn-red confirmed consumption at 1,345, without announcing defeat. Home, results, and production had no horizontal page overflow at a 320-pixel viewport override, which was reset. No browser warning/error messages were captured during these checks. Evidence remains in ignored `.local/validation/version-3-production-local.jpg` and synthetic fixture JSONs.

The reproducible comparison `node scripts/compare-market-flows.mjs` gives 58 to 28 market handoffs in the reference with identical accounts and scores; no-trade handoffs are unchanged after empty-sale skipping. All eight compiled files matched HTTP 200 responses under `/tension-carbono/`, and the compiled browser preview displayed the legacy-rule compatibility notice. The new purchase form also had no horizontal overflow at the narrow viewport. The existing Three.js chunk size advisory remains. These are software observations, not classroom timing or learning measurements. See `version-3-evaluation.md` for remaining negative consequences and mitigations. Public deployment evidence is recorded only after successful publication.

## Version 2.2 public release on 1 November 2026

Application commit `b32e1d0435a0cfd6db74c147224fc28fa6255cb8` was published by [successful Actions run 41316601930](https://github.com/sjestiven/tension-carbono/actions/runs/41316601930). Locked installation, all 56 tests, the production build, and Pages deployment succeeded. All eight live files at the [public game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 and matched the locally validated `pilot-2026` build byte for byte.

The actual public browser opened at home, displayed the six required student-code inputs and unchecked research authorization, and captured no warning/error messages during this check. The final client transport also received an actual Supabase acknowledgement in the local `validation` study before publication. No synthetic classroom-study session was submitted from the public page. Evidence remains in ignored `.local/validation/research-registration-public.jpg` and `version-2.2-assets.json`. Public configuration contains only the project URL, publishable key, and study label; private administrative access remains outside the game. A subsequent documentation-only record does not change application assets.

## Version 2.2 local research validation on 1 November 2026

Locked installation completed with `npm ci --no-fund --no-audit`. All 56 tests and the production build passed. New checks cover string student codes and legacy compatibility, opt-in boundaries, removal of personal fields, persistent offline retry, acknowledgements during concurrent new events, withdrawal, and separation of an older upload from a new unrecorded game. Embedded PostgreSQL executes the actual migration, verifies private-table permissions, authenticated ingestion, owner isolation, immutable student codes, deduplication, and all supplied analysis queries against a complete four-year replay.

The owner confirmed applying the migration and enabling Anonymous Sign-Ins. Actual Supabase synthetic probes confirmed an accepted write, idempotent acknowledgement, rejection of another owner, and blocked participant reads. Browser checks required all six codes, recorded synthetic decisions with a server-confirmed footer, resumed after reload, locked codes during collection, stopped capture, and started a new unrecorded game without a false saved status. Technical sessions use study `validation`, excluded by the supplied `pilot-2026` analysis filters; no real student identifiers were used.

All eight production files returned HTTP 200 and matched local build bytes under `/tension-carbono/`; HTML asset references remained relative. The compiled site opened in the browser at that repository subdirectory. The existing Three.js chunk still produces Vite's advisory size warning. These checks establish technical operation, not classroom learning outcomes or verified student identity. Public publication evidence is recorded separately after deployment succeeds.

## Version 2.1 public release on 30 October 2026

Application commit `31d8f5b2cee231f8fef36ed837332d37e840db94` was published by [successful Actions run 41103885684](https://github.com/sjestiven/tension-carbono/actions/runs/41103885684). Locked installation, all 49 tests, the production build, and Pages deployment completed. The live [game](https://sjestiven.github.io/tension-carbono/) returned HTTP 200 for all eight production files, each matching the locally validated build byte for byte.

Public browser verification opened directly at home with the existing saved table preserved. The timer selector offered 12, 8, and 4 minutes; choosing eight and four displayed 08:00 and 04:00, and the preference was restored to twelve afterward. No warning or error messages were captured. Earlier local checks verified restart-to-home and automatic early-defeat results through the actual year-three close button. Evidence is retained in ignored `.local/validation/version-2.1-home-public.jpg`, `early-climate-defeat-local.jpg`, and `version-2.1-assets.json`.

GitHub delayed runner assignment and briefly returned HTTP 502 while reading job status; the final run conclusion was confirmed as success before recording this publication. A following documentation-only record does not alter the deployed application assets.

## Version 2.1 local validation on 30 October 2026

Locked installation completed with `npm ci --no-fund --no-audit`. The 49-test suite includes early collective defeat, no next-year workflow, terminal action rejection, exactly 1,400 emissions before year four, full validation and terminal-state migration of legacy version 2.0 logs, and rendering of early final results for all six roles. The unchanged four-year reference still reproduces the original economic accounts and scores.

Browser checks confirmed initial home with saved data, restart to home without an automatically opened cabin, 12/8/4-minute selection, eight-minute automatic State-cabin start, reset/pause on duration change, and persisted duration after reload. A synthetic third-year fixture reached 1,590 accumulated tCO2e on closing and immediately displayed collective-defeat results with no fourth-year action and disabled timer Start. At 320 px the page width matched the available viewport; the override was reset. The original academic Word guide is supplemented by the current version 2.1 rules and teaching workflow.

## Compact decision workspace release on 29 October 2026

Published application commit: `ed140c265dd515c5d505008a003c8341c0cd2f8d`. [Actions run 40876051365](https://github.com/sjestiven/tension-carbono/actions/runs/40876051365) passed both build and deployment, including locked installation and all 46 tests. The actual [public game](https://sjestiven.github.io/tension-carbono/) serves all eight production files with HTTP 200 and bytes identical to the validated local build.

Public browser checks confirmed the compact summary (66.2 px high at 1496 by 727), hidden navigation with the inert attribute, animated opening and closing, the State cabin, and Organizations disclosure with Escape dismissal. The opened policy form and its continue button fit in that desktop viewport after the existing cabin scroll. No warning or error messages were captured. Earlier local checks also covered menu preference after reload, guide/results navigation, 375 and 320 px layouts, and both popup bounds at 320 px. The temporary viewport override was reset. Evidence remains in ignored `.local/validation/compact-workspace-public.jpg` and `compact-workspace-assets.json`.

This release changes layout and navigation only; game rules and scores remain unchanged. The following entries preserve earlier publication and trial records.

## Guided gameplay release on 29 October 2026

Published application commit: `6e7173d332acb88329e00efd25eb119037876eef`. [GitHub Actions run 40872073522](https://github.com/sjestiven/tension-carbono/actions/runs/40872073522) completed successfully for both `build` and `deploy`, including locked dependency installation, 46 tests, and the production build. The updated game is live at [GitHub Pages](https://sjestiven.github.io/tension-carbono/), with source in [sjestiven/tension-carbono](https://github.com/sjestiven/tension-carbono).

All eight live production files returned HTTP 200 and matched the locally validated build byte for byte. This includes the HTML, CSS, JavaScript chunks, favicon, and importable reference example. The source keeps generated output, local evidence, reference PDFs, dependencies, and personal exports excluded from Git.

Public browser verification exercised the final-game results button against the four-year example and displayed the six expected scores: government 95.5, A 100, B 100, C 75, F1 100, F2 100. The example retained 1,345 tCO2e accumulated emissions and 2,250 t production. A fresh test table's clock was paused before opening the initial State cabin and started automatically afterward. The compact dashboard, organizations scene, route disclosure with Escape dismissal, and updated guide rendered. No warning or error messages were captured during these checks. Local evidence is retained in ignored `.local/validation/published-guided-results.jpg` and `published-assets.json`.

The local development server was restarted after the locked installation. Previous local-trial records below describe their status at the time; this section records their subsequent publication. Broad classroom validation remains pending.

## Local follow-up trial on 29 October 2026

The unreleased revision now passes 46 tests and the production build. A component rendering test covers the missing foundation import that broke Results. New workflow checks cover annual production locks, contract cancellation/refunds, separate seller inventory and shared buyer capacity, both quotes before purchases, alternating quote order, and four complete quote-based rounds with identical reference economic accounts and scores. Contract identifiers, proposal authors, and ordering naturally differ from the seller-proposal reference; the legacy replay still matches the complete original history.

Browser checks completed the revised first year using both quotes, a purchase from F2 and cancellation with a refund, restored availability, accepted purchases, company confirmations, and closing at 405 tCO2e and USD 4,100 tax. Annual results opened successfully. The final-results action was also exercised after loading the four-year example and displayed all role scores. Opening year 2 retained USD 1,230 of funding; its clock was paused before opening the initial State cabin and running afterward. The dashboard and route disclosure were checked at the normal viewport and 320 pixels; page width matched the available viewport after a navigation overflow fix. Escape closed the route and the viewport override was reset. Local screenshots are excluded from Git.

The live public deployment is unchanged. These targeted browser checks do not establish broad mobile compatibility or classroom outcomes. The current academic supplement is [the teaching workflow](teaching-workflow.md); the original Word document remains the published version 2 source.

## Earlier local usability prototype on 29 October 2026

This working tree contains an unreleased interface revision in response to the first user trial. The public site remains at the deployed revision recorded below. The local prototype is served at `http://127.0.0.1:5173/` while its development server runs.

The regression suite now has 41 tests. The new guided four-round replay reproduces the original reference history and scores exactly. Additional checks cover mandatory interface order, explicit production confirmation and replay, resubmission of foundation signatures, named missing requirements, project affordability, counterpart responses, reopening negotiation, and repair of an imported unfinished plan.

Browser verification completed a full first year: policy, A/B/C production confirmations, both foundation signatures, government grant signature, teacher execution, two verifications, bilateral offers, counterpart acceptance, seller handoffs, three company confirmations, and teacher closing. The result was 405 tCO2e and USD 4,100 tax; opening year 2 preserved the USD 1,230 fund. The browser also checked a reload between A and B, contextual help, absence of a repeated percentage input in grant approval, named missing verification, one guide entry, logo/home navigation, and cancellation and confirmation of game restart.

See [the usability review](ux-review.md) and [the teaching workflow supplement](teaching-workflow.md) for the interface contract, local compatibility, and trial instructions. The original Word guide remains the published version 2 teaching source; the supplement describes the local interface changes. Broad mobile testing and a six-person classroom trial remain pending.

## Public deployment on 29 October 2026

The game is publicly available at [GitHub Pages](https://sjestiven.github.io/tension-carbono/) from the [public source repository](https://github.com/sjestiven/tension-carbono). GitHub Pages uses the Actions workflow and enforces HTTPS.

Initial application commit: `973756719f87b8bd31226986c44fb8cbd1136b1b`. [Deployment run 40853527263](https://github.com/sjestiven/tension-carbono/actions/runs/40853527263) completed successfully, including locked installation, all 32 tests, the production build, artifact upload, and Pages deployment. The first push run reached configuration before Pages had been enabled; rerunning after enabling Pages succeeded.

Verification performed against the actual public URL without a GitHub login:

- The welcome screen and Three.js valley rendered.
- A new table could be created and its guide opened.
- Loading the complete example showed accumulated emissions of 1,345 tCO2e, production of 2,250 t, and points A 100, B 100, C 75, F1 100, F2 100, and government 95.5.
- No warning or error messages were captured in the browser console during this smoke test.
- All eight production files returned HTTP 200 and matched the local build byte for byte, including both dynamic scene chunks and the importable example JSON.

Local screenshot evidence is retained in ignored `.local/validation/public-results.jpg`. Commit attribution uses the GitHub account's noreply address with the user's approval. The protected Gmail address was not included in the published commit history, and account privacy protections were left enabled.

This public smoke test does not establish classroom learning outcomes, four rounds of free negotiation by six participants, broad mobile compatibility, file-picker/download behavior, or comparison of five student tables. The browser supported WebGL, so the SVG fallback was not forced in this public run. The earlier local and source-delivery records below are preserved as historical evidence; their publication-pending statements describe those earlier stages.

## Workspace preparation on 28 October 2026

The game is extracted into the project root and Git is initialized on `main`. Source files, public game assets, current rules, and the five academic documents match the original package byte for byte. The original archive's 28 checksums were verified before extraction. The archive and manifest are retained locally in ignored `archive/`.

Validation performed in this Windows workspace:

| Check | Result |
| --- | --- |
| Locked dependency installation | `npm ci --no-fund --no-audit` succeeded, 118 packages installed. |
| Local runtime | Node.js 24.11.0, npm 11.6.1; `.nvmrc` and Actions select Node.js 22. |
| Automated suite | `npm run check`: 32 passing tests, zero failures, production build successful. |
| New data regression test | The public exported example replays exactly the source template state. |
| Build size notice | Three.js chunk is 505.98 kB before gzip, 126.68 kB gzipped; the existing lazy scene import is preserved. |
| Repository-path serving | Production preview served below `/tension-carbono/`. |
| HTTP asset verification | All eight production files returned HTTP 200 and matched local build bytes, including the scene chunks and example JSON. |
| HTML references | All linked scripts, styles, and favicon use existing relative paths. |
| Browser interaction | Welcome, table creation, state-role curtain, opening the state cabin, policy publication, project phase, and guide opened successfully. |
| Complete example | Displayed 1,345 tCO2e accumulated emissions, 2,250 t production, and scores 100/100/75/100/100/95.5. |
| Browser persistence | Reload retained the completed example and USD 3,280 project fund. |
| WebGL | The Three.js valley rendered in this local browser. |
| Browser console | No captured warning or error messages during the smoke test. |
| Repository exclusions | Dependencies, build, local evidence, archive, and both academic PDF copies are ignored by Git. |
| New documentation | Local links resolve; source responsibilities, development, and publication steps are documented. |

Local screenshot evidence is saved at `.local/validation/production-results.jpg` and excluded from Git. The temporary local preview is `http://127.0.0.1:4174/tension-carbono/`; this is not a public deployment URL.

Remaining scope: workflows have not run on GitHub, no remote is configured, no initial commit has been created, and no public Pages URL has been verified. This smoke test does not repeat four free-negotiation rounds with six people, JSON file-picker/download flows, five-table comparison, mobile testing, or classroom validation. The new browser supported WebGL, so the SVG fallback was not forced in this run; its earlier evidence remains below.

## Original delivery record

Fecha de revisión: 28 de octubre de 2026. Destino: paquete fuente para GitHub Pages. No se ha publicado un repositorio ni un sitio en la cuenta del usuario.

## Motor y compilación

La suite `npm test` contiene **31 pruebas**. Comprueba una partida completa, conservación monetaria, límites de impuesto y compensación, caja previa a la ejecución, subvenciones y fondo anterior, firmas, verificación obligatoria, reservas de inventario, bilateralidad de aceptación, pago único, devolución al anular, cambios de producción, IDs y lotes por año, criterios automáticos, derrota ambiental e importación por reproducción de decisiones.

La compilación se ejecuta con `npm run build`. Los recursos son locales al sitio, sin scripts o fuentes de CDN. La biblioteca de escena 3D se carga de forma diferida; su tamaño sin comprimir supera 500 kB y Vite puede mostrar una advertencia informativa. No es un error de compilación.

## Resultados de referencia

| Indicador | Resultado |
|---|---:|
| Emisiones por año | 405; 350; 300; 290 tCO₂e |
| Emisiones acumuladas | 1.345 tCO₂e |
| Producción acumulada | 2.250 t |
| Impuesto por año | USD 4.100; 3.750; 4.500; 5.250 |
| Fondo final | USD 3.280 |
| Puntos A, B, C | 100; 100; 75 |
| Puntos F1, F2 | 100; 100 |
| Puntos Estado | 95,5 |

La diferencia con los 91 puntos estatales del informe anterior se explica por reemplazar los votos ingresados manualmente por la evaluación automática de v2. Las cuentas físicas y monetarias no cambian.

## Casos de balance corregidos

- La partida alternativa con **un solo crédito para A** produce **65 puntos**, sin victoria empresarial. Antes daba 75.
- El escenario de **1.200 t de producción acumulada**, sin proyectos, no da victoria al Estado aunque se respete el límite climático y sume 70 o más.
- La producción máxima de todas las empresas, con la inversión de referencia, emite **2.040 tCO₂e**: todos pierden.
- Un límite de 37,5 tCO₂e admite 37 créditos enteros, no 38.

## Pruebas en navegador

Se verificaron en la vista previa local:

1. Creación de mesa y personalización de su nombre.
2. Cortina y apertura de cabinas del Estado, empresas, fundaciones y docente.
3. Publicación de tarifa, propuestas de dos proyectos P1 y confirmaciones de convenios.
4. Ejecución y verificación docente. Intentar abrir el mercado sin verificar ambos lotes muestra un error y no avanza.
5. Oferta de una fundación a una empresa y propuestas de compra iniciadas por empresas; aceptación de la contraparte y pago al contado.
6. Confirmaciones empresariales y cierre del primer año: 405 tCO₂e, 40 créditos retirados, USD 4.100 de recaudo y USD 1.230 de fondo.
7. Apertura del segundo año con el fondo conservado.
8. Carga del ejemplo completo, resultados por año y puntos finales de los seis roles.
9. Recarga del sitio conservando la partida exportable mediante guardado local.
10. Vista de mapa alternativa en un navegador sin WebGL.

El ejemplo completo de la interfaz ejecuta las mismas acciones y validaciones del motor. La revisión no equivale a cuatro rondas de negociación libre entre seis personas. El renderizado de Three.js en WebGL no se pudo comprobar porque ese navegador carece de soporte gráfico. El mapa y las funciones económicas sí pudieron utilizarse.

## Verificaciones pendientes de campo

Probar en los computadores del aula el renderizado 3D, descargas e importaciones de JSON, comparación de cinco equipos y comportamiento en diferentes tamaños de pantalla. Ensayar con estudiantes tiempos, facilidad de negociación, comprensión y participación por rol. No se han probado salas ni sincronización: no se incluyen en la versión local.
