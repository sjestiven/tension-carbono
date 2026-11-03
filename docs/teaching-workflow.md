# Orientación de turnos guiados

Esta orientación complementa el instructivo académico de la versión 2 con las reglas vigentes de la versión 3.1, revisadas el 2 de noviembre de 2026. Describe los turnos, la producción anual fija, la comparación de cotizaciones y el final anticipado por emisiones. Conserva los parámetros económicos y las fórmulas de cuentas y puntuación. El juego lo ofrece el Laboratorio de Economía Aplicada.

## Registro e identificación para la investigación

Al iniciar la clase, reparta los cinco alias entre las mesas para evitar duplicados. Cada partida conserva su alias y tiene un identificador de sesión propio. Los nombres visibles y la apariencia de los avatares son opcionales. Presente a las empresas y fundaciones como referencias educativas. Explique que las intensidades de emisiones y las cuentas se asignan para el ejercicio.

Pida los seis códigos solo si el equipo autoriza el registro. Explique que el equipo puede jugar sin completar códigos. El registro privado vincula el alias y las decisiones con los códigos por rol. Registra también las opciones de avatar elegidas al inicio, que describen preferencias de personalización. Las decisiones de avatar sin selección explícita quedan vacías en el análisis.

El pie de página distingue datos pendientes de datos confirmados. Una falla de conexión no impide jugar. El equipo puede detener la captura futura desde ese diálogo; los datos ya enviados requieren gestión del investigador en Supabase. Los códigos quedan fijos durante una sesión registrada para no atribuir decisiones a otra persona. Para otro grupo, reinicie y confirme de nuevo los participantes. Los JSON exportados contienen los códigos y no son archivos públicos.

Las consultas para analizar decisiones, tiempos, producción, precios y resultados están en `supabase/analysis.sql`; se ejecutan desde el SQL Editor del proyecto autorizado. Las pruebas técnicas llevan el estudio `validation` y las consultas de aula usan `pilot-2026`, por lo que no mezclan las pruebas con estudiantes. Una partida sin cierre final no prueba abandono. El tiempo visible de la interfaz no mide atención ni comprensión; combine los registros con observaciones y discusión. Las tasas describen las partidas registradas, no a todos los usuarios del sitio.

## Preparación y primera decisión


Antes de jugar, abra **Ver partida de ejemplo año a año** desde el inicio. En cada año la clase revisa política, producción, proyectos verificados, mercado y balance antes de avanzar. Pida al grupo que identifique qué cambia al pasar al siguiente año y explique por qué los créditos modifican el impuesto y la verificación modifica la cuenta física. El recorrido ofrece cuentas detalladas en cada cierre y puntajes al finalizar, con la mesa guardada disponible al volver al inicio.

El juego abre en el inicio y conserva la mesa guardada hasta que se decida continuar o reiniciar. Al crear la mesa, el programa anuncia el turno del Estado. El cronómetro permite 12, 8 o 4 minutos e inicia automáticamente al abrir su cabina inicial, una vez por año; puede pausarse. La duración se recuerda entre años. Cambiarla reinicia y pausa el reloj; llegar a cero no termina la ronda. Cada participante abre su turno, toma decisiones y utiliza el botón de confirmar o continuar. Elegir un nivel de producción muestra la selección actual; confirmar fija esa producción hasta el año siguiente y termina el turno. Al cambiar de participante, la cortina indica a quién entregar el dispositivo y la tarea pendiente.

Cada año sigue este recorrido:

1. El Estado publica el impuesto y la cofinanciación pública.
2. Las empresas A, B y C, en ese orden, eligen y confirman su producción definitiva del año.
3. Las fundaciones F1 y F2 eligen y firman sus planes de proyectos. Pueden confirmar un plan sin inversiones nuevas.
4. El Estado firma los convenios con aporte público. Si el aporte total es cero y los planes son válidos, el motor aplica el criterio ya publicado sin otro relevo al Estado.
5. La mesa docente revisa en un solo formulario la ejecución y decide explícitamente verificar o rechazar cada lote. Un botón registra las decisiones en orden y abre el mercado; no hay aprobaciones preseleccionadas.
6. Ambas fundaciones presentan sus cotizaciones antes de cualquier compra: F1 primero en años impares y F2 primero en años pares. Después las empresas A, B y C comparan precios e inventarios, preparan y confirman ofertas vinculantes; por último las fundaciones deciden ventas y finalizan las ofertas pendientes.
7. El motor cierra automáticamente después de resolver las ventas y abre resultados. Si el acumulado supera 1.400 tCO₂e, todos pierden, se detiene el reloj y se abren los resultados finales sin permitir otra ronda. Si no supera el límite, revisa los resultados y puede iniciar el siguiente año hasta completar cuatro; el primer turno corresponde de nuevo al Estado.

El límite se aplica a emisiones físicas acumuladas registradas, no a previsiones. Exactamente 1.400 tCO₂e permite continuar si aún faltan años. Ante una derrota anticipada, explique: «El presupuesto climático era una restricción compartida. Al superarlo, la economía termina; ahora analizamos qué decisiones llevaron al resultado». Los puntos al corte no otorgan victorias ni se extrapolan a años no jugados. Puede usarse el tiempo restante para comparar alternativas y argumentar con las cuentas exportadas. Una partida finalizada por emisiones también se puede cargar en Comparar mesas.

La mesa docente aparece como turno actual cuando debe intervenir. No es necesario buscar un control debajo del mapa. Una franja breve al principio muestra emisiones acumuladas, impuesto y fondo público. Organizaciones despliega el valle y los nombres; Ruta del año despliega el recorrido. Ambos mantienen el espacio principal disponible para la cabina de decisión. Menú, en el encabezado, permite abrir u ocultar la navegación con una animación y recuerda la preferencia en este navegador. Al elegir una sección, el menú vuelve a cerrarse. Escape cierra el menú o el desplegable enfocado.

## Producción, ofertas y decisiones de venta

Antes de fijar producción, compare emisiones y utilidad entre los cinco niveles. Luego revise los dos bloques de la selección: resultado del año y caja y margen de compensación. Explique la utilidad prevista: ingresos menos costos productivos, pago de créditos e impuesto. Al elegir producción todavía no se presuponen compras; la caja final suma a la caja inicial el resultado económico. Una pérdida anual no equivale a falta de caja. Se impide confirmar un nivel con caja final negativa sin compras inciertas; el Estado debe publicar una tarifa que deje al menos una opción viable a cada empresa. Esto evita depender de una venta que la fundación puede rechazar.

Ambas fundaciones cotizan antes de comprar. Las empresas A, B y C preparan sus ofertas como borradores y revisan el pago, el ahorro de impuesto y la caja/ utilidad resultantes. Comprar créditos siempre reduce caja al aceptar; si el precio está por debajo del impuesto, puede aumentar utilidad. La previsión que incluye todas las ofertas no garantiza que todas sean aceptadas. El programa comprueba caja conjunta para ambos proveedores y solvencia para cualquier combinación de aceptaciones.

Cada empresa puede retirar borradores y confirma expresamente el compromiso antes de entregar el dispositivo. Las ofertas confirmadas no se retiran. Las fundaciones reciben todas las propuestas dirigidas a ellas, ordenadas por precio para facilitar la comparación, y eligen a quién vender; la selección sigue siendo su decisión. Solo aceptan ofertas completas que caben en su inventario. Al finalizar ventas rechazan las restantes. No hay pago por una oferta rechazada; se liberan sus reservas. Una fundación sin ofertas se omite automáticamente. Después de resolver las ventas se pasa directamente a resultados; los contratos aceptados no se anulan ni se reabre el mercado.

No hay reparto garantizado de ventas ni inventarios compartidos. Una empresa puede quedar sin créditos si su oferta no es elegida; tampoco puede elevar o redirigir la oferta ya confirmada. Para el primer ensayo, pida revisar cantidad, proveedor y precio antes de confirmar. En el debate compare quién vendió, a qué precios, qué ofertas quedaron sin atender y cómo cambió la utilidad de cada empresa. Esta mecánica enfatiza compromiso y selección entre compradores; reduce la práctica de renegociación bilateral. Los JSON antiguos 2.x siguen mostrando su recorrido original con cancelaciones.

## Balance estatal y señal colectiva

El Estado ve al inicio de cada nuevo año un balance del cierre anterior: trayectoria de emisiones, pérdidas empresariales, reducciones verificadas por fundación y fondo disponible. La evidencia detallada de la valoración queda desplegable y se conserva su puntuación histórica. Aclare que la evaluación automática no es un voto de los participantes ni una prueba de causalidad de la política. La fórmula estatal aún concede 80 puntos cuando cumple clima y producción; este cambio mejora la retroalimentación, no recalibra la dificultad de ganar.

Los tonos otoñales, la barra y el texto muestran el presupuesto climático confirmado que toda la mesa consume. Una previsión del cierre sigue siendo provisional; no determina una derrota anticipada. Exactamente 1.400 sigue dentro del presupuesto. Las compras de créditos no restan otra vez emisiones físicas. Mantenga el año visible para interpretar cuánto presupuesto queda y evite confundir el color con una calificación individual.

## Cofinanciación y detalles

«Cofinanciación pública» y «apoyo público» designan el mismo porcentaje del costo de un proyecto que cubre el Estado. Se selecciona una sola vez al publicar la política. Sin fondo disponible, se muestra 0%. Al firmar convenios se revisan sus valores calculados; no se pide un segundo porcentaje.

Renegociar el porcentaje es una opción expresa que devuelve los planes a las fundaciones para nuevas firmas. El impuesto publicado permanece fijo. Los botones Detalles explican cada selección al pasar el cursor, enfocar con el teclado o tocar el botón.

## Cómo orientar la decisión del Estado

La firma estatal aprueba la financiación del proyecto. Debe comprobar cuatro condiciones: el mismo porcentaje publicado para ambas fundaciones, fondo público suficiente, dinero propio suficiente en cada fundación y capacidad máxima de 100 tCO₂e/año por fundación. Si se cumplen, firma; si alguna falla, devuelve el plan para corregirlo o renegocia el porcentaje común con nuevas firmas. El programa identifica y bloquea las asignaciones inviables. En el primer año, con fondo público cero, el motor aplica el convenio sin aporte: los proyectos se pagan con recursos de las fundaciones.

Ejemplo: un P1 cuesta USD 600. Con apoyo del 50%, el Estado necesita USD 300 disponibles y la fundación otros USD 300. Dos P1 con ese apoyo requieren USD 600 de fondo público total. Si solo hay USD 500, no puede firmar ambos tal como están: deben ajustar el plan o el porcentaje común.

Puede explicarse a los estudiantes así: «El Estado cuida el presupuesto y aplica el mismo criterio de apoyo a ambas fundaciones. Firma si la financiación es viable. La mesa docente comprueba después si las reducciones están ejecutadas y verificadas». Rechazar un lote ambiental es función docente; la firma estatal no certifica créditos ni compra su propiedad.

## Confirmaciones y reinicio

Los requisitos pendientes se muestran antes de permitir ejecutar una acción. La interfaz identifica el lote o participante que falta y explica las opciones que no se pueden elegir por límites de caja, capacidad o créditos. Una firma de la fundación confirma su propio plan; la firma estatal y la ejecución comprueban el conjunto de convenios.

El menú Reiniciar distingue entre volver el reloj a la duración elegida y comenzar otra vez la partida. Reiniciar la partida requiere confirmación, permite exportar antes y conserva los nombres. Después vuelve al inicio con el año 1 preparado y el reloj detenido; la cabina del Estado se abre solo al volver a comenzar. Cancelar conserva el avance. El logotipo abre el inicio sin borrar la mesa.

Los puntos siguen siendo distintos de la nota académica. La prueba con estudiantes debe observar comprensión, participación, tiempos y calidad de la negociación, además de la facilidad para completar el recorrido.

## Mesa compartida y visuales de la versión 3.1

Los seis avatares son referencias de rol; no permiten saltarse turnos ni representan identidades autenticadas. Se conserva el reconocimiento explícito del siguiente participante para evitar confirmar por otra persona. El operador puede rotar anualmente si el grupo decide dictarle sus decisiones, pero debe leer cantidades y consecuencias antes de confirmar y dejar que cada rol decida. Observe que todos participen: concentrar el ratón puede concentrar la voz.

Se omiten cotizaciones de lotes vacíos y compras cuando ningún lote está disponible. Elegir no comprar sigue siendo explícito cuando existe oferta; una cesta vacía se confirma en un paso. Agotar el stock o resolver la última oferta termina las ventas sin pedir otro clic. Las ofertas restantes tras agotar stock se rechazan automáticamente. Los resultados se conservan para discutir antes del único botón de año siguiente; el reloj queda pausado durante esa discusión.

Los comprobantes indican dinero realmente pagado, créditos aplicados y cierre fiscal. Una oferta vinculante reserva recursos, pero no es pago. Los tonos otoñales representan presupuesto físico confirmado; los créditos no limpian el valle una segunda vez. Las animaciones son breves, no bloquean controles, no tienen sonido automático y pueden desactivarse. La preferencia visual no cambia resultados ni puntos. Distinga en el análisis las acciones con `origin: system` de las decisiones humanas.

La simulación técnica de referencia baja de 63 a 57 cambios de responsable; no demuestra que los alumnos jueguen 9,5% más rápido. La combinación temprana de proyectos y cotizaciones y la firma automática de apoyos positivos quedan fuera de esta versión porque alterarían información y discreción. Las partidas 3.0 y 2.x conservan sus recorridos y deben analizarse por separado.
