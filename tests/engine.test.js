import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame, applyAction, scores, exportGame, importGame, automaticRatings, lot, projectDetails, companyView, available, remaining, VERSION, isGameOver } from '../src/engine.js';
import { playTemplate, DEMO } from '../src/demo.js';
const act = (g, type, actor, data = {}) => applyAction(g, { type, actor, ...data });

test('The public example replays the same state as the source template', () => {
  const example = JSON.parse(readFileSync(
    new URL('../public/ejemplos/partida_demo_v2.json', import.meta.url),
    'utf8',
  ));
  assert.deepEqual(importGame(example), playTemplate(DEMO, example.setup));
});

function market({ tax = 20, project = 'P1', verified = true } = {}) {
  let g = createGame();
  g = act(g, 'policy', 'Estado', { tax, subsidy: 0 });
  g = act(g, 'publish', 'Estado');
  for (const f of ['F1','F2']) g = act(g, 'addProject', f, { project });
  for (const f of ['F1','F2']) g = act(g, 'confirmProjects', f);
  g = act(g, 'confirmGrants', 'Estado');
  g = act(g, 'execute', 'Docente');
  for (const f of ['F1','F2']) g = act(g, 'verify', 'Docente', { foundation: f, verified });
  return act(g, 'openMarket', 'Docente');
}
function proposal(g, quantity = 20, price = 15, company = 'A', foundation = 'F1') {
  return act(g, 'propose', foundation, { company, foundation, quantity, price });
}
function rejects(g, a, pattern) {
  const before = JSON.stringify(g);
  assert.throws(() => applyAction(g, a), pattern);
  assert.equal(JSON.stringify(g), before, 'La entrada no debe mutar el estado original');
}
test('Una partida completa reproduce cuentas y aplica puntuación corregida', () => {
  const g = playTemplate();
  assert.equal(g.emissions, 1345);
  assert.equal(g.production, 2250);
  assert.equal(g.treasury.fund, 3280);
  assert.deepEqual(g.history.map(r => r.tax), [4100,3750,4500,5250]);
  assert.deepEqual(g.history.map(r => r.emissions), [405,350,300,290]);
  assert.deepEqual(Object.values(scores(g)).map(s => s.points), [100,100,75,100,100,95.5]);
  assert.ok(Object.values(scores(g)).every(s => s.victory));
});
test('La conservación monetaria incluye ingresos, costos e inversión, sin duplicar transferencias', () => {
  const g = playTemplate();
  const cash = Object.values(g.companies).reduce((n,s) => n+s.cash, 0) + Object.values(g.foundations).reduce((n,s) => n+s.cash,0) + g.treasury.fund + g.treasury.general;
  assert.equal(cash, 49700);
});
test('El precio acordado cambia la utilidad sin alterar emisiones', () => {
  const g = market();
  const a = act(proposal(g,20,15), 'accept', 'A', { id: proposal(g).draft.contracts[0].id });
  const b = act(proposal(g,20,25), 'accept', 'A', { id: proposal(g).draft.contracts[0].id });
  assert.equal(companyView(a,'A').profit-companyView(b,'A').profit, 200);
  assert.equal(companyView(a,'A').emissions, companyView(b,'A').emissions);
});
test('No permite una acción fuera de etapa ni de rol', () => {
  const g=createGame();
  rejects(g,{type:'publish',actor:'A'},/rol/);
  rejects(g,{type:'close',actor:'Docente'},/etapa/);
  rejects(g,{type:'mystery',actor:'Estado'},/desconocida/);
});
test('La tarifa solo admite enteros 20 a 40 y no cambia durante negociación', () => {
  for (const tax of [19,41,20.5,NaN,Infinity,true,'25']) rejects(createGame(),{type:'policy',actor:'Estado',tax,subsidy:0},/Tarifa/);
  rejects(market(),{type:'policy',actor:'Estado',tax:30,subsidy:0},/etapa/);
});
test('El apoyo público no supera el 50 por ciento', () => {
  rejects(createGame(),{type:'policy',actor:'Estado',tax:20,subsidy:51},/Apoyo/);
});
test('El año 1 no puede gastar el recaudo del mismo año', () => {
  let g=act(createGame(),'policy','Estado',{tax:20,subsidy:50}); g=act(g,'publish','Estado');
  g=act(g,'addProject','F1',{project:'P1'});
  rejects(g,{type:'confirmGrants',actor:'Estado'},/fondo/);
});
test('Los proyectos necesitan fondos antes de vender', () => {
  let g=act(createGame(),'publish','Estado');
  g=act(g,'addProject','F1',{project:'P1'});g=act(g,'addProject','F1',{project:'P1'});
  assert.equal(projectDetails(g)[0].cashAfter,-200);
  rejects(g,{type:'confirmProjects',actor:'F1'},/antes de vender/);
});
test('Se puede renegociar el aporte y se invalidan firmas anteriores', () => {
  let g=act(createGame(),'publish','Estado');g=act(g,'confirmProjects','F1');g=act(g,'confirmProjects','F2');g=act(g,'confirmGrants','Estado');
  g=act(g,'subsidy','Estado',{subsidy:5});
  assert.deepEqual(g.draft.projectConfirmed,{F1:false,F2:false});assert.equal(g.draft.stateConfirmed,false);
});
test('Una fundación no puede superar su línea base de 100', () => {
  let g=act(createGame(),'publish','Estado');
  g=act(g,'addProject','F1',{project:'P2'});g=act(g,'addProject','F1',{project:'P2'});
  rejects(g,{type:'addProject',actor:'F1',project:'P2'},/100/);
});
test('No hay ejecución sin acuerdo de las dos fundaciones y el Estado', () => {
  rejects(act(createGame(),'publish','Estado'),{type:'execute',actor:'Docente'},/firmas/);
});
test('Se exige verificación expresa antes de abrir el mercado', () => {
  const g=market();
  const lastOpenIndex=g.actions.findIndex(a=>a.type==='openMarket');
  let state=createGame();for (const a of g.actions.slice(0,lastOpenIndex-1))state=applyAction(state,a);
  rejects(state,{type:'openMarket',actor:'Docente'},/Verifique/);
});
test('El lote no verificado bloquea la venta y no simula una reducción', () => {
  const g=market({verified:false});assert.equal(lot(g,'F1'),0);
  rejects(g,{type:'propose',actor:'F1',company:'A',foundation:'F1',quantity:1,price:10},/verificado/);
});
test('Las ofertas reservan inventario y evitan la doble venta', () => {
  const g=proposal(market(),20);assert.equal(available(g,'F1'),0);
  rejects(g,{type:'propose',actor:'F1',company:'B',foundation:'F1',quantity:1,price:15},/lote/);
});
test('La compensación suma todos los contratos de una empresa', () => {
  let g=proposal(market({project:'P2'}),40);
  assert.equal(remaining(g,'A'),0);
  rejects(g,{type:'propose',actor:'F2',company:'A',foundation:'F2',quantity:1,price:15},/50/);
});
test('Los créditos enteros no redondean hacia arriba un límite de 37,5', () => {
  const g=market({project:'P2'});
  assert.equal(remaining(g,'B'),37);
  rejects(g,{type:'propose',actor:'F1',company:'B',foundation:'F1',quantity:38,price:15},/50/);
  assert.equal(proposal(g,37,15,'B').draft.contracts[0].quantity,37);
});
test('No hay anticipos, números negativos ni cantidades fraccionarias', () => {
  const g=market();
  for (const data of [{quantity:1,price:15,advance:1},{quantity:1,price:15,anticipo:1},{quantity:-1,price:15},{quantity:1.5,price:15},{quantity:1,price:-1},{quantity:1,price:1.001}]) {
    rejects(g,{type:'propose',actor:'F1',company:'A',foundation:'F1',...data},/anticipos|Créditos|Precio/);
  }
});
test('Una parte no puede aceptar su propia oferta', () => {
  const g=proposal(market());rejects(g,{type:'accept',actor:'F1',id:g.draft.contracts[0].id},/rol/);
});
test('El pago ocurre una sola vez al aceptar y se revierte al cancelar', () => {
  let g=proposal(market());const id=g.draft.contracts[0].id;
  g=act(g,'accept','A',{id});assert.equal(g.companies.A.cash,4700);assert.equal(g.foundations.F1.cash,700);
  rejects(g,{type:'accept',actor:'A',id},/pendiente/);
  g=act(g,'cancel','F1',{id});assert.equal(g.companies.A.cash,5000);assert.equal(g.foundations.F1.cash,400);
});
test('No se puede pagar al contado sin caja', () => {
  const g=proposal(market(),20,1000);rejects(g,{type:'accept',actor:'A',id:g.draft.contracts[0].id},/caja/);
});
test('La producción se puede corregir respetando contratos ya pactados', () => {
  let g=proposal(market({project:'P2'}),40);g=act(g,'accept','A',{id:g.draft.contracts[0].id});
  rejects(g,{type:'production',actor:'A',quantity:100},/50/);
  g=act(g,'cancel','A',{id:g.draft.contracts[0].id});g=act(g,'production','A',{quantity:100});assert.equal(g.draft.production.A,100);
});
test('No se liquida sin resolver ofertas o sin confirmar todas las empresas', () => {
  const g=proposal(market());rejects(g,{type:'confirmCompany',actor:'A'},/pendientes/);
  rejects(g,{type:'close',actor:'Docente'},/confirmar/);
});
test('Los IDs son únicos y los lotes cambian cada año', () => {
  const g=playTemplate(),ids=g.history.flatMap(r=>[...r.projects,...r.contracts].map(x=>x.id));
  assert.equal(new Set(ids).size,ids.length);
  assert.ok(g.history.every(r=>r.contracts.every(c=>c.lot===`L-${r.year}-${c.foundation}`)));
});
test('Se publica una evaluación automática con evidencia para cada actor', () => {
  const g=playTemplate();assert.equal(g.treasury.votes,11);
  for (const r of g.history) for (const x of Object.values(r.ratings)) {
    assert.equal(x.criteria.length,3);assert.ok(x.criteria.every(c=>typeof c.passed==='boolean' && c.evidence));
    const n=x.criteria.filter(c=>c.passed).length;assert.equal(x.value,n===3?1:n===2?0:-1);
  }
  rejects(market(),{type:'vote',actor:'A',value:1},/desconocida/);
});
test('El umbral climático de valoración está separado de la derrota final', () => {
  const g=market();const r=automaticRatings(g);
  assert.equal(r.A.criteria[1].evidence.includes('350'),true);
});
test('Una sola compra simbólica ya no da la victoria a una empresa', () => {
  const ds=structuredClone(DEMO);ds[0].contratos[0].cantidad=1;
  ds[0].contratos.push({...ds[0].contratos[0],empresa:'B',cantidad:19});
  for(const d of ds.slice(1))d.contratos=d.contratos.filter(c=>c.empresa!=='A');
  const g=playTemplate(ds);assert.equal(g.companies.A.credits,1);assert.equal(scores(g).A.points,65);assert.equal(scores(g).A.victory,false);
});
test('El Estado ya no puede ganar con producción acumulada de 1200', () => {
  const ds=structuredClone(DEMO);
  for(const d of ds){d.produccion={A:100,B:100,C:100};d.tarifa=20;d.proyectos={F1:[],F2:[]};d.contratos=[];}
  const g=playTemplate(ds);assert.equal(g.emissions,1400);assert.equal(g.production,1200);assert.equal(scores(g).Estado.victory,false);
});
test('Una derrota ambiental impide todas las victorias', () => {
  const ds=structuredClone(DEMO);for(const d of ds)d.produccion={A:300,B:300,C:300};
  const g=playTemplate(ds);assert.equal(g.emissions,1590);assert.equal(g.history.length,3);assert.ok(isGameOver(g));assert.ok(Object.values(scores(g)).every(s=>!s.victory));
  for (const action of [{type:'next',actor:'Docente'},{type:'close',actor:'Docente'},{type:'reopenNegotiation',actor:'Docente'},{type:'policy',actor:'Estado',tax:20,subsidy:0}]) rejects(g,action,/terminó/);
  assert.deepEqual(importGame(exportGame(g)),g);
});

test('Exactly 1400 accumulated emissions before year four does not end the game', () => {
  const rounds=structuredClone(DEMO.slice(0,3));
  for (const round of rounds.slice(0,2)) round.produccion={A:300,B:300,C:300};
  rounds[2].produccion={A:150,B:100,C:250};
  rounds[2].contratos=rounds[2].contratos.map(contract=>({...contract,cantidad:{A:15,B:10,C:30}[contract.empresa]}));
  const game=playTemplate(rounds);
  assert.equal(game.emissions,1400);
  assert.equal(isGameOver(game),false);
  assert.equal(act(game,'next','Docente').draft.year,4);
});

test('Legacy losing logs are fully validated and migrated to their first losing round', () => {
  const legacy=exportGame(playTemplate());
  legacy.version='2.0.0';
  legacy.actions=legacy.actions.map(action=>action.type==='production'?{...action,quantity:300}:action);
  const migrated=importGame(legacy);
  assert.equal(migrated.version,VERSION);
  assert.equal(migrated.emissions,1590);
  assert.equal(migrated.history.length,3);
  assert.ok(migrated.actions.length<legacy.actions.length);
  assert.deepEqual(importGame(exportGame(migrated)),migrated);
  assert.throws(()=>importGame({...legacy,version:VERSION}),/terminó/);
  assert.throws(()=>importGame({...legacy,actions:[...legacy.actions,{type:'close',actor:'Docente'}]}),/etapa/);
});
test('No hay victoria prematura ni quinta ronda', () => {
  assert.throws(()=>scores(createGame()),/cuatro/);rejects(playTemplate(),{type:'next',actor:'Docente'},/terminó/);
});
test('Exportar e importar reproduce la partida por sus decisiones', () => {
  const g=playTemplate();assert.deepEqual(importGame(JSON.parse(JSON.stringify(exportGame(g)))),g);
  const tampered=exportGame(g);tampered.companies={A:{cash:999999}};
  assert.equal(importGame(tampered).companies.A.cash,g.companies.A.cash);
});
test('Importación inválida o bitácora adulterada se rechaza', () => {
  assert.throws(()=>importGame({schema:'tension-carbono',version:'1.0.0',actions:[]}),/incompatible/);
  assert.throws(()=>importGame({schema:'tension-carbono',version:VERSION,actions:[{type:'close',actor:'Docente'}]}),/etapa/);
  assert.throws(()=>createGame({names:{team:'x'.repeat(100)}}),/Nombre/);
});
