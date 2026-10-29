# Validation history and current workspace status

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
