import { ROLES, FOUNDATIONS, emissionsByRole, gameRules } from '../engine.js';
import { roleName } from '../workflow.js';

const number = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

export default function EmissionsBreakdown({ game, result }) {
  const values = emissionsByRole(game, result);
  const total = result?.emissions ?? game.emissions;
  const scale = gameRules(game).emissionsLimit / (result ? gameRules(game).rounds : 1);
  return <div className="emissions-breakdown">
    <p>{result ? `Año ${result.year}` : 'Años cerrados'} · Total físico: <strong>{number.format(total)} tCO₂e</strong>.</p>
    <p className="muted small">Las barras usan la misma escala de {number.format(scale)} tCO₂e{result ? ', la referencia anual' : ', el presupuesto de la mesa'}.</p>
    {ROLES.map(role => {
      const { emissions, baseline, reductions } = values[role];
      const name = roleName(game, role);
      return <div className="emissions-role" key={role}>
        <strong>{name}</strong><span>{number.format(emissions)} tCO₂e</span>
        <meter min={0} max={scale} value={Math.min(emissions, scale)} aria-label={`Emisiones de ${name}`} aria-valuetext={`${number.format(emissions)} tCO₂e`}/>
        {FOUNDATIONS.includes(role) && <small>Línea base externa: {number.format(baseline)} · Reducción verificada: {number.format(reductions)} tCO₂e</small>}
        {role === 'Estado' && <small>Sin emisiones directas en el modelo</small>}
      </div>;
    })}
  </div>;
}
