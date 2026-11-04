import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Map, Target, X } from 'lucide-react';
import { COMPANIES, FOUNDATIONS, climateStatus, isBatchMarket, gameRules, scoreProgress } from '../engine.js';
import { foundationOrder, roleName } from '../workflow.js';
import { Button, Stat } from './ui.jsx';
import EmissionsBreakdown from './emissions_breakdown.jsx';

const format = value => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);

function RoleGoals({ game, role, active }) {
  if (role === 'Docente') return <p>La mesa docente acompaña la partida y revisa los resultados colectivos.</p>;
  if (!active && role !== 'Estado') return <p>Abre la cabina de {roleName(game, role)} para consultar sus metas y su avance.</p>;
  const score = scoreProgress(game)[role];
  const { productionTarget, reductionHigh } = gameRules(game);
  const metrics = [{ label: 'Puntos para ganar', value: score.points, target: 70, unit: 'puntos' }];
  if (COMPANIES.includes(role)) {
    metrics.push(
      { label: 'Margen para la puntuación máxima', value: score.margin * 100, target: 10, unit: '%' },
      { label: 'Cobertura para la puntuación máxima', value: score.coverage * 100, target: 40, unit: '%' },
    );
  } else if (FOUNDATIONS.includes(role)) {
    metrics.push(
      { label: 'Reducción para la puntuación máxima', value: game.foundations[role].reductions, target: reductionHigh, unit: 'tCO₂e' },
      { label: 'Créditos vendidos para la puntuación máxima', value: score.fraction * 100, target: 70, unit: '%' },
      { label: 'Caja para la puntuación máxima', value: game.foundations[role].cash, target: 1000, unit: 'USD' },
    );
  } else {
    metrics.push({ label: 'Meta de producción colectiva', value: game.production, target: productionTarget, unit: 't' });
  }
  return <>
    <p><strong>{roleName(game, role)}</strong></p>
    <p className="muted small">Avance provisional. La puntuación se confirma al cerrar la partida y depende del límite colectivo de emisiones.</p>
    <div className="role-goals">{metrics.map(({ label, value, target, unit }) =>
      <div className="overview-meter" key={label}>
        <span>{label}</span>
        <strong>{format(value)} / {format(target)}{unit === '%' ? '%' : ` ${unit}`}</strong>
        <progress max={target} value={Math.max(0, Math.min(target, value))} aria-label={label} aria-valuetext={`${format(value)} de ${format(target)}${unit === '%' ? '%' : ` ${unit}`}`}/>
      </div>
    )}</div>
  </>;
}

export default function RoundOverview({ game, turn, active, overviewRef }) {
  const [open, setOpen] = useState(null);
  const container = useRef();
  const routeTrigger = useRef();
  const goalsTrigger = useRef();
  const emissionsTrigger = useRef();
  const panelId = useId();
  const order = foundationOrder(game);
  const climate=climateStatus(game);
  const { emissionsLimit, productionTarget, automaticVerification } = gameRules(game);
  const step = turn.kind === 'policy' ? 0 : turn.kind === 'production' ? 1 : turn.kind === 'projects' ? 2 : turn.kind === 'grants' ? 3 : ['execute', 'verify'].includes(turn.kind) ? 4 : ['quote', 'trade', 'reply','bids','sales'].includes(turn.kind) ? 5 : 6;
  const steps = ['Estado publica la política', 'A → B → C confirman su producción anual', 'Fundaciones 1 → 2 firman proyectos', 'Estado revisa y firma la cofinanciación', automaticVerification ? 'El juego ejecuta y valida los lotes' : 'Docente ejecuta y verifica los lotes', isBatchMarket(game)?`Cotizaciones; ofertas A → B → C; ventas ${order.join(' → ')}`:`Cotizaciones ${order.join(' → ')}; después compran A → B → C`, isBatchMarket(game) ? 'Cierre y resultados del año' : 'Docente cierra y muestra resultados'];
  function close() {
    (open === 'route' ? routeTrigger : open === 'emissions' ? emissionsTrigger : goalsTrigger).current?.focus();
    setOpen(null);
  }
  useEffect(() => setOpen(null), [game.draft.year, turn.kind, turn.role]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(null); };
    const escape = event => { if (event.key === 'Escape') close(); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('click', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('click', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <section ref={overviewRef} className="round-dashboard" aria-label="Resumen de la economía">
    <div className="overview-metrics">
      <div className="overview-meter"><span>Emisiones acumuladas</span><strong>{format(game.emissions)} / {format(emissionsLimit)} <small>tCO₂e</small></strong><progress max={emissionsLimit} value={Math.min(emissionsLimit,game.emissions)} aria-label="Presupuesto climático consumido"/><small>{climate.band==='defeat'?'Presupuesto superado':`Restan ${format(climate.remaining)} tCO₂e`}</small></div>
      <div className="overview-meter production-meter"><span>Producción acumulada</span><strong>{format(game.production)} / {format(productionTarget)} <small>t</small></strong><progress max={productionTarget} value={Math.min(productionTarget,game.production)} aria-label="Avance hacia la meta de producción"/><small>{game.production>=productionTarget?'Meta alcanzada':`Faltan ${format(productionTarget-game.production)} t`}</small></div>
      <Stat label="Impuesto del año" value={game.draft.published ? `USD ${format(game.draft.tax)} / t` : 'Por publicar'}/><Stat label="Fondo público" value={`USD ${format(game.treasury.fund)}`}/>
    </div>
    <div className="round-toolbar" ref={container}>
      <button ref={goalsTrigger} type="button" className="organizations-trigger" aria-expanded={open === 'goals'} aria-controls={`${panelId}-goals`} onClick={() => setOpen(open === 'goals' ? null : 'goals')}><Target size={16}/>Metas del rol</button>
      <button ref={emissionsTrigger} type="button" className="organizations-trigger" aria-expanded={open === 'emissions'} aria-controls={`${panelId}-emissions`} onClick={() => setOpen(open === 'emissions' ? null : 'emissions')}>Emisiones por rol</button>
      <button ref={routeTrigger} type="button" className="route-trigger" aria-expanded={open === 'route'} aria-controls={`${panelId}-route`} onClick={() => setOpen(open === 'route' ? null : 'route')}><Map size={16}/>Ruta del año <span>{step + 1}/7</span></button>
      {open === 'emissions' && <section id={`${panelId}-emissions`} className="route-popover" aria-label="Emisiones por rol"><div className="field-heading"><h2>Emisiones por rol</h2><button className="icon-btn" aria-label="Cerrar emisiones por rol" onClick={close}><X size={18}/></button></div><EmissionsBreakdown game={game}/></section>}
      {open === 'route' && <section id={`${panelId}-route`} className="route-popover" aria-label="Ruta del año"><div className="field-heading"><h2>Ruta del año {game.draft.year}</h2><button className="icon-btn" aria-label="Cerrar ruta del año" onClick={close}><X size={18}/></button></div><ol className="turn-route">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={index === step ? 'active' : ''}>{label}</li>)}</ol><p>{isBatchMarket(game)?'La producción confirmada queda fija. Revisa borradores antes de confirmar: las ofertas son vinculantes y los contratos aceptados no se anulan.':'La producción confirmada queda fija. Los contratos se pueden rechazar, anular o renegociar antes del cierre.'}</p><Button className="full" onClick={close}>Volver a la decisión<ArrowRight size={15}/></Button></section>}
      {open === 'goals' && <section id={`${panelId}-goals`} className="route-popover" aria-label="Metas del rol"><div className="field-heading"><h2>Metas del rol</h2><button className="icon-btn" aria-label="Cerrar metas del rol" onClick={close}><X size={18}/></button></div><RoleGoals game={game} role={turn.role} active={active}/></section>}
    </div>
    {game.draft.phase!=='results'&&Object.values(game.draft.productionLocked).every(Boolean)&&<div className="climate-budget">Previsión de emisiones al cerrar: {format(climate.projected)} / {format(emissionsLimit)} tCO₂e · provisional</div>}
  </section>;
}
