# Cambios de la versión 2

## Local follow-up trial on 29 October 2026

- Restored the missing foundation constant used by Results and added an SSR rendering regression. Both the results navigation and final-game action open the results screen.
- New annual production confirmations lock production through all contract reviews, with the lock released for the following year. Older exported action logs retain their original replay semantics.
- Both foundations publish indicative quotes before company purchases. Quotes do not reserve inventory or buyer capacity; companies explicitly choose between independent inventories. Quotation order alternates by year. Price controls use USD 0.50 steps.
- Moved economy metrics and organizations to a compact opening dashboard. Replaced the large route sidebar with an upper-right floating disclosure, including keyboard dismissal and narrow-screen layout.
- The timer starts automatically when the initial government cabin opens each year. Expanded the interface guide, current rules, and academic teaching supplement to explain government financing approval and teacher verification.
- Changes remain local for user testing; no publication was performed.

## Local guided-flow prototype on 29 October 2026

- Replaced unrestricted cabin navigation with a visible mandatory interface route, explicit confirmations, and automatic handoff curtains. Pending offers route to the counterpart and then resume the main turn.
- Unified cofinancing terminology and removed repeated subsidy entry. Government grant approval is read-only unless the participant explicitly requests renegotiation.
- Added contextual Details, named missing requirements, and upfront explanations for unavailable options. Teacher actions appear as the current task instead of a control below the map.
- Reduced guide navigation to one entry, made the logo open the home screen, added confirmed game restart beside timer reset, and corrected the institution to Laboratorio de Economía Aplicada.
- Added replayable workflow markers without changing economic parameters or reference results. Added the local teaching supplement and workflow regressions. These changes are local and have not been pushed or deployed.

## Public publication on 29 October 2026

- Created the public repository `sjestiven/tension-carbono` and pushed the verified application to `main`.
- Enabled GitHub Pages through Actions and verified the HTTPS site at `https://sjestiven.github.io/tension-carbono/`.
- Confirmed 32 tests, the production build, and deployment in GitHub Actions; checked table creation, the guide, the WebGL valley, reference example results, and all eight public files.
- Updated repository links, deployment instructions, and validation evidence. The game implementation and rules remain unchanged.

## Repository preparation on 28 October 2026

- Extracted the verified source package directly into the project root; preserved the version 2 game implementation and academic documents.
- Retained the original ZIP and its checksum manifest in ignored `archive/`. Moved academic PDF copies into `docs/references/`, preserving their filenames and excluding copies from Git.
- Added editor settings, Git line-ending rules, Node version selection, maintenance instructions, contribution guidance, and English development, architecture, and deployment documentation.
- Initialized Git on `main`; the initial commit, remote, and public publication remain pending.
- Updated the Pages workflow to use maintained checkout/setup actions and Pages artifact upload v4. Scoped Pages write and OIDC permissions to the deployment job, and added timeouts and separate pull-request/branch validation.
- Bound development and preview npm scripts to loopback by default; removed the previous environment's special Vite allowed host. Kept relative production asset URLs.
- Added a regression test for parity between the public JSON example and the source template; 32 tests and the production build pass.
- Verified the compiled site under a repository subdirectory in a browser, including the WebGL scene, table creation, guide, sample results, and reload persistence. See `VALIDACION.md` for evidence and limits.

## Original version 2 changes

| Hallazgo del informe | Implementación |
|---|---|
| Faltaba `App.jsx` y fallaba la compilación | Aplicación completa, motor JS y dependencias bloqueadas en `package-lock.json`. |
| Una compra simbólica daba victoria empresarial | Cobertura positiva menor del 25 % da 5 puntos. Margen y solvencia máximos más ese tramo suman 65, por debajo de 70. |
| El Estado ganaba sin alcanzar la producción | Además del presupuesto climático y 70 puntos, necesita 1.800 t de producto acumuladas. |
| El código anterior conservaba anticipos | No hay control ni financiación con anticipo. El motor rechaza anticipos no nulos. |
| Los votos manuales no implementaban la lista automática | Tres criterios calculados con umbrales explícitos y evidencia por actor y ronda. No hay entrada manual de votos. |
| La venta de un lote sin verificar se cancelaba silenciosamente | La propuesta se rechaza antes de registrarse; no puede venderse un lote inexistente. |
| Un turno cerrado podía impedir renegociación | Etapas compartidas y cambio libre de cabina. Las empresas pueden corregir producción y anular contratos antes del cierre, respetando los límites. |
| No se había probado el recorrido de la web | Navegación y transacciones probadas en navegador; prueba del ejemplo completo y motor con pruebas automatizadas. El renderizado WebGL queda pendiente. |
| Las salas sincrónicas no estaban comprobadas | La entrega declara modo local y no presenta una función de red inexistente. |

## Decisiones operativas adicionales

La cofinanciación usa un porcentaje uniforme publicado por el Estado para los proyectos nuevos de ambas fundaciones. Puede renegociarse durante la etapa de proyectos; cualquier ajuste invalida las firmas afectadas. La tarifa del impuesto queda fija al publicarla.

Los créditos se registran como unidades enteras. Con 75 tCO₂e de emisiones, el 50 % son 37,5; pueden utilizarse como máximo 37 créditos enteros. Los precios admiten centavos.

Al aceptar un contrato ambas partes quedan representadas: el proponente ya lo firmó y la contraparte confirma. Se transfiere el dinero en ese momento. Una anulación antes del cierre lo devuelve y elimina la reserva. No se contabiliza dos veces la compra al liquidar impuestos y producción.

Los criterios automáticos se definen en `docs/REGLAS.md`. Son decisiones de diseño para hacer operativa la automatización pendiente del informe, no umbrales empíricamente validados.
