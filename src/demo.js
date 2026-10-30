import template from './demo.json' with { type: 'json' };
import { createGame, applyAction, COMPANIES, FOUNDATIONS, isGameOver } from './engine.js';
export const DEMO = template;
// Usa exactamente el mismo motor y validaciones que cada control de la interfaz.
export function playTemplate(rounds = template, setup) {
  let game = createGame(setup);
  const act = a => { game = applyAction(game, a); };
  for (const [index, r] of rounds.entries()) {
    if (isGameOver(game)) break;
    if (index) act({ type: 'next', actor: 'Docente' });
    const grants = Object.values(r.proyectos).flat();
    const subsidy = grants.some(p => p.aporte) ? 50 : 0;
    act({ type: 'policy', actor: 'Estado', tax: r.tarifa, subsidy });
    act({ type: 'publish', actor: 'Estado' });
    for (const e of COMPANIES) act({ type: 'production', actor: e, quantity: r.produccion[e] });
    for (const f of FOUNDATIONS) for (const p of r.proyectos[f]) act({ type: 'addProject', actor: f, project: p.tipo });
    for (const f of FOUNDATIONS) act({ type: 'confirmProjects', actor: f });
    act({ type: 'confirmGrants', actor: 'Estado' });
    act({ type: 'execute', actor: 'Docente' });
    for (const f of FOUNDATIONS) act({ type: 'verify', actor: 'Docente', foundation: f, verified: r.verificado[f] });
    act({ type: 'openMarket', actor: 'Docente' });
    for (const c of r.contratos) {
      act({ type: 'propose', actor: c.fundacion, foundation: c.fundacion, company: c.empresa, quantity: c.cantidad, price: c.precio });
      act({ type: 'accept', actor: c.empresa, id: game.draft.contracts.at(-1).id });
    }
    for (const e of COMPANIES) act({ type: 'confirmCompany', actor: e });
    act({ type: 'close', actor: 'Docente' });
  }
  return game;
}
