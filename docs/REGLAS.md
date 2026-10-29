# Reglas del juego Tensión de Carbono 2

## Recorrido guiado

La interfaz indica un turno obligatorio y el siguiente participante. El orden inicial de cada año es: Estado publica la política; empresas A, B y C confirman su producción; fundaciones F1 y F2 firman sus proyectos; Estado firma los convenios; mesa docente ejecuta y verifica. Los botones de confirmar guardan la decisión y muestran el relevo. No es necesario buscar el control docente al final del mapa.

En el mercado ambas fundaciones publican primero sus cotizaciones indicativas, sin ventas ni reservas. Cotiza primero F1 en años impares y F2 en años pares. Después las empresas A, B y C comparan ambos inventarios y precios, eligen explícitamente un proveedor y negocian. Cada propuesta pasa temporalmente a la contraparte para aceptar o rechazar y luego regresa al turno principal. Las tres empresas confirman sus contratos y la mesa docente cierra el año. Antes del cierre, el docente puede reabrir la negociación; los acuerdos se conservan y se solicitan nuevas confirmaciones, pero la producción permanece fija. Después revisa resultados e inicia el año siguiente, cuyo primer turno vuelve al Estado.

«Cofinanciación pública» y «apoyo público» son el mismo porcentaje. Se publica una vez y después se muestra al firmar convenios. Renegociarlo es una acción expresa que exige nuevas firmas. Los botones Detalles explican las selecciones mediante un cuadro flotante al usar el cursor, el teclado o un toque. Los requisitos pendientes identifican a cada participante y bloquean el avance antes de ejecutar una acción incompleta.

El menú Reiniciar permite reiniciar solo el reloj o la partida. Reiniciar la partida exige confirmación y permite exportar antes; conserva los nombres y comienza de nuevo en el año 1. El logotipo vuelve al inicio sin borrar el avance. Las condiciones económicas y de puntuación se describen a continuación.

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

Se vende todo a USD 50/t. Cada empresa confirma su producción antes de los proyectos: esa decisión queda fija durante todo el año, incluso al reabrir la negociación. Puede elegir una producción diferente al comenzar el año siguiente. El Estado publica una tarifa común entera entre USD 20 y 40/tCO₂e. Las bandas baja 20–25, media 26–32 y alta 33–40 son intervalos de elección, no tramos progresivos. La tarifa no se modifica en ese año.

Cada empresa puede retirar créditos enteros hasta el 50 % de sus emisiones anuales. Si el tope es fraccionario, se utiliza su parte entera inferior. No hay préstamos ni caja negativa; los créditos se pagan con la caja disponible al aceptar. Los ingresos, costos productivos e impuesto se liquidan al cerrar.

## Proyectos y convenios

| Tipo | Proyecto | Costo único USD | Reducción anual tCO₂e |
|---|---|---:|---:|
| P1 | Eficiencia comunitaria | 600 | 20 |
| P2 | Captura de metano | 1.000 | 40 |

Los costos los fija el catálogo docente. Incluyen la operación hasta el año 4. Los proyectos se pueden repetir y generan reducciones desde su año de ejecución, si se verifica el lote anual. Su capacidad instalada no puede superar 100 por fundación y los ámbitos no se superponen.

Al cierre, el 30 % del recaudo se reserva para proyectos del año siguiente y el 70 % pasa al presupuesto general. El saldo del fondo no utilizado se conserva. El Estado publica un porcentaje común de apoyo de 0 a 50 % del costo de cada proyecto nuevo. Puede renegociar ese porcentaje antes de ejecutar, con nuevas confirmaciones. La suma de aportes no puede superar el fondo inicial de la ronda.

La fundación debe tener dinero para ejecutar antes de vender. El aporte público no compra créditos ni propiedad para el Estado. Cada fundación confirma su plan y el Estado confirma los convenios. El docente ejecuta después de las tres firmas y de validar cajas, topes y fondos.

El Estado aprueba la financiación cuando se aplica el porcentaje común publicado, hay fondo suficiente, cada fundación puede pagar su parte y respeta su capacidad máxima de 100 tCO₂e/año. Si no se cumple, devuelve el plan para corregirlo o renegocia el porcentaje común antes de nuevas firmas. No certifica las reducciones: esa función corresponde a la mesa docente en la verificación. En el año 1, con fondo cero, firma convenios con aporte público de cero.

## Etapas y negociación

1. **Política pública.** El Estado elige y publica tarifa y porcentaje de apoyo.
2. **Proyectos.** Las empresas confirman su producción definitiva del año; las fundaciones proponen inversiones y acuerdan convenios. Se firman y ejecutan los proyectos.
3. **Verificación.** El docente comprueba financiación, ejecución y línea base; verifica o rechaza expresamente cada lote. Es una simulación, no auditoría ambiental real.
4. **Mercado.** Ambas fundaciones cotizan antes de cualquier compra. Cada una conserva su propio inventario; la demanda de las empresas es limitada por el tope de compensación. Las cotizaciones no reservan créditos ni obligan a comprar. Las empresas comparan y proponen contratos bilaterales, ajustando el precio unitario en pasos de USD 0,50. Cada oferta registra lote, contrapartes, cantidad y precio. La oferta bilateral sí reserva inventario y capacidad de compensación; solo la contraparte acepta. Se paga al contado y no hay anticipos. Puede rechazarse o anularse antes del cierre, devolviendo el pago. No hay reventa ni ventas garantizadas para ninguna fundación.
5. **Resultados.** Las empresas confirman sus planes; el docente cierra cuando no hay ofertas pendientes. Se liquidan producción e impuestos, se retiran los créditos y se calcula la evaluación estatal. Se revisan los resultados y se pasa al siguiente año.

En la revisión previa al cierre pueden corregirse los contratos, pero no la producción ya confirmada. Un error rechaza la acción sin modificar el estado previo. No se puede ofrecer un lote no verificado. Los créditos sin venta vencen; las reducciones verificadas sí cuentan en la meta física. Los proyectos instalados continúan aunque su lote de un año no se verifique.

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

Sesión propuesta de 90 minutos: 12 de contextualización; 8 de ensayo; cuatro rondas de 12; 17 de discusión y 5 de respuesta individual. El reloj inicia automáticamente al abrir la cabina inicial del Estado cada año. Se puede pausar y reiniciar; es orientativo y no fuerza un cierre automático.

Los puntos no son la nota académica. Rúbrica: 30 % distinción proyecto, financiación y crédito; 30 % justificación con datos; 25 % cuenta fiscal frente a física; 15 % mejora y participación. La respuesta final explica una decisión, una alternativa y consecuencias con dos datos.

Modo operativo: un computador por mesa. Los participantes se alternan y negocian presencialmente. La vista docente compara hasta cinco JSON completos; no conecta mesas en red. Cada equipo debe exportar su partida antes de abandonar el navegador.
