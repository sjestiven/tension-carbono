# Contexto completo para continuar Tensión de Carbono en Codex

Fecha del traspaso: 28 de octubre de 2026 (Colombia). Versión funcional: **2.0.0**.

## 1. Qué se está entregando

Este documento permite abrir un nuevo proyecto en Codex y continuar sin depender del historial del chat. El ZIP `Tension_Carbono_Proyecto_Completo_Codex.zip` contiene una única carpeta `Tension_Carbono_Codex/`, con el código completo, dependencias bloqueadas, pruebas, workflow de GitHub Pages, documentación vigente y antecedentes históricos. Este mismo Markdown está incluido en la raíz del ZIP.

No incluye dependencias descargadas, resultados de compilación, credenciales, sesiones del navegador ni partidas personales de estudiantes. `npm ci` reconstruye `node_modules/`; `npm run build` genera `dist/`. Se incluye únicamente una partida didáctica de ejemplo. `SHA256SUMS.txt` permite comprobar todos los demás archivos del paquete. El inventario completo está en `docs/ESTRUCTURA.md`.

## 2. Objetivo del usuario y estado real

El objetivo original sigue siendo **enseñar cómo funcionan los mercados de carbono**, distinguiendo la financiación de un proyecto, la ejecución y verificación de una reducción, la negociación de créditos, su retiro y la cuenta fiscal frente a la cuenta física. La interfaz y los puntos sirven a esa finalidad educativa.

El usuario pidió contextualizar los cambios, explicar y probar las reglas, corregir los hallazgos del informe, preparar la estructura para GitHub Pages y un instructivo académico final con limitaciones. Esos entregables ya se crearon. Después autorizó **subir el juego a GitHub y dejarlo público**. Ahora solicita el traspaso a un proyecto de Codex para hacerlo desde la terminal.

**Publicación pendiente:** desde esta sesión no se creó ningún repositorio, no se subió ningún commit y no se desplegó GitHub Pages. El intento por navegador quedó bloqueado en la autenticación. No se debe asumir que esa sesión o la conexión del chat estarán disponibles en el nuevo entorno.

La cuenta GitHub identificada en esta sesión fue **`sjestiven`**. Nombre propuesto del repositorio: **`tension-carbono`**. Es un destino propuesto, no un repositorio confirmado como existente. Antes de publicar, verificar la cuenta autenticada y si el repositorio ya existe. La carpeta de esta entrega no tiene `.git`, historial de commits ni remoto configurado.

La siguiente tarea autorizada es publicar el código en un repositorio público y habilitar el juego con GitHub Pages. El nuevo entorno puede necesitar autenticación o habilitación de red; no solicitar ni guardar contraseñas o tokens en este documento, en el código o en el chat.

## 3. Qué funciona hoy

- Aplicación web estática en español, con React, Vite, iconos Lucide y escena Three.js.
- Mesa de seis roles: tres empresas, dos fundaciones y un Estado; controles adicionales de docente.
- Cuatro años, con etapas de política, proyectos, verificación, mercado y resultados.
- Creación y nombres de mesa, cambio de cabina, cortina visual, guía, reloj orientativo de doce minutos y resultados.
- Convenios con firmas, ejecución de proyectos, verificación expresa y contratos bilaterales con reservas y pago al contado.
- Cálculo automático de impuestos, caja, emisiones, fondo público, puntuación y valoración del Estado.
- Guardado local, exportación e importación JSON, ejemplo completo y comparación docente de hasta cinco partidas finalizadas.
- Valle 3D y mapa SVG alternativo cuando no hay WebGL. El mapa alternativo permite realizar el juego.
- Workflow preparado para instalar, probar, compilar y desplegar en GitHub Pages.

## 4. Tecnología y puesta en marcha

| Elemento | Versión/configuración entregada |
|---|---|
| Node.js | 22 o posterior, según `engines`; workflow usa 22 |
| React y React DOM | 18.3.1 |
| Vite | 6.4.5 |
| Plugin React para Vite | 4.7.0 |
| Three.js | 0.128.0 |
| Lucide React | 0.460.0 |
| Gestor | npm, con `package-lock.json` |
| Pruebas | `node:test`, sin framework externo |
| Backend, cuentas y claves | No se necesitan para jugar |
| Publicación | GitHub Actions → GitHub Pages |

En la terminal, situarse en la carpeta que contiene `package.json`, no en su carpeta contenedora:

```sh
cd Tension_Carbono_Codex
npm ci
npm run check
npm run dev
```

Abrir la dirección que muestre Vite. Para probar el resultado compilado, detener el servidor de desarrollo y ejecutar:

```sh
npm run build
npm run preview
```

`npm run check` ejecuta las pruebas y la compilación. No abrir el `index.html` fuente mediante doble clic. El modo de desarrollo y el de vista previa requieren un servidor HTTP.

`vite.config.js` usa `base: './'`, para que los recursos funcionen en el subdirectorio de un repositorio de GitHub Pages. La entrada `server.allowedHosts: ['terminal.local']` fue necesaria en la vista previa del entorno anterior; no configura la URL pública ni impide el uso normal de localhost. La división de dependencias separa React y Three.js.

`"private": true` en `package.json` evita publicar accidentalmente un paquete npm; no define la visibilidad del repositorio ni del sitio.

## 5. Mapa del código

| Ruta | Responsabilidad |
|---|---|
| `index.html`, `src/main.jsx` | Entrada HTML y montaje de React. |
| `src/engine.js` | Fuente de verdad de reglas, cuentas, etapas, lotes, contratos, puntuación y reproducción de partidas. |
| `src/App.jsx` | Interfaz, cabinas, formulario de contratos, guía, resultados, almacenamiento e importación. |
| `src/Valley.jsx` | Three.js y alternativa SVG. |
| `src/styles.css` | Estilo, adaptación a pantalla y movimiento reducido. |
| `src/demo.js` | Ejecuta la plantilla completa mediante el mismo motor de las decisiones manuales. |
| `src/demo.json` | Plantilla de decisiones del ejemplo; no es el mismo formato que una partida exportada. |
| `public/ejemplos/partida_demo_v2.json` | Exportación completa de ejemplo, importable en la interfaz. |
| `tests/engine.test.js` | 31 pruebas del motor. |
| `.github/workflows/pages.yml` | Pruebas, build y despliegue. |
| `docs/REGLAS.md` | Reglas completas y puntuación vigente. |
| `docs/CAMBIOS.md` | Correcciones realizadas a partir del informe anterior. |
| `docs/VALIDACION.md` | Evidencias y alcance exacto de la validación. |
| `docs/Instructivo_Academico_Tension_de_Carbono_v2.docx` | Documento final de ocho páginas para el profesor. |
| `docs/antecedentes/` | Diseño y documentos históricos; leer su advertencia antes de usarlos. |

El estado del juego es un objeto serializable. `createGame()` lo inicia y **todas las decisiones pasan por `applyAction(original, action)`**. El motor clona el estado antes de actuar: si lanza `RuleError`, el original queda intacto. La interfaz presenta el error sin aplicar una transición parcial.

Las acciones implementadas son `policy`, `publish`, `subsidy`, `addProject`, `removeProject`, `confirmProjects`, `confirmGrants`, `execute`, `verify`, `openMarket`, `production`, `propose`, `accept`, `cancel`, `confirmCompany`, `close` y `next`. No crear una segunda lógica de cuentas en los componentes.

Las funciones `projectDetails`, `lot`, `available`, `remaining`, `companyView`, `previewRound`, `automaticRatings` y `scores` calculan vistas y resultados. `exportGame` e `importGame` guardan y reproducen las decisiones. Los IDs de proyecto y contrato los genera el motor.

## 6. Guardado, datos e identidades

La clave de `localStorage` es `tension-carbono-v2`. El guardado es propio del navegador, perfil y origen; no existe cuenta de usuario ni sincronización. Cambiar de localhost al sitio publicado no transfiere datos: exportar e importar JSON. No usar dos pestañas sobre la misma mesa.

El formato exportado contiene `schema: "tension-carbono"`, `version: "2.0.0"`, `setup` y `actions`. El motor admite como máximo 2.000 acciones. La interfaz limita cada archivo importado a 2.000.000 bytes. La importación reconstruye y valida la partida a partir de las acciones; no acepta como verdaderas cajas o puntuaciones manipuladas en el JSON. Esto protege coherencia de reglas, **no acredita quién tomó una decisión**. Las partidas del prototipo anterior no son compatibles; tampoco hay sincronización con sus archivos Python o Excel.

Las cabinas y la cortina son una ayuda para pasarse un computador, no autenticación ni protección de datos. Las comprobaciones de rol del motor son comprobaciones del flujo. Cualquier persona con acceso al navegador puede cambiar de rol o examinar el estado. Usar seudónimos y no publicar exportaciones con datos personales en GitHub.

## 7. Correcciones aceptadas y decisiones que deben preservarse

1. Se reconstruyó la aplicación completa: al prototipo le faltaba `App.jsx` y no compilaba.
2. Se eliminó el incentivo de ganar con una compra simbólica. La cobertura positiva inferior al 25 % ahora concede **5 puntos**, de modo que una empresa con máximo margen y solvencia obtiene 65, por debajo de 70.
3. El Estado necesita **1.800 t de producción acumulada para ganar**, además de cumplir clima y puntuación. No basta con perder esos veinte puntos.
4. Se eliminaron los anticipos; el motor rechaza anticipos no nulos. La fundación financia la ejecución antes de vender créditos y el contrato aceptado se paga al contado.
5. La valoración estatal es automática con tres criterios y evidencia por actor/año; no hay votos manuales ni votación secreta.
6. Una oferta de un lote no verificado se rechaza expresamente, sin registrarla silenciosamente.
7. La negociación puede corregirse antes del cierre. La producción debe seguir cubriendo los contratos activos; en caso contrario se anulan primero.
8. Las ofertas pendientes reservan inventario y capacidad de compensación. Solo acepta la contraparte. Al cancelar un contrato aceptado se devuelve su pago; no se vuelve a cobrar al cierre.
9. El porcentaje público de apoyo es común a las dos fundaciones y a todos los proyectos nuevos de la ronda. Puede renegociarse en proyectos y obliga a reconfirmar firmas. La tarifa queda fija al publicarse.
10. Los créditos son enteros. Un límite del 50 % de 75 tCO₂e permite 37 créditos, no 38. Los precios permiten dos decimales.
11. La entrega declara con precisión su modo local. No se deben presentar Firebase o salas remotas como funciones existentes.

Los criterios automáticos y ciertos umbrales son decisiones pedagógicas de v2, no conclusiones empíricas. El motor JavaScript actual y las reglas de v2 prevalecen frente a documentos anteriores. Los antiguos Python, Excel y prototipos incompletos no se incluyen como otra implementación vigente.

## 8. Evidencia de validación y límites de lo probado

En la preparación de v2 pasaron **31 pruebas** y la compilación. Para este traspaso se repitieron `npm ci` y `npm run check` en la copia del proyecto que se empaqueta: instalación correcta, 31 pruebas aprobadas, cero fallos y build exitoso. Esta comprobación no incluye un nuevo ensayo de navegador ni un despliegue público. La suite cubre una partida de cuatro rondas, conservación monetaria, cajas previas, fondos anteriores, firmas, verificación, reservas, aceptación bilateral, pago único, devolución, producción, lotes, valoración automática, clima e importación corrupta.

En navegador se probaron creación de mesa, cortinas, publicación de política, dos proyectos P1, convenios, ejecución, bloqueo por falta de verificación, propuestas iniciadas por ambas partes, aceptación, cierre del primer año y apertura del segundo. Después se cargó el ejemplo completo, se comprobaron sus resultados, la recarga con guardado local y el mapa alternativo. **No se realizaron manualmente cuatro rondas de negociación libre entre seis personas.**

El navegador de prueba no admitía WebGL. La escena Three.js compila, pero su representación gráfica en un dispositivo compatible queda pendiente. La advertencia de Vite por el bloque de Three.js superior a 500 kB sin comprimir es conocida; la carga es diferida y no impide compilar.

### Resultados del ejemplo vigente

| Indicador | Resultado |
|---|---:|
| Emisiones físicas anuales | 405; 350; 300; 290 tCO₂e |
| Emisiones acumuladas | 1.345 tCO₂e |
| Producción acumulada | 2.250 t |
| Recaudo anual | USD 4.100; 3.750; 4.500; 5.250 |
| Fondo público final | USD 3.280 |
| Caja final A / B / C | USD 11.610 / 9.080 / 6.910 |
| Caja final F1 / F2 | USD 3.250 / 3.250 |
| Puntos A / B / C | 100 / 100 / 75 |
| Puntos F1 / F2 | 100 / 100 |
| Puntos Estado | 95,5 |

El informe anterior daba 91 puntos estatales por otra forma de valorar al Estado. La diferencia a 95,5 se debe a la valoración automática; no cambió las cuentas físicas o monetarias del ejemplo.

Casos corregidos: A con un solo crédito logra 65 y no gana; producción acumulada 1.200 impide la victoria estatal; el escenario de máxima producción con la inversión de referencia emite 2.040 y todos pierden. No deducir que el ejemplo es una estrategia óptima o la única combinación ganadora.

### Limitaciones pendientes

- Una economía por computador y negociación presencial. No hay multijugador, salas de red, Firebase, login, chat ni roles protegidos.
- No se implementan adicionalidad, permanencia, fugas, reversión, incertidumbre o certificación real de proyectos. No describe un régimen legal de un país concreto.
- Modelo determinista con demanda de producto garantizada, precio exógeno, catálogo común y sin inversión interna de abatimiento, préstamos, anticipos, reventa ni créditos bancables entre años.
- El reloj orienta, pero no impone un cierre automático. No hay validación educativa con estudiantes.
- Probar todavía en equipos del aula: WebGL, móviles y distintos tamaños, descarga/importación de JSON, comparación de cinco mesas y una sesión con seis participantes para evaluar comprensión y negociación.
- GitHub Pages todavía no se ha desplegado ni probado en una URL pública.

## 9. Publicación desde una terminal del nuevo entorno

Esta sección es una ruta de ejecución pendiente. Los comandos son ejemplos para un **repositorio nuevo**, con acceso de red a GitHub y permisos suficientes. No ejecutar ciegamente si Codex ya abrió un repositorio existente. El siguiente agente debe revisar directorio, `git status`, remotos y cuenta antes de inicializar o publicar.

### Preparar el entorno

1. Descomprimir el ZIP y abrir `Tension_Carbono_Codex/` como raíz de trabajo.
2. Leer este archivo, `README.md`, `docs/CAMBIOS.md` y `docs/VALIDACION.md`.
3. Comprobar Node, npm, Git y GitHub CLI. En el entorno anterior no estaba instalado `gh`; el nuevo puede ser distinto.

```sh
node --version
npm --version
git --version
gh --version
gh auth status
```

Si falta autenticación, usar el flujo seguro de GitHub CLI o el mecanismo del entorno. Por ejemplo, `gh auth login --web --git-protocol https`; el acceso debe permitir subir workflows. Nunca imprimir tokens ni pegarlos en el repositorio. Verificar que la cuenta activa corresponde al destino autorizado:

```sh
gh api user --jq .login
gh repo view sjestiven/tension-carbono
```

Un error de acceso no prueba que el repositorio no exista. Si existe, revisar contenido y remoto antes de continuar; no reemplazar historia, no usar `push --force` ni eliminarlo. Si la cuenta activa es otra, resolver la autenticación antes de crear el repositorio bajo otro dueño.

### Comprobar y subir un repositorio nuevo

Ejecutar primero `npm ci` y `npm run check`. Revisar el contenido que se va a publicar. La carpeta ya excluye dependencias, compilación y credenciales. No añadir partidas personales.

Si aún no hay repositorio Git local ni remoto, usar:

```sh
git init -b main
git add .
git diff --cached --stat
git commit -m "Entrega inicial de Tension de Carbono v2"
gh repo create sjestiven/tension-carbono --public --source=. --remote=origin --push
```

Git necesita una identidad de autor configurada; si falta, acordarla con el usuario, sin inventar nombre o correo ni cambiar su configuración global. La autorización del usuario es para que el repositorio y el juego sean públicos. No se eligió una licencia de redistribución: no añadir una licencia arbitraria.

### Habilitar Pages y ejecutar el despliegue

Se puede hacer desde **Settings → Pages → Source → GitHub Actions**, o mediante la API con GitHub CLI. Consultar primero:

```sh
gh api repos/sjestiven/tension-carbono/pages
```

Si la cuenta tiene acceso administrativo y todavía no existe configuración de Pages, crearla:

```sh
gh api --method POST repos/sjestiven/tension-carbono/pages -f build_type=workflow
```

Si ya existe y utiliza otra fuente, actualizarla con `--method PUT` y el mismo `build_type=workflow`, después de revisar su estado. Si hay un error de permisos o una política de cuenta, resolverlo; no tratarlo automáticamente como ausencia del sitio.

El primer push puede disparar el workflow antes de habilitar Pages y ese intento puede fallar. Una vez configurado Pages, lanzar explícitamente:

```sh
gh workflow run pages.yml --ref main --repo sjestiven/tension-carbono
gh run list --workflow pages.yml --repo sjestiven/tension-carbono
```

Esperar el workflow correspondiente y revisar su conclusión y la URL real de despliegue. Verificar además la visibilidad del repositorio y la configuración del sitio:

```sh
gh repo view sjestiven/tension-carbono --json nameWithOwner,visibility,url
gh api repos/sjestiven/tension-carbono/pages --jq .html_url
```

No dar por publicada la URL solo por deducir su forma. Si se mantienen dueño y nombre propuestos, la URL esperada sería `https://sjestiven.github.io/tension-carbono/`, pero al momento de este traspaso **no es una publicación verificada**.

### Criterios para terminar la tarea de publicación

1. Repositorio correcto, con visibilidad `PUBLIC`, código completo y workflow en la raíz apropiada.
2. Pruebas y build exitosos en GitHub Actions; despliegue concluido.
3. URL real abre sin login y carga sus recursos dentro del subdirectorio del repositorio.
4. Se puede crear mesa, abrir guía y cargar el ejemplo con los resultados de referencia. Revisar el mapa SVG si falta WebGL.
5. Se documentan enlace del repositorio, enlace del juego, commit y límites de la comprobación. Actualizar en `README.md` y `docs/VALIDACION.md` las frases de publicación pendiente solo después de verificarla.

El workflow ya incluye `contents: read`, `pages: write`, `id-token: write`, build con Node 22 y despliegue al entorno `github-pages`. No debe subirse `dist/` al repositorio fuente ni configurarse Pages para servir directamente el `index.html` de React sin compilar.

Referencias oficiales consultadas para preparar la ruta de terminal:

- GitHub CLI, crear repositorio: https://cli.github.com/manual/gh_repo_create
- GitHub REST API, Pages: https://docs.github.com/en/rest/pages/pages
- Workflows personalizados de Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 10. Instrucción sugerida para el nuevo proyecto Codex

> Lee CONTEXTO_PARA_CODEX.md, README.md, docs/CAMBIOS.md y docs/VALIDACION.md. Este es Tensión de Carbono v2, un juego educativo de mercado de carbono ya implementado. Comprueba el entorno y ejecuta npm ci y npm run check. Revisa la cuenta GitHub activa y los remotos. La publicación pública está autorizada; el destino propuesto es sjestiven/tension-carbono. Si no existe, crea el repositorio público, sube este código completo y habilita GitHub Pages con el workflow incluido. Si ya existe, inspecciona su contenido y conserva la historia. Verifica el despliegue y el juego en la URL real, actualiza el estado de publicación en la documentación y entrega los enlaces. Conserva las reglas vigentes y declara lo que no puedas verificar. Usa autenticación segura sin guardar secretos ni modificar reglas por iniciativa propia.

## 11. Reglas vigentes completas

Se incorpora a continuación el contenido de `docs/REGLAS.md` para que este Markdown sea autónomo. Al modificar reglas en el futuro, actualizar el motor, las pruebas, la guía, el instructivo y esta copia de forma coherente.

---

### Reglas del juego Tensión de Carbono 2

## Objetivo y roles

Cada economía tiene tres empresas, dos fundaciones y un Estado. El objetivo es comprender cómo la financiación de proyectos produce una oferta de créditos y cómo un impuesto genera incentivos para comprarlos. Se juegan cuatro años y las mesas no comercian entre sí.

Un crédito representa una tCO₂e de reducción externa verificada frente a una línea base. El proyecto y el crédito son bienes distintos. La fundación conserva la propiedad del proyecto. El Estado no fija precios ni autoriza contratos privados.

Empresas A, B y C comienzan con USD 5.000 cada una. Sus intensidades son 0,40, 0,50 y 0,60 tCO₂e por tonelada de producto. Cada fundación tiene USD 1.000 y una línea base externa de 100 tCO₂e/año. El Estado inicia sin fondo.

## Producción e impuesto

| Nivel | Producto t | Ingresos USD | Costos USD |
|---|---:|---:|---:|
| Bajo | 100 | 5.000 | 3.400 |
| Medio | 150 | 7.500 | 5.000 |
| Medio alto | 200 | 10.000 | 6.600 |
| Alto | 250 | 12.500 | 8.400 |
| Muy alto | 300 | 15.000 | 10.400 |

Se vende todo a USD 50/t. El Estado publica una tarifa común entera entre USD 20 y 40/tCO₂e. Las bandas baja 20–25, media 26–32 y alta 33–40 son intervalos de elección, no tramos progresivos. La tarifa no se modifica en ese año.

Cada empresa puede retirar créditos enteros hasta el 50 % de sus emisiones anuales. Si el tope es fraccionario, se utiliza su parte entera inferior. No hay préstamos ni caja negativa; los créditos se pagan con la caja disponible al aceptar. Los ingresos, costos productivos e impuesto se liquidan al cerrar.

## Proyectos y convenios

| Tipo | Proyecto | Costo único USD | Reducción anual tCO₂e |
|---|---|---:|---:|
| P1 | Eficiencia comunitaria | 600 | 20 |
| P2 | Captura de metano | 1.000 | 40 |

Los costos los fija el catálogo docente. Incluyen la operación hasta el año 4. Los proyectos se pueden repetir y generan reducciones desde su año de ejecución, si se verifica el lote anual. Su capacidad instalada no puede superar 100 por fundación y los ámbitos no se superponen.

Al cierre, el 30 % del recaudo se reserva para proyectos del año siguiente y el 70 % pasa al presupuesto general. El saldo del fondo no utilizado se conserva. El Estado publica un porcentaje común de apoyo de 0 a 50 % del costo de cada proyecto nuevo. Puede renegociar ese porcentaje antes de ejecutar, con nuevas confirmaciones. La suma de aportes no puede superar el fondo inicial de la ronda.

La fundación debe tener dinero para ejecutar antes de vender. El aporte público no compra créditos ni propiedad para el Estado. Cada fundación confirma su plan y el Estado confirma los convenios. El docente ejecuta después de las tres firmas y de validar cajas, topes y fondos.

## Etapas y negociación

1. **Política pública.** El Estado elige y publica tarifa y porcentaje de apoyo.
2. **Proyectos.** Las fundaciones proponen inversiones y acuerdan convenios. Las empresas pueden planear producción. Se firman y ejecutan los proyectos.
3. **Verificación.** El docente comprueba financiación, ejecución y línea base; verifica o rechaza expresamente cada lote. Es una simulación, no auditoría ambiental real.
4. **Mercado.** Empresas y fundaciones proponen contratos bilaterales. Cada oferta registra lote, contrapartes, cantidad y precio. La oferta reserva inventario y capacidad de compensación; solo la contraparte acepta. Se paga al contado y no hay anticipos. Puede rechazarse o anularse antes del cierre, devolviendo el pago. No hay reventa.
5. **Resultados.** Las empresas confirman sus planes; el docente cierra cuando no hay ofertas pendientes. Se liquidan producción e impuestos, se retiran los créditos y se calcula la evaluación estatal. Se revisan los resultados y se pasa al siguiente año.

La producción puede corregirse antes del cierre siempre que respete el tope de los contratos activos; de lo contrario deben anularse primero. Un error rechaza la acción sin modificar el estado previo. No se puede ofrecer un lote no verificado. Los créditos sin venta vencen; las reducciones verificadas sí cuentan en la meta física. Los proyectos instalados continúan aunque su lote de un año no se verifique.

## Dos cuentas distintas

Emisiones propias = producción × intensidad.

Impuesto = tarifa × (emisiones propias − créditos retirados).

Utilidad = ingresos − costo productivo − gasto en créditos − impuesto.

Emisiones físicas del equipo = emisiones empresariales + 200 − reducciones externas verificadas.

Los créditos no se descuentan de nuevo de las emisiones físicas. Con emisiones empresariales 300, reducción externa 200, retiro de 150 créditos y tarifa 30, el impuesto total es USD 4.500 y la emisión física es 300 tCO₂e.

## Puntuación y victoria

Si las emisiones físicas acumuladas superan 1.400 tCO₂e, todos pierden. Se pueden continuar las cuatro rondas para analizar. Cumplido ese límite, gana cada rol con al menos 70/100. El Estado además debe alcanzar 1.800 t de producción acumulada. No existe un ganador absoluto.

### Empresas

| Componente | Condiciones ordenadas | Puntos respectivos |
|---|---|---|
| Margen acumulado utilidad/ingresos | ≥10 %; ≥5 % y <10 %; positivo <5 %; no positivo | 40; 25; 10; 0 |
| Cobertura créditos/emisiones acumuladas | ≥40 %; ≥25 % y <40 %; positiva <25 %; nula | 40; 30; **5**; 0 |
| Solvencia | Caja no negativa y obligaciones liquidadas durante toda la partida | 20; en otro caso 0 |

### Fundaciones

| Componente | Condiciones ordenadas | Puntos respectivos |
|---|---|---|
| Reducción acumulada | ≥200; ≥100 y <200; positiva <100; nula | 40; 25; 10; 0 |
| Vendidos/emitidos | ≥70 %; ≥40 % y <70 %; positiva <40 %; nula o sin emisión | 30; 20; 10; 0 |
| Caja y contratos | Liquidados y caja ≥USD 1.000; liquidados y caja no negativa menor de 1.000; otro caso | 30; 15; 0 |

### Estado

| Componente | Condición | Puntos |
|---|---|---:|
| Ambiente | Dentro de 1.400 tCO₂e | 30 |
| Producción | ≥1.800 t acumuladas | 20 |
| Financiación | Reserva 30 %, aportes y límites respetados | 20 |
| Publicación | Política y criterio públicos durante la partida | 10 |
| Valoración | 10 + V/2, donde V suma veinte valoraciones | 0–20 |

La producción es también una condición de victoria estatal. Los 20 puntos financieros se conceden a las partidas válidas, porque el motor impide infringir esos límites. No se redondean los medios puntos.

## Valoración automática del Estado

Se calcula para los cinco actores privados al cierre de cada año. Tres criterios cumplidos dan +1, dos dan 0 y cero o uno dan −1. Se muestra la evidencia de cada criterio.

| Actor | Criterio | Umbral de la versión 2 |
|---|---|---|
| Empresas | Transparencia | Tarifa y criterio publicados antes de ejecutar. |
| Empresas | Trayectoria ambiental | Emisión física acumulada ≤350 × número de año. |
| Empresas | Viabilidad | Utilidad anual ≥0 y caja al cierre ≥0. |
| Fundaciones | Transparencia | Tarifa y criterio publicados antes de ejecutar. |
| Fundaciones | Trato común | Todos los convenios aplican el mismo porcentaje de apoyo publicado. Si no hay convenios, no hay trato diferencial. |
| Fundaciones | Impulso a proyectos | Su reducción anual verificada alcanza 20 × número de año: 20, 40, 60 y 80 tCO₂e. |

Estos umbrales hacen operativa la lista pendiente del informe. Son elecciones pedagógicas nuevas, no una atribución causal de resultados a la gestión estatal. La trayectoria de 350 por año afecta las valoraciones, pero la derrota colectiva solo depende de superar 1.400 acumuladas.

## Orientación docente

Sesión propuesta de 90 minutos: 12 de contextualización; 8 de ensayo; cuatro rondas de 12; 17 de discusión y 5 de respuesta individual. El reloj es orientativo y no fuerza un cierre automático.

Los puntos no son la nota académica. Rúbrica: 30 % distinción proyecto, financiación y crédito; 30 % justificación con datos; 25 % cuenta fiscal frente a física; 15 % mejora y participación. La respuesta final explica una decisión, una alternativa y consecuencias con dos datos.

Modo operativo: un computador por mesa. Los participantes se alternan y negocian presencialmente. La vista docente compara hasta cinco JSON completos; no conecta mesas en red. Cada equipo debe exportar su partida antes de abandonar el navegador.
