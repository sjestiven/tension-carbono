import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Factory, GraduationCap, Landmark, LockKeyhole, ShieldCheck, Trees, X } from 'lucide-react';
import { COMPANIES, FOUNDATIONS, INTENSITY, PROJECTS, PRODUCTION, available, companyView, lot, previewRound, projectDetails, remaining } from '../engine.js';
import { closingIssues, currentTurn, foundationOrder, projectIssues, projectOptionIssue, roleName } from '../workflow.js';
import { Button, Field, Help, Stat } from './ui.jsx';

import RoundOverview from './RoundOverview.jsx';
const number = value => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);
const money = value => `USD ${number(value)}`;
export const GUIDE_ORDER = 'Estado → Empresa A → Empresa B → Empresa C → Fundación 1 → Fundación 2 → Estado → Mesa docente';

function RoleIcon({ role, ...props }) {
  const Icon = role === 'Docente' ? GraduationCap : role === 'Estado' ? Landmark : COMPANIES.includes(role) ? Factory : Trees;
  return <Icon {...props}/>;
}

function Issues({ issues }) {
  if (!issues.length) return null;
  return <div className="decision-issues" role="status"><strong>Antes de continuar</strong><ul>{issues.map((issue, index) => <li key={index}>{issue.message || issue}</li>)}</ul></div>;
}

function Continue({ game, turn, children, ...props }) {
  return <Button kind="primary full" {...props}>{children || `Guardar y continuar con ${roleName(game, turn.next)}`}<ArrowRight size={17}/></Button>;
}

function Production({ game, role, send }) {
  const view = companyView(game, role);
  return <><div className="field-heading"><h3>Nivel de producción</h3><Help label="Nivel de producción">Toneladas de producto que venderás este año. Al aumentar la producción cambian ingresos, costos y emisiones. Elegir un nivel prepara la decisión. Al confirmar no podrás cambiarla durante ese año, ni siquiera al reabrir los contratos.</Help></div>
    <div className="production-options">{Object.entries(PRODUCTION).map(([quantity, option]) => <button type="button" key={quantity} disabled={view.credits > Math.floor(+quantity * INTENSITY[role] * .5)} aria-pressed={view.production === +quantity} className={view.production === +quantity ? 'selected' : ''} onClick={() => send({ type: 'production', actor: role, quantity: +quantity })}><strong>{quantity} t</strong><small>{option.label}</small></button>)}</div>
    {view.credits > Math.floor(100 * INTENSITY[role] * .5) && <p className="muted small">Los niveles deshabilitados dejarían tus créditos por encima del 50 % permitido. Anula los contratos correspondientes si necesitas bajar a esos niveles.</p>}
    <p className="selection-status" role="status"><Check size={15}/>Selección actual: {view.production} t. Al confirmar queda fija hasta el próximo año.</p>
    <div className="mini-grid"><Stat label="Ingresos previstos" value={money(view.income)}/><Stat label="Costo de producción" value={money(view.cost)}/><Stat label="Emisiones propias" value={`${number(view.emissions)} tCO₂e`}/><Stat label="Máximo de créditos" value={Math.floor(view.emissions * .5)}/></div>
  </>;
}

function Policy({ game, turn, send }) {
  const [tax, setTax] = useState(game.draft.tax);
  const [subsidy, setSubsidy] = useState(game.treasury.fund > 0 ? game.draft.subsidy : 0);
  return <form onSubmit={event => { event.preventDefault(); send([{ type: 'policy', actor: 'Estado', tax: +tax, subsidy: +subsidy }, { type: 'publish', actor: 'Estado' }]); }}>
    <p>Define la política del año. Al publicarla se guarda y continúa la Empresa A.</p>
    <Field label="Impuesto por tCO₂e" help="Tarifa entera entre USD 20 y 40." details="Es el valor del impuesto por cada tonelada de emisiones que la empresa no compensa con créditos. La misma tarifa se aplica a las tres empresas y queda fija durante el año."><input type="number" required min={20} max={40} step={1} value={tax} onChange={event => setTax(event.target.value)}/></Field>
    <Field label="Cofinanciación pública (%)" details="Es la parte del costo de cada proyecto nuevo que paga el Estado. Cofinanciación y apoyo público significan lo mismo. Por ejemplo, un 50 % en un proyecto de USD 600 equivale a USD 300 públicos y USD 300 de la fundación. Se aplica por igual a ambas fundaciones y solo utiliza el fondo disponible."><input type="number" required min={0} max={50} step={1} disabled={!game.treasury.fund} value={subsidy} onChange={event => setSubsidy(event.target.value)}/></Field>
    <p className="notice-text">Fondo disponible: <strong>{money(game.treasury.fund)}</strong>. {!game.treasury.fund ? 'Sin fondo, la cofinanciación es 0 % este año. Las fundaciones comienzan con recursos propios.' : 'El porcentaje se define una sola vez. Después firmarás los convenios correspondientes.'}</p>
    <Continue game={game} turn={turn}>Publicar política y continuar con {roleName(game, 'A')}</Continue>
  </form>;
}

function Projects({ game, turn, send }) {
  const detail = projectDetails(game).find(item => item.foundation === turn.role);
  const issues = projectIssues(game).filter(issue => issue.role === turn.role);
  return <><p>Elige los proyectos que financiarás. Puedes continuar sin nuevas inversiones. La firma registra tu decisión y pasa el turno.</p>
    <div className="mini-grid"><Stat label="Caja disponible" value={money(game.foundations[turn.role].cash)}/><Stat label="Cofinanciación publicada" value={`${game.draft.subsidy} %`}/></div>
    {Object.entries(PROJECTS).map(([type, project]) => {
      const reason = projectOptionIssue(game, turn.role, type);
      return <div className="guided-project" key={type}><div className="field-heading"><h3>{type} · {project.name}</h3><Help label={project.name}>Se paga una vez y reduce {project.reduction} tCO₂e cada año que su lote sea verificado, desde este año hasta el cuarto. La fundación conserva el proyecto; sus créditos se venden después de verificar.</Help></div><p>{money(project.cost)} · +{project.reduction} tCO₂e/año</p><Button className="full" disabled={Boolean(reason)} onClick={() => send({ type: 'addProject', actor: turn.role, project: type })}>Agregar {type}</Button>{reason && <small className="option-reason">{reason}</small>}</div>;
    })}
    <h3>Tu plan de este año</h3>{!detail.projects.length && <p className="muted">Sin proyectos nuevos seleccionados.</p>}
    {detail.projects.map(project => <div className="project-row" key={project.id}><span>{project.type} · {project.name}</span><Button kind="quiet" onClick={() => send({ type: 'removeProject', actor: turn.role, id: project.id })}>Retirar</Button></div>)}
    <dl className="ledger"><div><dt>Costo total</dt><dd>{money(detail.cost)}</dd></div><div><dt>Parte pública ({game.draft.subsidy} %)</dt><dd>{money(detail.grant)}</dd></div><div><dt>Tu caja después de ejecutar</dt><dd>{money(detail.cashAfter)}</dd></div><div><dt>Capacidad resultante</dt><dd>{detail.capacity} tCO₂e/año</dd></div></dl>
    <Issues issues={issues}/><Continue game={game} turn={turn} disabled={Boolean(issues.length)} onClick={() => send({ type: 'confirmProjects', actor: turn.role })}>Firmar plan y continuar con {roleName(game, turn.next)}</Continue>
  </>;
}

function Grants({ game, turn, send }) {
  const [editing, setEditing] = useState(false);
  const [rate, setRate] = useState(game.draft.subsidy);
  const issues = projectIssues(game);
  return <><p>Revisas <strong>la financiación pública</strong>, no certificas las reducciones. Aprueba los convenios si aplican el porcentaje común, caben en el fondo y las fundaciones pueden pagar su parte. Si algo no cumple, devuélvelo para corregirlo.</p><p>En el primer año, con fondo cero, la firma registra que no hay aporte estatal. La verificación de los lotes corresponde después al docente.</p>
    <div className="published-rate"><span>Cofinanciación pública publicada</span><strong>{game.draft.subsidy} %</strong><Help label="Firma de los convenios">La firma confirma los proyectos, sus costos y los aportes calculados con el porcentaje ya publicado. No cambia el porcentaje ni entrega créditos al Estado.</Help></div>
    {projectDetails(game).map(detail => <div className="agreement" key={detail.foundation}><strong>{roleName(game, detail.foundation)} · plan firmado</strong><span>{detail.projects.length} proyectos · aporte público {money(detail.grant)}</span></div>)}
    <p>Fondo disponible: <strong>{money(game.treasury.fund)}</strong>.</p><Issues issues={issues}/>
    <Continue game={game} turn={turn} disabled={Boolean(issues.length)} onClick={() => send({ type: 'confirmGrants', actor: 'Estado' })}>Firmar convenios y continuar con la mesa docente</Continue>
    <details className="correction-options"><summary>Necesitamos revisar un acuerdo</summary><p>Una revisión devuelve los planes a las fundaciones para que los confirmen de nuevo. La tarifa del impuesto permanece fija.</p><Button onClick={() => send({ type: 'subsidy', actor: 'Estado', subsidy: game.draft.subsidy })}>Devolver planes a las fundaciones</Button><Button kind="quiet" onClick={() => setEditing(!editing)}>Renegociar la cofinanciación</Button>
      {editing && <form onSubmit={event => { event.preventDefault(); send({ type: 'subsidy', actor: 'Estado', subsidy: +rate }); }}><Field label="Nueva cofinanciación pública (%)" details="Reemplaza el porcentaje común publicado. Ambas fundaciones deberán volver a firmar sus planes."><input type="number" min={0} max={50} required step={1} value={rate} onChange={event => setRate(event.target.value)}/></Field><Button>Aplicar y solicitar nuevas firmas</Button></form>}
    </details>
  </>;
}

function Execute({ game, send }) {
  const issues = projectIssues(game, { signatures: true });
  return <><p>Las decisiones privadas están confirmadas. Ejecutar paga los proyectos y los aportes públicos; después verificarás cada lote.</p><div className="check-list">{FOUNDATIONS.map(role => <div key={role}><Check size={16}/>{roleName(game, role)}: plan firmado</div>)}<div><Check size={16}/>Estado: convenios firmados</div></div><Issues issues={issues}/><Button kind="primary full" disabled={Boolean(issues.length)} onClick={() => send({ type: 'execute', actor: 'Docente' })}>Ejecutar proyectos y pasar a verificación<ArrowRight size={17}/></Button></>;
}

function Verify({ game, send }) {
  const missing = FOUNDATIONS.filter(role => game.draft.verified[role] === null);
  return <><p>Verifica o rechaza expresamente los dos lotes. El botón de continuar se habilita cuando termines.</p>{FOUNDATIONS.map(role => <div className="verification-card" key={role}><strong>{roleName(game, role)}</strong><span>Capacidad instalada: {game.foundations[role].capacity} tCO₂e/año</span><Help label={`Verificación de ${roleName(game, role)}`}>Comprueba ejecución, financiación y capacidad. Verificar reconoce el lote de este año; rechazarlo impide venderlo y no reconoce su reducción anual. El proyecto instalado permanece.</Help><div className="button-row"><Button aria-pressed={game.draft.verified[role] === true} className={game.draft.verified[role] === true ? 'chosen' : ''} onClick={() => send({ type: 'verify', actor: 'Docente', foundation: role, verified: true })}>Verificar {role}</Button><Button aria-pressed={game.draft.verified[role] === false} className={game.draft.verified[role] === false ? 'chosen-danger' : ''} onClick={() => send({ type: 'verify', actor: 'Docente', foundation: role, verified: false })}>Rechazar {role}</Button></div><small>{game.draft.verified[role] === null ? 'Pendiente de decisión' : game.draft.verified[role] ? 'Lote verificado' : 'Lote rechazado'}</small></div>)}
    <Issues issues={missing.map(role => `Falta verificar o rechazar el lote de ${roleName(game, role)}.`)}/><Button kind="primary full" disabled={Boolean(missing.length)} onClick={() => send({ type: 'openMarket', actor: 'Docente' })}>Abrir mercado y continuar con {roleName(game, foundationOrder(game)[0])}<ArrowRight size={17}/></Button>
  </>;
}

function Quotes({ game, turn, send }) {
  const [price,setPrice]=useState(game.draft.quotes[turn.role]?.price ?? 18);
  const stock=available(game,turn.role);
  return <><p>Presenta tu precio por crédito. <strong>Las dos fundaciones cotizan antes de que comience cualquier compra.</strong> Las empresas compararán ambas opciones; cotizar no reserva ni vende créditos.</p><div className="mini-grid"><Stat label="Tu lote verificado" value={lot(game,turn.role)}/><Stat label="Tus créditos disponibles" value={stock}/></div>
    {stock>0?<form onSubmit={event=>{event.preventDefault();send([{type:'publishQuote',actor:turn.role,price:+price},{type:'finishFoundationTurn',actor:turn.role}]);}}><Field label="Precio unitario USD" details="Precio indicativo de tu fundación por cada crédito. Las flechas avanzan USD 0,50. Después de ambas cotizaciones, cada comprador elige vendedor, cantidad y precio; la fundación acepta o rechaza el contrato."><input type="number" required min={0} max={10000} step="0.5" value={price} onChange={event=>setPrice(event.target.value)}/></Field><Continue game={game} turn={turn}>Publicar cotización y continuar con {roleName(game,turn.next)}</Continue></form>:<p className="notice-text">No tienes créditos verificados disponibles. Puedes continuar sin cotizar.</p>}
    <Button className="full" onClick={()=>send([{type:'publishQuote',actor:turn.role,price:null},{type:'finishFoundationTurn',actor:turn.role}])}>Continuar sin cotización con {roleName(game,turn.next)}</Button>
    <AcceptedContracts game={game} role={turn.role} send={send}/>
    <p className="muted small">Tu inventario pertenece solo a {roleName(game,turn.role)}. No se comparte con la otra fundación. Las cotizaciones se revelan juntas al terminar ambos turnos.</p>
  </>;
}

function QuoteComparison({game}) {
  return <section className="quote-comparison" aria-label="Comparar fundaciones"><h3>Compara las dos fundaciones</h3><p>Inventarios independientes. Las cotizaciones no reservan capacidad de compra; un contrato bilateral sí la reserva.</p><div className="quote-grid">{foundationOrder(game).map(foundation=><article className="quote-card" key={foundation}><h4>{roleName(game,foundation)}</h4><strong>{game.draft.quotes[foundation]?`${money(game.draft.quotes[foundation].price)} / crédito`:'Sin cotización publicada'}</strong><dl><div><dt>Lote verificado</dt><dd>{lot(game,foundation)}</dd></div><div><dt>Disponible</dt><dd>{available(game,foundation)}</dd></div></dl></article>)}</div></section>;
}

function TradeForm({ game, role, send }) {
  const [other,setOther]=useState('');
  const [quantity,setQuantity]=useState(1);
  const [price,setPrice]=useState(18);
  const maximum=other?Math.max(0,Math.min(available(game,other),remaining(game,role))):0;
  return <form className="trade-form" onSubmit={event=>{event.preventDefault();send({type:'propose',actor:role,company:role,foundation:other,quantity:+quantity,price:+price});}}>
    <h3>Proponer una compra</h3>
    <Field label="Fundación vendedora" details="Elige después de comparar ambas cotizaciones. Ninguna fundación está preseleccionada. La vendedora recibirá el contrato para aceptarlo o rechazarlo; después retomarás tu turno."><select required value={other} onChange={event=>{setOther(event.target.value);setPrice(game.draft.quotes[event.target.value]?.price ?? 18);}}><option value="">Selecciona una fundación</option>{foundationOrder(game).map(foundation=><option key={foundation} value={foundation}>{roleName(game,foundation)}</option>)}</select></Field>
    <div className="form-two"><Field label="Cantidad de créditos" details="Cada crédito representa una tCO₂e verificada. Solo puedes reservar el inventario de la fundación elegida y hasta el 50 % de tus emisiones confirmadas."><input type="number" required min={1} max={Math.max(1,maximum)} step={1} value={quantity} onChange={event=>setQuantity(event.target.value)}/></Field><Field label="Precio unitario USD" details="El valor puede negociarse a partir de la cotización. Las flechas avanzan USD 0,50 y el pago se realiza al aceptar el contrato."><input type="number" required min={0} max={10000} step="0.5" value={price} onChange={event=>setPrice(event.target.value)}/></Field></div>
    <div className="trade-total"><span>Valor total</span><strong>{money((+quantity||0)*(+price||0))}</strong></div><p className="muted">{other?`Disponibles para este acuerdo: ${maximum}.`:'Compara las dos ofertas y elige una fundación.'}</p>
    <Button className="full" kind="secondary" disabled={!other||!maximum}>Enviar propuesta a {other?roleName(game,other):'la fundación'}<ArrowRight size={16}/></Button>
  </form>;
}

function Reply({ game, turn, send }) {
  const contract = turn.contract;
  const total = Math.round(contract.quantity * contract.price * 100) / 100;
  const view = companyView(game, contract.company);
  const cannotPay = game.companies[contract.company].cash < total || view.closingCash < total;
  return <><p><strong>{roleName(game, contract.proposer)}</strong> te propone este acuerdo. Respóndelo para retomar el turno de {roleName(game, turn.next)}.</p><dl className="ledger"><div><dt>Comprador</dt><dd>{roleName(game, contract.company)}</dd></div><div><dt>Vendedor</dt><dd>{roleName(game, contract.foundation)}</dd></div><div><dt>Cantidad</dt><dd>{contract.quantity} créditos</dd></div><div><dt>Precio por crédito</dt><dd>{money(contract.price)}</dd></div><div><dt>Pago total</dt><dd>{money(total)}</dd></div></dl><p className="muted">Aceptar transfiere el pago al contado. Rechazar libera la cantidad reservada.</p>{cannotPay && <Issues issues={['El comprador no puede cubrir este pago sin quedar con caja negativa. Rechaza la propuesta y renegocien cantidad o precio.']}/>}
    <Button kind="primary full" disabled={cannotPay} onClick={() => send({ type: 'accept', actor: turn.role, id: contract.id })}>Aceptar y volver al turno de {roleName(game, turn.next)}<Check size={17}/></Button><Button className="full" onClick={() => send({ type: 'cancel', actor: turn.role, id: contract.id })}>Rechazar y volver<X size={17}/></Button>
  </>;
}

function AcceptedContracts({game,role,send}) {
  const contracts=game.draft.contracts.filter(contract=>(contract.company===role||contract.foundation===role)&&contract.status==='accepted');
  if(!contracts.length)return null;
  return <section className="contracts"><h3>Acuerdos aceptados</h3>{contracts.map(contract=><div className="contract" key={contract.id}><strong>{contract.quantity} créditos · {money(contract.price)} c/u</strong><p>{roleName(game,contract.company===role?contract.foundation:contract.company)} · pago {money(contract.quantity*contract.price)}</p><Button onClick={()=>send({type:'cancel',actor:role,id:contract.id})}>Anular y devolver el pago</Button></div>)}</section>;
}

function Trading({ game, turn, send }) {
  const view=companyView(game,turn.role);
  return <><section className="committed-production" aria-label="Producción confirmada"><LockKeyhole size={18}/><div><strong>Producción confirmada: {view.production} t</strong><p>Fija durante este año. Puedes negociar y anular contratos, pero no cambiar la producción.</p></div></section><div className="mini-grid"><Stat label="Créditos comprados" value={view.credits}/><Stat label="Utilidad prevista" value={money(view.profit)}/><Stat label="Impuesto previsto" value={money(view.tax)}/><Stat label="Caja al cierre" value={money(view.closingCash)}/></div>
    <QuoteComparison game={game}/><TradeForm game={game} role={turn.role} send={send}/>
    <AcceptedContracts game={game} role={turn.role} send={send}/>
    {view.closingCash<0&&<Issues issues={['La caja prevista es negativa. Renegocia o anula contratos; la producción ya está confirmada.']}/>}
    <Continue game={game} turn={turn} disabled={view.closingCash<0} onClick={()=>send({type:'confirmCompany',actor:turn.role})}>Confirmar contratos y continuar con {roleName(game,turn.next)}</Continue>
  </>;
}

function Close({ game, send }) {
  const issues = closingIssues(game);
  const result = previewRound(game);
  return <><p>Las tres empresas confirmaron sus decisiones. Revisa el resumen y cierra el año para liquidar producción, impuestos y créditos.</p><div className="mini-grid"><Stat label="Emisión física anual" value={`${number(result.emissions)} tCO₂e`}/><Stat label="Recaudo anual" value={money(result.tax)}/></div><Issues issues={issues}/><Button kind="primary full" disabled={Boolean(issues.length)} onClick={() => send({ type: 'close', actor: 'Docente' })}>Cerrar año {game.draft.year} y ver resultados<ShieldCheck size={17}/></Button><details className="correction-options"><summary>Hace falta renegociar antes del cierre</summary><p>Reabre las cotizaciones y los contratos. Los acuerdos se conservan hasta que una parte los anule; las empresas vuelven a confirmar. La producción permanece fija.</p><Button onClick={() => send({ type: 'reopenNegotiation', actor: 'Docente' })}>Reabrir negociación</Button></details></>;
}

export default function GuidedRound({ game, role, choose, send, hide, onResults }) {
  const turn = currentTurn(game);
  const d = game.draft;
  const active = role === turn.role;
  const overview = useRef();
  useEffect(() => {
    if (active) overview.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [active, turn.role, turn.kind, turn.contract?.id]);
  const nextLabel = turn.next ? roleName(game, turn.next) : 'Partida finalizada';
  return <>
    <RoundOverview {...{game,turn,choose,overviewRef:overview}}/>
    <section className="turn-banner" aria-label="Turno actual"><div><span className="eyebrow">{turn.kind === 'finished' ? 'Partida finalizada' : `Año ${d.year} de 4 · turno actual`}</span><h1><RoleIcon role={turn.role} size={25}/>{roleName(game, turn.role)}</h1><p>{turn.title}. {turn.next && <span>Después continúa: <strong>{nextLabel}</strong>.</span>}</p></div>{!active && <Button kind="primary" onClick={() => choose(turn.role)}>Continuar con {roleName(game, turn.role)}<ArrowRight size={18}/></Button>}</section>
    <div className="guided-layout"><section className="private-panel guided-panel" aria-label="Cabina del participante"><div className="panel-title"><div><span className="eyebrow">{active ? turn.kind === 'reply' ? 'Respuesta de la contraparte' : 'Decisión del turno' : 'Siguiente paso'}</span><h2>{turn.title}</h2></div>{active && <button className="icon-btn" aria-label="Ocultar cabina y pasar" onClick={hide}><LockKeyhole size={19}/></button>}</div>
      {!active ? <div className="guided-locked"><RoleIcon role={turn.role} size={32}/><h3>Es el turno de {roleName(game, turn.role)}</h3><p>Usa «Continuar con {roleName(game, turn.role)}» en el encabezado. Registra la decisión y confirma para pasar al siguiente participante.</p></div> : <div className="panel-body" key={`${d.year}-${turn.kind}-${turn.role}-${turn.contract?.id || ''}`}>
        {turn.kind === 'policy' ? <Policy {...{game, turn, send}}/> : turn.kind === 'production' ? <><Production game={game} role={turn.role} send={send}/><p>Revisa la selección antes de confirmar: será tu producción definitiva de este año. Los contratos sí podrán renegociarse.</p><Continue game={game} turn={turn} onClick={() => send({ type: 'confirmProduction', actor: turn.role, lock: true })}>Confirmar {d.production[turn.role]} t y continuar con {nextLabel}</Continue></> : turn.kind === 'projects' ? <Projects {...{game, turn, send}}/> : turn.kind === 'grants' ? <Grants {...{game, turn, send}}/> : turn.kind === 'execute' ? <Execute {...{game, send}}/> : turn.kind === 'verify' ? <Verify {...{game, send}}/> : turn.kind === 'reply' ? <Reply {...{game, turn, send}}/> : turn.kind === 'quote' ? <Quotes {...{game, turn, send}}/> : turn.kind === 'trade' ? <Trading {...{game, turn, send}}/> : turn.kind === 'close' ? <Close {...{game, send}}/> : <><p>Año {d.year} cerrado. Emisiones acumuladas: <strong>{number(game.emissions)} de 1.400 tCO₂e</strong>. Revisa las cuentas antes de continuar.</p><Button kind="primary" className="full" onClick={onResults}>{turn.kind==='finished'?'Ver resultados finales':'Ver resultados del año'}</Button>{turn.kind === 'next' && <Button kind="primary full" onClick={() => send({ type: 'next', actor: 'Docente' })}>Empezar año {d.year + 1} y continuar con el Estado<ArrowRight size={17}/></Button>}{turn.kind === 'finished' && <p>La partida terminó. La sección Resultados muestra el desenlace y los puntos acumulados de los seis roles.</p>}</>}
      </div>}
    </section></div>
  </>;
}
