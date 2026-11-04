import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COMPANIES, gameRules, FOUNDATIONS, PROJECTS } from '../engine.js';
import { exampleYears } from '../demo.js';
import { SCENARIO_NAMES, TEAM_ALIASES } from '../table_setup.js';
import { foundationOrder } from '../workflow.js';
import { Button, Stat } from './ui.jsx';

const number = value => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(value);
const money = value => `USD ${number(value)}`;

export default function GuidedExample({ Results, onExit }) {
  const [years] = useState(() => exampleYears({ names: { ...SCENARIO_NAMES, team: TEAM_ALIASES.colombia } }));
  const [index, setIndex] = useState(0);
  const heading = useRef(null);
  const game = years[index];
  const round = game.history.at(-1);
  const names = game.setup.names;
  const order = foundationOrder(game);
  const finalYear = index === years.length - 1;

  useEffect(() => heading.current?.focus(), [index]);

  return <div className="guided-example">
    <div className="example-header">
      <div>
        <span className="eyebrow">Partida de ejemplo · {names.team}</span>
        <h1 ref={heading} tabIndex={-1}>Año {round.year} de {years.length}</h1>
        <p>Revisa las decisiones en orden y compara su efecto al cierre de cada año.</p>
      </div>
      <Button onClick={onExit}>Salir del ejemplo</Button>
    </div>

    <ol className="example-sequence" aria-label={`Secuencia del año ${round.year}`}>
      <li>
        <h2>Estado publica la política</h2>
        <p>Fija el impuesto en {money(round.taxRate)} por tCO₂e y la cofinanciación de proyectos en {round.subsidy}%.</p>
      </li>
      <li>
        <h2>Las empresas confirman la producción</h2>
        <ul>{COMPANIES.map(role => <li key={role}>{names[role]} produce <strong>{round.companies[role].production} t</strong> y emite {round.companies[role].emissions} tCO₂e.</li>)}</ul>
      </li>
      <li>
        <h2>Las fundaciones firman y el juego emite los créditos</h2>
        <ul>{FOUNDATIONS.map(role => {
          const projects = round.projects.filter(project => project.foundation === role);
          return <li key={role}><strong>{names[role]}</strong>. {projects.length
            ? projects.map(project => PROJECTS[project.type].name).join(', ')
            : 'Sin proyectos nuevos'}. {round.foundations[role].reduction} tCO₂e de reducción verificada en el año.</li>;
        })}</ul>
      </li>
      <li>
        <h2>El mercado negocia y liquida créditos</h2>
        <p>{names[order[0]]} cotiza primero. Las empresas presentan ofertas en el orden A, B y C. Luego las fundaciones resuelven las ventas.</p>
        {round.contracts.length ? <ul>{round.contracts.map(contract => <li key={contract.id}>
          {names[contract.company]} compra {contract.quantity} créditos a {names[contract.foundation]} por {money(contract.price)} cada uno.
        </li>)}</ul> : <p>El año cierra sin compras de créditos.</p>}
      </li>
      <li>
        <h2>Balance del año {round.year}</h2>
        <div className="example-metrics">
          <Stat label="Emisiones del año" value={`${number(round.emissions)} tCO₂e`} />
          <Stat label="Presupuesto climático usado" value={`${number(round.cumulative)} / ${number(gameRules(game).emissionsLimit)} tCO₂e`} />
          <Stat label="Producción frente a la meta" value={`${number(game.production)} / ${number(gameRules(game).productionTarget)} t`} />
          <Stat label="Impuesto recaudado" value={money(round.tax)} />
          <Stat label={finalYear ? 'Fondo público al cierre' : 'Fondo público para el próximo año'} value={money(round.fund)} />
        </div>
        <p>{finalYear
          ? 'El detalle incluye los puntajes de cada rol y el resultado climático de la partida.'
          : 'El fondo y las emisiones acumuladas pasan al próximo año. Los créditos sin vender vencen y la capacidad instalada genera un lote nuevo.'}</p>
        <details key={round.year}>
          <summary>{finalYear ? 'Ver cuentas y puntajes finales' : 'Ver cuentas detalladas del año'}</summary>
          <Results game={game} embedded />
        </details>
      </li>
    </ol>
    <div className="example-controls">
      {index > 0 && <Button onClick={() => setIndex(index - 1)}><ArrowLeft size={16} /> Año anterior</Button>}
      <Button kind="primary" onClick={finalYear ? onExit : () => setIndex(index + 1)}>
        {finalYear ? 'Finalizar ejemplo' : `Continuar al año ${round.year + 1}`}<ArrowRight size={16} />
      </Button>
    </div>
  </div>;
}
