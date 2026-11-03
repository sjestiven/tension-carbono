import template from './demo.json' with { type: 'json' };
import { createGame, applyAction, COMPANIES, FOUNDATIONS, isGameOver, VERSION, isBatchMarket } from './engine.js';
export const DEMO = template;
// Usa exactamente el mismo motor y validaciones que cada control de la interfaz.
export function playTemplate(rounds = template, setup, version = VERSION, onYearClosed) {
  let game = createGame(setup,version);
  const act = a => { game = applyAction(game, a); };
  for (const [index, r] of rounds.entries()) {
    if (isGameOver(game)) break;
    if (index) act({ type: 'next', actor: 'Docente' });
    const grants = Object.values(r.proyectos).flat();
    const subsidy = grants.some(p => p.aporte) ? 50 : 0;
    act({ type: 'policy', actor: 'Estado', tax: r.tarifa, subsidy });
    act({ type: 'publish', actor: 'Estado' });
    for (const e of COMPANIES) {
      act({ type: 'production', actor: e, quantity: r.produccion[e] });
      if (isBatchMarket(game)) act({type:'confirmProduction',actor:e,lock:true});
    }
    for (const f of FOUNDATIONS) for (const p of r.proyectos[f]) act({ type: 'addProject', actor: f, project: p.tipo });
    for (const f of FOUNDATIONS) act({ type: 'confirmProjects', actor: f });
    if(!game.draft.stateConfirmed)act({ type: 'confirmGrants', actor: 'Estado' });
    act({ type: 'execute', actor: 'Docente' });
    for (const f of FOUNDATIONS) act({ type: 'verify', actor: 'Docente', foundation: f, verified: r.verificado[f] });
    act({ type: 'openMarket', actor: 'Docente' });
    if (isBatchMarket(game)) {
      const order=game.draft.year%2?FOUNDATIONS:[...FOUNDATIONS].reverse();
      for (const f of order) {
        if(game.draft.phase!=='market'||game.draft.marketFinished[f])continue;
        act({type:'publishQuote',actor:f,price:r.contratos.find(c=>c.fundacion===f)?.precio ?? null});
        act({type:'finishFoundationTurn',actor:f});
      }
      for (const e of COMPANIES) {
        if(game.draft.phase!=='market'||game.draft.bidsSubmitted[e])continue;
        for (const c of r.contratos.filter(c=>c.empresa===e)) act({type:'propose',actor:e,company:e,foundation:c.fundacion,quantity:c.cantidad,price:c.precio});
        act({type:'submitBids',actor:e});
      }
      for (const f of order) {
        if (game.draft.salesFinished[f]) continue;
        for (const c of game.draft.contracts.filter(c=>c.foundation===f&&c.status==='pending')) act({type:'accept',actor:f,id:c.id});
        if(game.draft.phase==='market'&&!game.draft.salesFinished[f])act({type:'finishSales',actor:f});
      }
    } else {
    for (const c of r.contratos) {
      act({ type: 'propose', actor: c.fundacion, foundation: c.fundacion, company: c.empresa, quantity: c.cantidad, price: c.precio });
      act({ type: 'accept', actor: c.empresa, id: game.draft.contracts.at(-1).id });
    }
    for (const e of COMPANIES) act({ type: 'confirmCompany', actor: e });
    }
    if(game.draft.phase==='market')act({ type: 'close', actor: 'Docente' });
    onYearClosed?.(game);
  }
  return game;
}

export function exampleYears(setup) {
  const years = [];
  playTemplate(template, setup, VERSION, game => years.push(game));
  return years;
}
