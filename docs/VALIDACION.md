# Validation history and current workspace status

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
