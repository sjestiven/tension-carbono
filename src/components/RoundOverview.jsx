import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Map, X } from 'lucide-react';
import { ROLES } from '../engine.js';
import { foundationOrder, roleName } from '../workflow.js';
import { Button, Stat } from './ui.jsx';

const Valley = lazy(() => import('../Valley.jsx'));
const format = value => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);

export default function RoundOverview({ game, turn, choose, overviewRef }) {
  const [open, setOpen] = useState(false);
  const container = useRef();
  const trigger = useRef();
  const panelId = useId();
  const order = foundationOrder(game);
  const step = turn.kind === 'policy' ? 0 : turn.kind === 'production' ? 1 : turn.kind === 'projects' ? 2 : turn.kind === 'grants' ? 3 : ['execute', 'verify'].includes(turn.kind) ? 4 : ['quote', 'trade', 'reply'].includes(turn.kind) ? 5 : 6;
  const steps = ['Estado publica la política', 'A → B → C confirman su producción anual', 'Fundaciones 1 → 2 firman proyectos', 'Estado revisa y firma la cofinanciación', 'Docente ejecuta y verifica los lotes', `Cotizaciones ${order.join(' → ')}; después compran A → B → C`, 'Docente cierra y muestra resultados'];
  useEffect(() => setOpen(false), [game.draft.year, turn.kind, turn.role]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <>
    <div className="round-toolbar" ref={container}><button ref={trigger} type="button" className="route-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}><Map size={17}/>Ruta del año <span>{step + 1}/7</span></button>
      {open && <section id={panelId} className="route-popover" aria-label="Ruta del año"><div className="field-heading"><h2>Ruta del año {game.draft.year}</h2><button className="icon-btn" aria-label="Cerrar ruta del año" onClick={() => { setOpen(false); trigger.current?.focus(); }}><X size={18}/></button></div><ol className="turn-route">{steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} className={index === step ? 'active' : ''}>{label}</li>)}</ol><p>La producción confirmada queda fija. Los contratos se pueden rechazar, anular o renegociar antes del cierre.</p><Button className="full" onClick={() => { setOpen(false); trigger.current?.focus(); }}>Volver a la decisión<ArrowRight size={15}/></Button></section>}
    </div>
    <section ref={overviewRef} className="round-dashboard" aria-label="Resumen de la economía"><div className="overview-metrics"><Stat label="Emisiones acumuladas" value={`${format(game.emissions)} / 1.400`} detail="tCO₂e de años cerrados"/><Stat label="Impuesto del año" value={game.draft.published ? `USD ${format(game.draft.tax)} / t` : 'Por publicar'} detail="Tarifa común del año"/><Stat label="Fondo público" value={`USD ${format(game.treasury.fund)}`} detail="Disponible para cofinanciación"/></div><section className="overview-organizations" aria-label="Organizaciones de la mesa"><h2>Organizaciones de la mesa</h2><Suspense fallback={<p>Preparando el valle…</p>}><Valley game={game} onSelect={choose}/></Suspense><div className="organization-labels">{ROLES.map(role => <span key={role} className={role === turn.role ? 'active' : ''}>{roleName(game, role)}</span>)}</div></section></section>
  </>;
}
