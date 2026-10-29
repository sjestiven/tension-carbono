import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Map, Trees, X } from 'lucide-react';
import { ROLES } from '../engine.js';
import { foundationOrder, roleName } from '../workflow.js';
import { Button, Stat } from './ui.jsx';

const Valley = lazy(() => import('../Valley.jsx'));
const format = value => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);

export default function RoundOverview({ game, turn, choose, overviewRef }) {
  const [open, setOpen] = useState(null);
  const container = useRef();
  const routeTrigger = useRef();
  const organizationsTrigger = useRef();
  const panelId = useId();
  const order = foundationOrder(game);
  const step = turn.kind === 'policy' ? 0 : turn.kind === 'production' ? 1 : turn.kind === 'projects' ? 2 : turn.kind === 'grants' ? 3 : ['execute', 'verify'].includes(turn.kind) ? 4 : ['quote', 'trade', 'reply'].includes(turn.kind) ? 5 : 6;
  const steps = ['Estado publica la política', 'A → B → C confirman su producción anual', 'Fundaciones 1 → 2 firman proyectos', 'Estado revisa y firma la cofinanciación', 'Docente ejecuta y verifica los lotes', `Cotizaciones ${order.join(' → ')}; después compran A → B → C`, 'Docente cierra y muestra resultados'];
  function close() {
    (open === 'route' ? routeTrigger : organizationsTrigger).current?.focus();
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
    <div className="overview-metrics"><Stat label="Emisiones acumuladas" value={<>{format(game.emissions)} / 1.400 <small>tCO₂e</small></>}/><Stat label="Impuesto del año" value={game.draft.published ? `USD ${format(game.draft.tax)} / t` : 'Por publicar'}/><Stat label="Fondo público" value={`USD ${format(game.treasury.fund)}`}/></div>
    <div className="round-toolbar" ref={container}>
      <button ref={organizationsTrigger} type="button" className="organizations-trigger" aria-expanded={open === 'organizations'} aria-controls={`${panelId}-organizations`} onClick={() => setOpen(open === 'organizations' ? null : 'organizations')}><Trees size={16}/>Organizaciones</button>
      <button ref={routeTrigger} type="button" className="route-trigger" aria-expanded={open === 'route'} aria-controls={`${panelId}-route`} onClick={() => setOpen(open === 'route' ? null : 'route')}><Map size={16}/>Ruta del año <span>{step + 1}/7</span></button>
      {open === 'route' && <section id={`${panelId}-route`} className="route-popover" aria-label="Ruta del año"><div className="field-heading"><h2>Ruta del año {game.draft.year}</h2><button className="icon-btn" aria-label="Cerrar ruta del año" onClick={close}><X size={18}/></button></div><ol className="turn-route">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={index === step ? 'active' : ''}>{label}</li>)}</ol><p>La producción confirmada queda fija. Los contratos se pueden rechazar, anular o renegociar antes del cierre.</p><Button className="full" onClick={close}>Volver a la decisión<ArrowRight size={15}/></Button></section>}
      {open === 'organizations' && <section id={`${panelId}-organizations`} className="route-popover organizations-popover" aria-label="Organizaciones de la mesa"><div className="field-heading"><h2>Organizaciones de la mesa</h2><button className="icon-btn" aria-label="Cerrar organizaciones" onClick={close}><X size={18}/></button></div><Suspense fallback={<p>Preparando el valle…</p>}><Valley game={game} onSelect={role => { close(); choose(role); }}/></Suspense><div className="organization-labels">{ROLES.map(role => <span key={role} className={role === turn.role ? 'active' : ''}>{roleName(game, role)}</span>)}</div><p>Turno actual: <strong>{roleName(game, turn.role)}</strong>. La cabina inferior indica la decisión pendiente.</p></section>}
    </div>
  </section>;
}
