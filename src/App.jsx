import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Menu, Leaf, Factory, Landmark, Trees, BookOpen, Download, Upload, ArrowRight, Check, X, LockKeyhole, Play, Pause, RotateCcw, Plus, Trash2, ChevronRight, GraduationCap, LayoutDashboard, BarChart3, Settings2, FileJson, ShieldCheck, AlertCircle, ChevronDown } from 'lucide-react';
import { createGame, applyAction, scores, exportGame, importGame, ROLES, COMPANIES, FOUNDATIONS, isGameOver, climateStatus, isBatchMarket, isStreamlined, VERSION, gameRules, creditLotId, expiredCredits } from './engine.js';
import GuidedExample from './components/guided_example.jsx';
import EmissionsBreakdown from './components/emissions_breakdown.jsx';
import GuidedRound from './components/GuidedRound.jsx';
import PolicyBalance from './components/PolicyBalance.jsx';
import RoleCast from './components/RoleCast.jsx';
import TransactionReceipt from './components/TransactionReceipt.jsx';
import { transactionReceipt } from './motion.js';
import GameNavigation from './components/GameNavigation.jsx';
import RoundTimer, { ROUND_DURATIONS } from './components/RoundTimer.jsx';
import { ResearchRecorder } from './research/recorder.js';
import { researchConfig, createTransport } from './research/transport.js';
import { ResearchContext } from './research/context.jsx';
import { AVATAR_GENDERS, DEFAULT_AVATAR_GENDERS, SCENARIO_NAMES, STUDENT_CODE_PATTERN, TEAM_ALIASES, isStudentCode, teamAliasForName } from './table_setup.js';
import { Button, Field, Stat } from './components/ui.jsx';
import { currentTurn, roleName } from './workflow.js';
const Valley=lazy(()=>import('./Valley.jsx'));
const STORAGE='tension-carbono-v2';
const n=(x,d=0)=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:d}).format(x);
const usd=x=>`USD ${n(x,2)}`;
const roleLabel=r=>r==='Docente'?'Mesa docente':r==='Estado'?'Estado':COMPANIES.includes(r)?`Empresa ${r}`:`Fundación ${r.slice(1)}`;
const Icon=({role,...props})=>{const I=role==='Estado'?Landmark:COMPANIES.includes(role)?Factory:role==='Docente'?GraduationCap:Trees;return <I {...props}/>;};
function saved(){try{const raw=localStorage.getItem(STORAGE);return raw?importGame(JSON.parse(raw)):null;}catch{return null;}}
function Modal({title,children,onClose,wide=false}){
  const el=useRef();
  useEffect(()=>{const old=document.activeElement;el.current?.focus();const key=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const items=el.current?.querySelectorAll('button,input,select,a,summary,[tabindex="0"]');if(items?.length){const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}};document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);old?.focus?.();};},[]);
  return <div className="modal-backdrop" onClick={onClose}><section className={`modal ${wide?'wide':''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={el} onClick={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Cerrar ventana" onClick={onClose}><X size={20}/></button></div>{children}</section></div>;
}
function Setup({ initial, onSubmit, onClose, starting, researchEnabled }) {
  const [alias, setAlias] = useState(() => {
    const savedAlias = teamAliasForName(initial?.names.team);
    return Object.hasOwn(TEAM_ALIASES, savedAlias) ? savedAlias : '';
  });
  const [players, setPlayers] = useState(initial?.players ?? {});
  const [avatarGenders, setAvatarGenders] = useState(initial?.avatarGenders ?? {});
  const [studentCodes, setStudentCodes] = useState({});
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const names = starting ? SCENARIO_NAMES : initial.names;

  function submit(event) {
    event.preventDefault();
    if (consent && ROLES.some(role => !isStudentCode(studentCodes[role]))) {
      setError('Ingresa un código de exactamente siete dígitos para cada participante.');
      return;
    }
    onSubmit({
      names: starting ? { ...names, team: TEAM_ALIASES[alias] } : names,
      players,
      avatarGenders,
      tableConfigured: starting || initial?.tableConfigured,
      studentCodes: starting ? (consent ? studentCodes : {}) : initial.studentCodes,
      researchConsent: consent,
    });
  }

  return <Modal title={starting ? 'Confirma los participantes' : 'Personalizar participantes'} onClose={onClose} wide>
    <form onSubmit={submit}>
      {starting ? <>
        <Field label="Nombre del equipo" help="Elijan un país distinto por mesa si juegan en la misma clase.">
          <select required value={alias} onChange={event => setAlias(event.target.value)}>
            <option value="">Selecciona un país</option>
            {Object.entries(TEAM_ALIASES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
          </select>
        </Field>
        <p className="small muted">Los sectores y las fundaciones son referencias educativas. Las emisiones, los impuestos y las decisiones corresponden a la simulación.</p>
      </> : <p className="muted">Equipo {names.team}. Puedes actualizar el nombre visible y la apariencia de cada avatar.</p>}
      {researchEnabled && starting && <label className="research-consent">
        <input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setError(''); }} />
        <span>El equipo autoriza el registro privado de su alias, códigos de estudiante, decisiones y opciones de género elegidas para los avatares. Los nombres de participantes se guardan localmente y en la exportación.</span>
      </label>}
      <div className="setup-grid">{ROLES.map(role => <fieldset key={role} className="setup-role">
        <legend><Icon role={role} size={15} />{names[role]}</legend>
        <Field label="Participante (opcional)">
          <input aria-label={`Participante de ${roleLabel(role)}`} maxLength={60} placeholder="Nombre para el avatar" value={players[role] ?? ''} onChange={event => setPlayers({ ...players, [role]: event.target.value })} />
        </Field>
        <Field label="Género del avatar (opcional)">
          <select aria-label={`Género del avatar de ${roleLabel(role)}`} value={avatarGenders[role] ?? DEFAULT_AVATAR_GENDERS[role]} onChange={event => setAvatarGenders({ ...avatarGenders, [role]: event.target.value })}>
            {Object.entries(AVATAR_GENDERS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </Field>
        {consent && <Field label="Código de estudiante (7 dígitos)">
          <input aria-label={`Código de estudiante de ${roleLabel(role)}`} required inputMode="numeric" pattern={STUDENT_CODE_PATTERN} title="Escribe exactamente siete dígitos del 0 al 9" autoComplete="off" value={studentCodes[role] ?? ''} onChange={event => setStudentCodes({ ...studentCodes, [role]: event.target.value })} />
        </Field>}
      </fieldset>)}</div>
      {error && <p role="alert" className="notice-text">{error}</p>}
      <p className="muted small">La elección describe al avatar. {consent ? 'El JSON exportado incluye los códigos y debe mantenerse privado.' : 'Los nombres y las opciones de apariencia se guardan localmente y se incluyen en el JSON.'}</p>
      <div className="modal-actions">
        <Button type="button" onClick={onClose}>Cancelar</Button>
        <Button kind="primary">{starting ? 'Comenzar partida' : 'Guardar participantes'}<ArrowRight size={16} /></Button>
      </div>
    </form>
  </Modal>;
}

function FinalScores({game}){
  const result=scores(game);
  return <div className="score-grid">{ROLES.map(r=><div className={`score-card ${result[r].victory?'won':''}`} key={r}><Icon role={r} size={23}/><span>{game.setup.names[r]}</span><strong>{n(result[r].points,1)}<small>/100</small></strong><span className="badge">{game.emissions>gameRules(game).emissionsLimit?'Derrota colectiva':result[r].victory?'Objetivo alcanzado':'Objetivo pendiente'}</span>{r==='Estado'&&!result[r].productionMet&&<small>Faltó alcanzar {n(gameRules(game).productionTarget)} t de producto.</small>}</div>)}</div>;
}
export function Results({game,compact=false,embedded=false}){
  const [year,setYear]=useState(game.history.at(-1)?.year||1);const r=game.history.find(r=>r.year===year)||game.history.at(-1);
  if(!r)return <div className="empty"><BarChart3 size={36}/><h2>Los resultados aparecen al cerrar el primer año</h2><p>La mesa conserva un registro de producción, créditos, precios e impuestos por ronda.</p></div>;
  const ended=isGameOver(game);
  if(compact)return <><div className={`result-status ${game.emissions<=gameRules(game).emissionsLimit?'':'danger'}`}><ShieldCheck size={25}/><h3>{ended?(game.emissions<=gameRules(game).emissionsLimit?'Meta ambiental alcanzada':'Meta ambiental superada'):`Año ${r.year} registrado`}</h3><p>{n(game.emissions)} de {n(gameRules(game).emissionsLimit)} tCO₂e acumuladas</p></div><p>Emisiones físicas del año: <strong>{r.emissions} tCO₂e</strong>. Reducción externa verificada: <strong>{r.reduction} tCO₂e</strong>.</p><p>Créditos usados: <strong>{r.credits}</strong>. Recaudo: <strong>{usd(r.tax)}</strong>.</p><p className="notice-text">Revisen juntos qué explicó los precios y cómo cambió cada cuenta. La sección Resultados muestra el detalle.</p></>;
  return <div className="results-page">{!embedded&&<div className="page-title"><div><span className="eyebrow">Bitácora de la economía</span><h1>{ended?'Resultados de la partida':'Resultados por año'}</h1></div><div className="year-tabs">{game.history.map(x=><button key={x.year} className={r.year===x.year?'active':''} onClick={()=>setYear(x.year)}>Año {x.year}</button>)}</div></div>}
    {ended&&<><div className={`final-banner ${game.emissions>gameRules(game).emissionsLimit?'danger':''}`}><ShieldCheck size={26}/><div><h2>{game.emissions<=gameRules(game).emissionsLimit?'La economía cumple su presupuesto climático':'Partida terminada por emisiones'}</h2><p>{game.emissions<=gameRules(game).emissionsLimit?'Cada rol se evalúa por sus propios objetivos.':`Todos pierden: ${n(game.emissions)} tCO₂e superan el tope de ${n(gameRules(game).emissionsLimit)}. La partida termina en el año ${game.history.length}; no se jugarán más rondas.`} Producción acumulada: {n(game.production)} t.</p></div></div><FinalScores game={game}/></>}
    <div className="metrics-grid"><Stat label={`Emisión física · año ${r.year}`} value={`${n(r.emissions)} tCO₂e`}/><Stat label="Reducción externa verificada" value={`${r.reduction} tCO₂e`}/><Stat label="Créditos retirados" value={r.credits}/><Stat label="Recaudo" value={usd(r.tax)}/></div>
    <section className="paper"><h2>Cuenta fiscal y cuenta física</h2><div className="account-grid"><div><span>Impuesto total</span><strong>{usd(r.tax)}</strong><code>{r.taxRate} × ({r.gross} − {r.credits})</code></div><div><span>Emisión física del año</span><strong>{r.emissions} tCO₂e</strong><code>{r.gross} + 200 − {r.reduction}</code></div></div><p className="muted">Los créditos usados reducen la base del impuesto. Las reducciones externas ya se cuentan en la cuenta física y no se restan de nuevo.</p></section>
    <section className="paper"><h2>Emisiones por rol</h2><EmissionsBreakdown game={game} result={r}/></section>
    <section className="paper"><h2>Decisiones empresariales</h2><div className="table-scroll"><table><thead><tr><th>Empresa</th><th>Producción</th><th>Emisiones</th><th>Créditos</th><th>Impuesto</th><th>Utilidad</th></tr></thead><tbody>{COMPANIES.map(e=><tr key={e}><th>{game.setup.names[e]}</th><td>{r.companies[e].production} t</td><td>{r.companies[e].emissions} tCO₂e</td><td>{r.companies[e].credits}</td><td>{usd(r.companies[e].tax)}</td><td>{usd(r.companies[e].profit)}</td></tr>)}</tbody></table></div></section>
    <section className="paper"><h2>Oferta y demanda de créditos</h2>{FOUNDATIONS.map(f=><div className="supply-row" key={f}><span>{game.setup.names[f]}{r.foundations[f].reduction>0&&<small className="credit-lot-label">{creditLotId(r.year,f)}</small>}</span><div className="supply-bar" aria-hidden="true"><i style={{width:`${r.foundations[f].reduction?r.foundations[f].sold/r.foundations[f].reduction*100:0}%`}}/></div><strong>{n(r.foundations[f].sold)} vendidos de {n(r.foundations[f].reduction)} emitidos · {n(expiredCredits(r,f))} vencidos</strong></div>)}<p className="muted small">El saldo de cada lote vence al cierre del año. La reducción verificada sí cuenta para la meta ambiental.</p><div className="table-scroll"><table><thead><tr><th>Año</th><th>Tarifa</th><th>Precio medio del crédito</th><th>Créditos vendidos</th><th>ER acumulada</th></tr></thead><tbody>{game.history.map(h=><tr key={h.year}><td>{h.year}</td><td>{usd(h.taxRate)}</td><td>{h.credits?usd(h.contracts.reduce((s,c)=>s+c.quantity*c.price,0)/h.credits):'Sin ventas'}</td><td>{h.credits}</td><td>{n(h.cumulative)} tCO₂e</td></tr>)}</tbody></table></div></section>
    <PolicyBalance game={game} result={r}/>
  </div>;
}
function Guide(){return <div className="guide-page"><div className="page-title"><div><span className="eyebrow">Guía de mesa · versión 3.2</span><h1>Cómo se juega</h1><p>Seis participantes toman decisiones durante un máximo de tres años.</p></div><BookOpen size={38}/></div><section className="paper"><h2>Quién inicia y quién continúa</h2><p>La cabina es el espacio principal de decisión. Arriba aparece un resumen breve de emisiones, producción acumulada frente a la meta de 1.350 t, impuesto y fondo; Metas del rol muestra las barras de avance del jugador en turno. Abre Menú en el encabezado para ir al inicio, a la mesa o a la guía. La partida de ejemplo te permite recorrer los tres años y revisar las cuentas de cada cierre.</p><p>Estado publica la política → empresas A, B y C confirman producción → fundaciones 1 y 2 firman proyectos → Estado confirma los convenios con aporte → el juego ejecuta los convenios firmados y valida los lotes anuales. Los convenios válidos sin aporte se aplican automáticamente.</p><p>En el mercado ambas fundaciones cotizan antes de cualquier compra. En años impares cotiza primero F1; en años pares, F2. Después las empresas A, B y C comparan ambos precios e inventarios, eligen proveedor y negocian. Los créditos de cada fundación son independientes; no hay ventas garantizadas. Las empresas A, B y C preparan borradores y confirman sus ofertas vinculantes antes de que las fundaciones elijan compradores. Las fundaciones revisan todas las ofertas dirigidas a ellas; pueden aceptar o rechazar y no están obligadas a vender. Las ofertas se aceptan completas. Al terminar las ventas, el sistema cierra automáticamente y muestra resultados. La mesa los discute y usa un solo botón para iniciar el año siguiente. La producción confirmada queda fija durante el año; los borradores se pueden retirar antes de confirmar; las ofertas confirmadas no se retiran y los contratos aceptados son definitivos. El juego abre en el inicio y vuelve allí al reiniciar la partida. El reloj permite elegir 12, 8 o 4 minutos y arranca al abrir la cabina inicial del Estado. Se pausa al mostrar resultados. Cambiar su duración lo reinicia y lo pausa; la duración elegida se conserva para los siguientes años. Al llegar a cero, el juego liquida el año y muestra los resultados. Conserva los contratos aceptados y los proyectos con las firmas requeridas. Descarta las ofertas pendientes y completa la producción sin confirmar con una opción viable.</p><p>La cofinanciación pública y el apoyo público son el mismo porcentaje. Se publica una vez; en los convenios se confirma su aplicación. Usa Detalles con el cursor, el teclado o un toque para entender cada selección.</p></section><section className="paper"><h2>El ciclo del crédito</h2><div className="credit-cycle">{['Financiar el proyecto','Ejecutar y verificar','Negociar el crédito','Pagar y retirar'].map((t,i)=><div key={t}><span>{i+1}</span><strong>{t}</strong></div>)}</div><p>Un crédito representa una tonelada de reducción externa verificada. La fundación conserva la propiedad del proyecto y este genera un lote nuevo cada año. La capacidad instalada se mantiene, pero los créditos que queden sin vender vencen al cierre. Comprar créditos no cambia las emisiones propias de la empresa.</p></section>
  {[['Preparar la mesa','Tres empresas comienzan con USD 5.000 cada una. Dos fundaciones comienzan con USD 1.000 cada una y una línea base externa de 100 tCO₂e/año. El Estado inicia con fondo cero. Los precios y costos son didácticos. No hay permisos, préstamos, reventa ni créditos guardados para el año siguiente.'],['Producción e impuesto','Cada empresa produce 100, 150, 200, 250 o 300 t de producto. Al confirmar queda fija hasta el próximo año. Se vende todo a USD 50/t. Los costos respectivos son USD 3.400, 5.000, 6.600, 8.400 y 10.400. Las intensidades son A 0,40; B 0,50 y C 0,60. El Estado publica una tarifa común entera de USD 20 a 40 por tCO₂e. En las nuevas mesas debe dejar al menos un nivel productivo viable para cada empresa con su caja actual. La empresa ve la utilidad después de impuestos antes de confirmar y no puede fijar producción con caja al cierre negativa dependiendo de compras inciertas. Los créditos pueden cubrir hasta el 50% de las emisiones. Comprarlos siempre reduce la caja al pagar; si cuestan menos que el impuesto evitado, pueden aumentar la utilidad. Las previsiones no garantizan que las fundaciones acepten las ofertas.'],['Proyectos y apoyo público','La fundación terrestre restaura bosque nativo o conserva bosque en riesgo. La acuática restaura humedales o conserva manglares. P1 cuesta USD 600 y reduce 20 tCO₂e/año. P2 cuesta USD 1.000 y reduce 40. El costo se paga una vez e incluye la operación hasta el final de la partida. Se pueden repetir hasta 100 tCO₂e/año por fundación. El Estado publica un porcentaje común entre 0 y 50% del costo; los convenios no pueden superar su fondo inicial. El Estado firma si el apoyo común cabe en el fondo, las fundaciones pueden pagar su parte y respetan su capacidad. Si no, devuelve los planes para corregirlos o renegocia el porcentaje común. Esa firma aprueba financiación; la validación del lote se hace automáticamente con la capacidad instalada. Los convenios válidos sin aporte se aplican automáticamente; con aporte se conserva la firma estatal. El 30% del impuesto recaudado se reserva para el año siguiente. El 70% va al presupuesto general.'],['Ofertas vinculantes y decisiones de venta','Ambas fundaciones cotizan primero, sin reservar ni vender créditos. Después las empresas A, B y C preparan borradores con proveedor, cantidad y precio; pueden retirarlos antes de confirmar. Las ofertas confirmadas reservan caja y capacidad de compensación de la empresa, pero el inventario del vendedor solo se descuenta al aceptar. Todas las empresas confirman antes de que las fundaciones comparen compradores. Las fundaciones eligen qué ofertas completas aceptar o rechazar; no están obligadas a vender. El pago al contado ocurre una sola vez al aceptar. La oferta confirmada no se retira y el contrato aceptado no se anula. Finalizar ventas rechaza las ofertas pendientes y libera sus reservas; no se reabre el mercado. Una fundación sin ofertas se omite automáticamente. Los controles de precio avanzan USD 0,50. La previsión separa pago, ahorro de impuesto, utilidad y caja. Las partidas importadas 2.x conservan reglas bilaterales y las 3.0 y 3.1 su recorrido original. En nuevas mesas 3.2, el sistema aplica convenios sin aporte, omite mercados sin lotes y cierra automáticamente al terminar las ventas. La cotización muestra el ingreso si se vende todo el lote al precio indicado. Los avatares identifican roles; los efectos no realizan ni repiten pagos. Puedes desactivar el movimiento.'],['Verificación y cuentas','El motor registra la ejecución de los convenios válidos y valida la capacidad instalada para generar el lote anual. Las partidas anteriores mantienen la verificación manual. El impuesto es tarifa × (emisiones propias − créditos retirados). La emisión física del equipo es emisiones empresariales + 200 − reducciones externas verificadas. Los créditos no se restan una segunda vez. Un proyecto sigue instalado aunque un lote anual no se verifique.'],['Cómo gana cada rol','Si las emisiones acumuladas superan 1.050 tCO₂e al cerrar un año, todos pierden y la partida termina inmediatamente. No se abre el año siguiente. Alcanzar exactamente 1.050 no provoca derrota. En otro caso, gana cada rol con 70/100 o más. Empresas: margen 40, cobertura 40 y solvencia 20. Cobertura positiva menor del 25% solo da 5 puntos; desde 25% da 30 y desde 40% da 40. Fundaciones: reducciones 40, ventas 30 y caja 30. Estado: ambiente 30, producción 20, financiación 20, publicación 10 y valoración 20. El Estado además debe alcanzar 1.350 t de producción.'],['Cómo se evalúa al Estado','El programa calcula cinco valoraciones al cerrar cada año; no son votos de los estudiantes. Para empresas considera transparencia, trayectoria climática acumulada ≤350×año, utilidad anual y caja no negativas. Para fundaciones considera transparencia, apoyo uniforme y reducción verificada ≥20×año. Tres criterios dan +1; dos, 0; cero o uno, −1. La valoración final estatal es 10 + suma de las veinte valoraciones / 2. El Balance de la política pública resume las evidencias en resultados y antes de la siguiente decisión estatal. Se conserva la puntuación histórica: cuando cumple clima y producción, el Estado ya reúne 80 puntos antes de la valoración. Los tonos otoñales muestran el consumo colectivo confirmado; las previsiones son provisionales y comprar créditos no vuelve verde el valle.'],['Registro para investigación','Elijan un alias de equipo al comenzar. Cada rol puede elegir un nombre visible y el género de su avatar. Si el equipo autoriza el registro, debe completar los seis códigos de estudiante. Supabase guarda de forma privada el alias, los códigos, las elecciones iniciales de avatar y las decisiones. Los nombres personales se guardan localmente. Los JSON que incluyan códigos deben mantenerse privados. El pie de página indica si el envío está pendiente o confirmado y permite detener el registro futuro.'],['Uso y limitaciones','La mesa funciona en un solo dispositivo. La cortina oculta controles al cambiar de rol, pero no es autenticación ni protege frente a alguien con acceso al navegador. La partida se guarda en este navegador: exporten un JSON al finalizar. El registro opcional en Supabase es independiente del guardado local. No hay conexión entre dispositivos ni Firebase. La verificación y las reglas fiscales son simplificaciones; no representan certificación real ni legislación. La prueba con estudiantes sigue pendiente.']].map(([title,body],i)=><details className="guide-detail" key={title} open={i===0}><summary>{title}<ChevronRight size={18}/></summary><p>{body}</p></details>)}<ScoringRules/></div>;}
function ScoringRules(){
  const rows=[
    ['Empresas','Margen acumulado','≥10%: 40 · ≥5% y <10%: 25 · positivo <5%: 10 · no positivo: 0'],
    ['Empresas','Cobertura acumulada','≥40%: 40 · ≥25% y <40%: 30 · positiva <25%: 5 · nula: 0'],
    ['Empresas','Solvencia','Caja no negativa y obligaciones liquidadas: 20; en otro caso: 0'],
    ['Fundaciones','Reducciones acumuladas','≥150 tCO₂e: 40 · ≥75 y <150: 25 · positivas <75: 10 · nulas: 0'],
    ['Fundaciones','Vendidos / emitidos','≥70%: 30 · ≥40% y <70%: 20 · positivos <40%: 10 · sin ventas o emisión: 0'],
    ['Fundaciones','Caja y contratos','Liquidados y caja ≥USD 1.000: 30 · liquidados y caja no negativa <1.000: 15 · otro caso: 0'],
    ['Estado','Resultados colectivos','Ambiente ≤1.050 tCO₂e: 30 · producción ≥1.350 t: 20'],
    ['Estado','Financiación y publicación','Respeto de límites financieros: 20 · política y criterio públicos: 10'],
    ['Estado','Valoración','10 + suma de las 15 valoraciones × 2 / 3: entre 0 y 20'],
  ];
  return <section className="paper"><h2>Umbrales de puntuación</h2><p className="muted">Se aplican al finalizar la partida. Si hay derrota anticipada, se muestran las cuentas y puntos hasta el corte; ningún rol gana. El margen divide utilidad entre ingresos; la cobertura divide créditos entre emisiones. No son promedios simples de porcentajes anuales.</p><div className="table-scroll"><table className="rules-table"><thead><tr><th>Rol</th><th>Componente</th><th>Condición y puntos</th></tr></thead><tbody>{rows.map(([role,component,rule])=><tr key={role+component}><th>{role}</th><td>{component}</td><td>{rule}</td></tr>)}</tbody></table></div></section>;
}
function Teacher({onError}){
  const [teams,setTeams]=useState([]),[busy,setBusy]=useState(false);
  async function read(files){setBusy(true);try{if(files.length>5)throw Error('Seleccione como máximo cinco partidas.');const rows=[];for(const file of files){if(file.size>2e6)throw Error('Cada JSON debe pesar menos de 2 MB.');const g=importGame(JSON.parse(await file.text()));if(!isGameOver(g))throw Error(`${g.setup.names.team}: termina la partida antes de comparar.`);rows.push(g);}setTeams(rows);}catch(e){onError(e.message);}finally{setBusy(false);}}
  return <div className="teacher-page"><div className="page-title"><div><span className="eyebrow">Después de terminar la partida</span><h1>Comparar economías</h1><p>Carga hasta cinco partidas exportadas. Los archivos se procesan en este dispositivo.</p></div><GraduationCap size={38}/></div><label className="upload-zone"><FileJson size={32}/><strong>{busy?'Leyendo partidas…':'Seleccionar partidas JSON'}</strong><span>Formatos 2.x y 3.x · partidas terminadas · hasta cinco equipos</span><input aria-label="Seleccionar partidas para comparar" type="file" accept=".json,application/json" multiple disabled={busy} onChange={e=>read([...e.target.files])}/></label>{teams.length>0&&<section className="paper"><div className="table-scroll"><table><thead><tr><th>Equipo</th><th>Emisiones</th><th>Producción</th><th>Créditos</th><th>Precio medio</th><th>Recaudo</th><th>Roles que ganan</th></tr></thead><tbody>{teams.map((g,i)=>{const cs=g.history.flatMap(r=>r.contracts),quantity=cs.reduce((s,c)=>s+c.quantity,0);return <tr key={i}><th>{g.setup.names.team}</th><td>{g.emissions} tCO₂e</td><td>{g.production} t</td><td>{quantity}</td><td>{quantity?usd(cs.reduce((s,c)=>s+c.price*c.quantity,0)/quantity):'Sin ventas'}</td><td>{usd(g.treasury.tax)}</td><td>{Object.values(scores(g)).filter(s=>s.victory).length} / 6</td></tr>;})}</tbody></table></div></section>}<section className="paper"><h2>Preguntas para la discusión</h2><ol className="discussion"><li>¿Por qué aceptaron el precio acordado y qué alternativa tenían?</li><li>¿Quién financió el proyecto y quién compró los créditos?</li><li>¿Qué cambió en la cuenta fiscal y qué cambió en las emisiones físicas?</li><li>¿Qué decisión modificarían con los datos de la partida?</li></ol><p className="muted">Los puntos del juego no son la nota académica. La rúbrica docente valora comprensión, datos y argumentación.</p></section></div>;
}
export default function App() {
  const [game,setGame]=useState(saved),[view,setView]=useState('home'),[role,setRole]=useState(null),[curtain,setCurtain]=useState(null),[modal,setModal]=useState(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[resetCount,setResetCount]=useState(0);
  const [receipt,setReceipt]=useState(null);
  const receiptSequence=useRef(0);
  const [motionMode,setMotionMode]=useState(()=>{
    try {
      const savedMode=localStorage.getItem('tension-carbono-motion');
      return ['smooth','off'].includes(savedMode) ? savedMode : 'system';
    } catch { return 'system'; }
  });
  const [systemReduced,setSystemReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setSystemReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{try{localStorage.setItem('tension-carbono-motion',motionMode);}catch{}},[motionMode]);
  const motionEnabled=motionMode==='smooth'||(motionMode==='system'&&!systemReduced);
  const [navigationOpen,setNavigationOpen]=useState(false);
  const [roundMinutes,setRoundMinutes]=useState(()=>{try{const value=Number(localStorage.getItem('tension-carbono-round-minutes'));return ROUND_DURATIONS.includes(value)?value:12;}catch{return 12;}});
  useEffect(()=>{try{localStorage.setItem('tension-carbono-round-minutes',String(roundMinutes));}catch{}},[roundMinutes]);
  const recorderRef=useRef();
  if(!recorderRef.current){const config=researchConfig();let storage;try{storage=window.localStorage;}catch{}recorderRef.current=new ResearchRecorder({storage,config,transport:createTransport(config)});}
  const recorder=recorderRef.current;
  function track(method,...args){try{return recorder[method](...args);}catch{return undefined;}}
  const [researchState,setResearchState]=useState(()=>recorder.snapshot());
  useEffect(()=>{recorder.attach(game);const unsubscribe=recorder.subscribe(setResearchState);const visibility=()=>recorder.setVisible(document.visibilityState==='visible');const online=()=>recorder.flush();document.addEventListener('visibilitychange',visibility);window.addEventListener('online',online);visibility();recorder.flush();return()=>{unsubscribe();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('online',online);recorder.dispose();};},[]);
  useEffect(()=>{if(view!=='demo')recorder.record('view_opened',{view});},[view]);
  function changeMinutes(value){setRoundMinutes(value);track('setMinutes',value);}
  const navigationToggle=useRef();
  const navigationContainer=useRef();
  function closeNavigation(){setNavigationOpen(false);navigationToggle.current?.focus();}
  useEffect(()=>{
    if (!navigationOpen) return;
    function dismiss(event) {
      if (!navigationContainer.current?.contains(event.target)) setNavigationOpen(false);
    }
    document.addEventListener('pointerdown',dismiss);
    document.addEventListener('focusin',dismiss);
    return ()=>{
      document.removeEventListener('pointerdown',dismiss);
      document.removeEventListener('focusin',dismiss);
    };
  },[navigationOpen]);
  const input=useRef();
  useEffect(()=>{if(view==='results')document.querySelector('.results-page')?.scrollIntoView({block:'start'});},[view]);
  useEffect(()=>{if(!game)return;try{localStorage.setItem(STORAGE,JSON.stringify(exportGame(game)));}catch{setNotice('El navegador no pudo guardar. Exporta la partida para conservarla.');}},[game]);
  const turn=game?currentTurn(game):null;
  const showHome=view==='home'||(!game&&view==='table');
  function choose(nextRole) {
    if(!game)return;
    if(nextRole!==turn.role){setNotice(`Ahora continúa ${roleName(game,turn.role)}. Usa el botón del turno actual.`);return;}
    setRole(null);setCurtain(nextRole);setError('');setView('table');
  }
  function openTable() {
    if (!game) setModal('new');
    else if (isGameOver(game)) setView('results');
    else if (!game.actions.length && !game.setup.tableConfigured && !researchState.active) setModal('start');
    else setView('table');
  }
  function openImport() {
    if (game) setModal('import');
    else input.current.click();
  }
  function send(actions) {
    try {
      let next=game;
      const list=Array.isArray(actions)?actions:[actions];
      for(const action of list)next=applyAction(next,action);
      track('applied',game,next,list);
      const committedReceipt=transactionReceipt(game,next,++receiptSequence.current);
      if(committedReceipt)setReceipt(committedReceipt);
      const nextTurn=currentTurn(next);
      setGame(next);setError('');
      const messages={publish:'Política publicada.',confirmProduction:'Producción confirmada.',confirmProjects:'Plan de proyectos firmado.',confirmGrants:'Convenios públicos firmados.',execute:'Proyectos ejecutados y pagados.',openMarket:'Mercado abierto.',propose:isBatchMarket(game)?'Borrador guardado. Revisa y confirma tus ofertas para enviarlas.':'Propuesta enviada.',accept:'Propuesta aceptada y pago registrado.',cancel:isBatchMarket(game)?'Oferta retirada o rechazada; no se realizó ningún pago.':'Acuerdo cancelado; se liberaron las reservas y se devolvió cualquier pago.',submitBids:'Ofertas vinculantes confirmadas.',finishSales:'Ventas finalizadas y ofertas restantes rechazadas.',finishFoundationTurn:'Cotización confirmada.',confirmCompany:'Decisiones del año confirmadas.',close:`Año ${game.draft.year} cerrado.`,next:'Nuevo año iniciado.',subsidy:'Revisión registrada. Las fundaciones deben volver a firmar.',reopenNegotiation:'Negociación reabierta.'};
      const last=list.at(-1);
      if(messages[last.type])setNotice(`${messages[last.type]} ${nextTurn.role===turn.role?'Continúa en tu cabina.':`Continúa ${roleName(next,nextTurn.role)}.`}`);
      else if(last.type==='production')setNotice('');
      else if(last.type==='verify')setNotice(`Lote de ${roleName(next,last.foundation)} ${last.verified?'verificado':'rechazado'}. Completa los dos lotes y abre el mercado.`);
      if(isGameOver(next)){setRole(null);setCurtain(null);setView('results');setNotice(next.emissions>gameRules(next).emissionsLimit?`Derrota colectiva: se superó el límite de ${n(gameRules(next).emissionsLimit)} tCO₂e. La partida terminó.`:'Partida terminada. Revisa los resultados finales.');}else if(next.history.length>game.history.length&&isStreamlined(next)){setRole(null);setCurtain(null);setView('results');setNotice(`Año ${next.history.at(-1).year} cerrado automáticamente. Revisen el balance antes de continuar.`);}else if(nextTurn.role!==turn.role){setRole(null);setCurtain(nextTurn.role);}
      return next;
    } catch(problem){for(const action of (Array.isArray(actions)?actions:[actions]))track('rejected',action);setError(problem.message);setNotice('');return null;}
  }
  function closeTimedRound() {
    if (!game || game.draft.phase === 'results' || isGameOver(game)) return;
    const next = send({ type: 'expireRound', actor: 'Docente' });
    if (!next) return;
    setModal(null);
    const result = next.emissions > gameRules(next).emissionsLimit ? ' Derrota colectiva por superar el límite de emisiones.' : '';
    setNotice(`Se acabó el tiempo. El año ${next.draft.year} se cerró automáticamente.${result}`);
  }
  function download(){try{const blob=new Blob([JSON.stringify(exportGame(game),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`tension-carbono-${game.setup.names.team.replace(/[^\p{L}\p{N}]/gu,'_')}-ano-${game.history.length}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Partida exportada. Puedes importarla para continuar o compararla.');}catch(problem){setError(problem.message);}}
  async function upload(file){if(!file)return;try{setReceipt(null);if(file.size>2e6)throw Error('El archivo debe pesar menos de 2 MB.');const next=importGame(JSON.parse(await file.text()));track('finish','restarted');track('unrecorded',next);setGame(next);setRole(null);setCurtain(isGameOver(next)?null:currentTurn(next).role);setView(isGameOver(next)?'results':'table');setError('');setNotice(isGameOver(next)&&next.emissions>gameRules(next).emissionsLimit?'Partida importada y terminada en la primera ronda que superó el límite de emisiones.':'Partida importada. La ruta indica el siguiente turno pendiente.');setResetCount(count=>count+1);}catch(problem){setError(problem.message);}finally{input.current.value='';}}
  function fresh(setup){try{setReceipt(null);const next=modal==='names'?importGame({...exportGame(game),setup}):createGame(setup);if(modal!=='names'){track('finish','restarted');if(setup.researchConsent)track('begin',next,roundMinutes);else track('unrecorded',next);}setGame(next);setModal(null);if(modal==='names'){setNotice('Participantes actualizados.');return;}setRole(null);setCurtain(currentTurn(next).role);setView('table');setError('');setNotice('Mesa preparada. El Estado inicia la ronda.');setResetCount(count=>count+1);}catch(problem){setError(problem.message);}}
  function restart(){setReceipt(null);track('finish','restarted');const next=createGame({...game.setup,tableConfigured:false,studentCodes:{}});track('unrecorded',next);setGame(next);setRole(null);setCurtain(null);setView('home');setNavigationOpen(false);setModal(null);setError('');setNotice('Partida reiniciada. Estás en el inicio; se conservaron los nombres de la mesa.');setResetCount(count=>count+1);}
  function openExample() {
    setView('demo');
    setNotice('');
    setError('');
    window.scrollTo(0,0);
  }
  const world=game||createGame();
  return <ResearchContext.Provider value={recorder}>
    <div className="app" data-climate={climateStatus(world).band} data-motion={motionEnabled?'smooth':'off'}>
      <header className="topbar">
        <div className="brand-area">
          <div className="navigation-disclosure" ref={navigationContainer} onKeyDown={event=>{
            if(event.key==='Escape'&&navigationOpen){event.stopPropagation();closeNavigation();}
          }}>
            <button ref={navigationToggle} type="button" className="navigation-toggle" aria-expanded={navigationOpen}
              aria-controls={navigationOpen?'game-navigation':undefined} onClick={()=>setNavigationOpen(!navigationOpen)}>
              <Menu size={18}/><span>Menú</span><ChevronDown size={14}/>
            </button>
            {navigationOpen&&<div className="navigation-panel">
              <GameNavigation game={game} view={view} onClose={closeNavigation}
                onNavigate={nextView=>{closeNavigation();if(nextView==='table')openTable();else setView(nextView);}}
                onNames={game?()=>{setModal('names');closeNavigation();}:undefined}
                onImport={()=>{closeNavigation();openImport();}}
                onDemo={()=>{closeNavigation();openExample();}}/>
            </div>}
          </div>
          <button className="brand" aria-label="Ir al inicio de Tensión de Carbono" onClick={()=>{setView('home');setRole(null);setCurtain(null);setError('');}}>
            <span className="brand-mark"><Leaf size={23}/></span>
            <span>Tensión de Carbono<small>Laboratorio de Economía Aplicada</small></span>
          </button>
        </div>
        <div className="top-actions">
          <label className="motion-setting">Movimiento
            <select value={motionMode} onChange={event=>setMotionMode(event.target.value)}>
              <option value="system">Según el sistema</option>
              <option value="smooth">Fluido</option>
              <option value="off">Sin animaciones</option>
            </select>
          </label>
          {game&&<><RoundTimer minutes={roundMinutes} onMinutesChange={changeMinutes}
            finished={view==='demo'||isGameOver(game)||game.draft.phase==='results'} key={`${game.draft.year}-${resetCount}`}
            onRestart={()=>setModal('restart')} onExpire={gameRules(game).timedRounds ? closeTimedRound : undefined}
            autoStart={role==='Estado'&&turn?.kind==='policy'&&view==='table'}/>
            <Button kind="quiet" onClick={download}><Download size={17}/><span className="hide-mobile">Exportar</span></Button></>}
        </div>
      </header>
    <input ref={input} className="sr-only" type="file" aria-label="Importar partida" accept=".json,application/json" onChange={event=>upload(event.target.files[0])}/>
    {(error||notice)&&<div className={`feedback ${error?'error':''}`} role={error?'alert':'status'}><AlertCircle size={17}/><span>{error||notice}</span><button aria-label="Cerrar mensaje" onClick={()=>{setError('');setNotice('');}}><X size={16}/></button></div>}
    <div className="app-layout">{showHome?<main className="welcome"><section><span className="eyebrow">Tres empresas · dos fundaciones · un Estado</span><h1>El carbono tiene un costo.<br/><em>Las decisiones son tuyas.</em></h1><p>Produce, financia proyectos y negocia créditos verificados. La mesa te indica quién decide, qué debe confirmar y quién continúa.</p>{!game&&<div className="welcome-duration"><Field label="Tiempo por año" details="Elige 12, 8 o 4 minutos. El reloj arranca al abrir la cabina inicial del Estado. Al llegar a cero, la ronda se cierra y se muestran los resultados."><select value={roundMinutes} onChange={event=>setRoundMinutes(Number(event.target.value))}>{ROUND_DURATIONS.map(value=><option key={value} value={value}>{value} minutos</option>)}</select></Field></div>}{game&&game.version!==VERSION&&<p className="notice-text">Esta mesa conserva las reglas {game.version}. Reinicia para jugar con las reglas {VERSION}; puedes exportar antes para conservar el avance.</p>}<div className="welcome-buttons">{game?<Button kind="primary" onClick={openTable}>{isGameOver(game)?'Ver resultados':game.actions.length||game.setup.tableConfigured||researchState.active?'Continuar mi partida':'Comenzar partida'}<ArrowRight size={18}/></Button>:<Button kind="primary" onClick={()=>setModal('new')}>Crear mesa<ArrowRight size={18}/></Button>}<Button onClick={openImport}><Upload size={17}/>Continuar con un JSON</Button></div><Button className="example-entry" onClick={openExample}><BookOpen size={17}/>Ver partida de ejemplo año a año<ChevronRight size={15}/></Button><div className="welcome-facts"><div><strong>6</strong><span>participantes</span></div><div><strong>{gameRules(game).rounds}</strong><span>rondas como máximo</span></div><div><strong>{n(gameRules(game).emissionsLimit)}</strong><span>tCO₂e de presupuesto</span></div></div></section><section className="welcome-valley"><div className="scene-heading"><span className="eyebrow">Tu economía en perspectiva</span></div><Suspense fallback={<div className="scene-loading">Preparando el valle…</div>}><Valley game={world} onSelect={openTable} motionEnabled={motionEnabled}/></Suspense><div className="welcome-caption"><Trees size={20}/><p>Los proyectos generan reducciones.<br/><strong>Los créditos permiten negociarlas.</strong></p></div></section></main>:<main className="main-content">
      {view==='demo'?<GuidedExample Results={Results} onExit={()=>{setView('home');window.scrollTo(0,0);}}/>:view==='guide'?<Guide/>:view==='teacher'?<Teacher onError={setError}/>:!game?<div className="empty"><p>Crea una mesa para empezar. El Estado abre cada año.</p><Button kind="primary" onClick={()=>setModal('new')}>Crear mesa</Button></div>:view==='results'?<><div className="results-controls">{!curtain&&<RoleCast game={game} activeRole={turn.role} receipt={receipt} motionEnabled={motionEnabled}/>}{isStreamlined(game)&&game.draft.phase==='results'&&!isGameOver(game)?<Button kind="primary" onClick={()=>send({type:'next',actor:'Docente'})}>Continuar al año {game.draft.year+1} con el Estado<ArrowRight size={16}/></Button>:<Button className="return-to-turn" onClick={()=>setView('table')}>Volver al turno de {roleName(game,turn.role)}<ArrowRight size={16}/></Button>}</div><Results key={game.history.length} game={game}/></>:<GuidedRound cast={!curtain&&<RoleCast game={game} activeRole={turn.role} receipt={receipt} motionEnabled={motionEnabled}/>} {...{game,role,choose,send,motionEnabled}} hide={()=>setRole(null)} onResults={()=>setView('results')}/>}
    {game&&['table','results'].includes(view)&&<TransactionReceipt receipt={receipt} motionEnabled={motionEnabled}/>}</main>}</div>
    <footer className="app-footer"><Leaf size={14}/><span>Laboratorio de Economía Aplicada · Simulación pedagógica.</span><span>Un dispositivo por mesa</span>{researchState.configured&&<button type="button" className="research-status" onClick={()=>setModal('research')}>{researchState.pending?'Registro: pendiente de envío':researchState.active||researchState.recorded&&researchState.status==='saved'?'Registro: guardado':'Registro de investigación'}</button>}</footer>
    {(modal==='new'||modal==='names'||modal==='start')&&<Setup initial={modal!=='new'?game.setup:null} starting={modal!=='names'} researchEnabled={researchState.configured} onSubmit={fresh} onClose={()=>setModal(null)}/>}
    {modal==='restart'&&<Modal title="Reiniciar la partida" onClose={()=>setModal(null)}><p>Volverás al <strong>inicio, con una nueva partida en el año 1</strong>. Se borrarán las decisiones, proyectos, contratos y resultados de esta partida. Se conservarán los nombres de la mesa y sus participantes.</p><p>Si deseas conservar el avance, expórtalo antes de reiniciar.</p><div className="modal-actions"><Button onClick={()=>setModal(null)}>Cancelar</Button><Button onClick={download}>Exportar antes de reiniciar</Button><Button kind="primary" onClick={restart}>Sí, reiniciar desde el año 1</Button></div></Modal>}
    {modal==='import'&&<Modal title="Importar otra partida" onClose={()=>setModal(null)}><p>Se sustituirá la mesa actual por las decisiones del JSON. La importación vuelve a comprobar cada acción.</p><div className="modal-actions"><Button onClick={()=>setModal(null)}>Cancelar</Button><Button onClick={download}>Exportar mesa actual</Button><Button kind="primary" onClick={()=>{setModal(null);input.current.click();}}>Seleccionar JSON</Button></div></Modal>}
    {modal==='research'&&<Modal title="Registro para investigación" onClose={()=>setModal(null)}><p>El registro privado vincula el alias de equipo, los códigos de estudiante, las elecciones iniciales de avatar y las decisiones. Las elecciones describen los avatares. Los nombres visibles se guardan localmente.</p><p>{researchState.pending?'Hay datos pendientes. La partida sigue funcionando; se volverá a intentar el envío.':researchState.active||researchState.recorded&&researchState.status==='saved'?'Las decisiones enviadas están confirmadas por el servidor.':'El registro solo se activa al comenzar una partida nueva con autorización del equipo.'}</p><div className="modal-actions">{researchState.pending&&<Button onClick={()=>recorder.flush()}>Reintentar envío</Button>}{researchState.active&&<Button onClick={()=>{recorder.withdraw();setModal(null);}}>Detener registro de esta partida</Button>}<Button onClick={()=>setModal(null)}>Cerrar</Button></div><p className="muted small">Detener el registro evita nuevos envíos; no borra los datos que ya recibió el servidor.</p></Modal>}
    {curtain&&<Modal title="Siguiente turno" onClose={()=>setCurtain(null)}><div className="privacy-curtain"><span className="lock-circle"><Icon role={curtain} size={30}/></span><span className="eyebrow">Entrega el dispositivo a</span><h2>{roleName(world,curtain)}</h2>{world.setup.players[curtain]&&<p>{world.setup.players[curtain]}</p>}<p>{currentTurn(world).title}</p><RoleCast game={world} activeRole={curtain} receipt={receipt} motionEnabled={motionEnabled}/>{receipt&&Date.now()-receipt.createdAt<5000&&<p className="handoff-receipt"><strong>Última operación:</strong> {receipt.text}</p>}<Button kind="primary full" onClick={()=>{recorder.record('cabin_opened',{},curtain);setRole(curtain);setCurtain(null);setView('table');}}>Comenzar turno de {roleName(world,curtain)}<ArrowRight size={16}/></Button><small>Las decisiones anteriores están guardadas. La cortina es visual y no autentica identidades.</small></div></Modal>}
  </div></ResearchContext.Provider>;
}
