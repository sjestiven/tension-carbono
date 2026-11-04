import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import { playTemplate, DEMO } from '../src/demo.js';
import {createGame,applyAction} from '../src/engine.js';

test('The completed-game results render all roles and both foundation inventories', async () => {
  const server = await createServer({
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { Results } = await server.ssrLoadModule('/src/App.jsx');
    const html = renderToString(React.createElement(Results, { game: playTemplate() }));
    assert.match(html, /Resultados de la partida/);
    for (const name of ['Estado', 'Empresa A', 'Empresa B', 'Empresa C', 'Fundación Bosque', 'Fundación Horizonte']) assert.ok(html.includes(name), name);
    assert.match(html, /Oferta y demanda de créditos/);
    assert.match(html, /Emisiones por rol/);
    const rounds=structuredClone(DEMO);
    for (const round of rounds) round.produccion={A:300,B:300,C:300};
    const losingHtml=renderToString(React.createElement(Results,{game:playTemplate(rounds)}));
    assert.match(losingHtml,/Partida terminada por emisiones/);
    assert.match(losingHtml,/La partida termina en el año 2/);
    assert.match(losingHtml,/1.140/);
    assert.equal((losingHtml.match(/Derrota colectiva/g)||[]).length,6);
    const {default:GuidedRound}=await server.ssrLoadModule('/src/components/GuidedRound.jsx');
    let verification=createGame({},'3.1.0');
    for(const action of playTemplate(undefined,undefined,verification.version).actions.filter(action=>action.origin!=='system')){verification=applyAction(verification,action);if(action.type==='execute')break;}
    const review=renderToString(React.createElement(GuidedRound,{game:verification,role:'Docente',choose:()=>{},send:()=>{},hide:()=>{},onResults:()=>{}})).replace(/<[^>]*>/g,'');
    assert.equal((review.match(/Capacidad instalada: 20 tCO₂e\/año/g)||[]).length,2);
    assert.ok(!review.includes('Capacidad instalada: 40'));
    assert.match(review,/Confirmar ejecución y verificaciones/);
    let market = createGame();
    for (const action of playTemplate().actions.filter(action => action.origin !== 'system')) {
      market = applyAction(market, action);
      if (action.type === 'confirmProjects' && action.actor === 'F2') break;
    }
    const quote = renderToString(React.createElement(GuidedRound,{game:market,role:'F1',choose:()=>{},send:()=>{},hide:()=>{},onResults:()=>{}})).replace(/<[^>]*>/g,'');
    assert.match(quote,/Ingreso proyectado si vendes todo el lote al precio indicadoUSD 360/);
    assert.match(quote,/Producción acumulada/);
    assert.doesNotMatch(quote,/Ejecutar y verificar los dos lotes/);
    const production = applyAction(createGame({names:{B:'21'}}),{type:'publish',actor:'Estado'});
    const comparison = renderToString(React.createElement(GuidedRound,{game:production,role:'A',choose:()=>{},send:()=>{},hide:()=>{},onResults:()=>{}})).replace(/<[^>]*>/g,'');
    assert.match(comparison,/100 tBajo40 tCO₂e/);
    assert.match(comparison,/300 tMuy alto120 tCO₂e/);
    assert.doesNotMatch(comparison,/de utilidad/);
    assert.equal((comparison.match(/Utilidad después de impuestos/g) ?? []).length, 1);
    assert.match(comparison,/Metas del rol/);
    assert.match(comparison,/Impuesto previsto−USD 2.000/);
    assert.match(comparison,/Caja disponible hoyUSD 5.000/);
    assert.match(comparison,/Empresa B · 21/);

    const { TradeForm } = await server.ssrLoadModule('/src/components/GuidedRound.jsx');
    const withoutStock = structuredClone(market);
    withoutStock.draft.verified.F2 = false;
    const offers = renderToString(React.createElement(TradeForm, { game: withoutStock, role: 'A', send: () => {} }));
    assert.match(offers, /<option value="F2" disabled="">.*sin créditos disponibles/);
  } finally {
    await server.close();
  }
});
