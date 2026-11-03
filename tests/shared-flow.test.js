import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,applyAction,exportGame,importGame,scores,transactionEffects,committedFrames,available,emissionsByRole,isGameOver} from '../src/engine.js';
import {currentTurn} from '../src/workflow.js';
import {DEMO,playTemplate} from '../src/demo.js';
import {transactionReceipt} from '../src/motion.js';

const act=(game,type,actor,data={})=>applyAction(game,{type,actor,...data});

test('Three rounds retain installed capacity but never carry unsold credits into the next lot', () => {
  const rounds = structuredClone(DEMO.slice(0,3));
  for (const round of rounds) round.contratos = [];
  rounds[1].proyectos = { F1:[], F2:[] };
  rounds[2].proyectos = { F1:[], F2:[] };
  const markets = [];
  let game = createGame();
  const played = playTemplate(rounds);
  for (const action of played.actions.filter(action => action.origin !== 'system')) {
    game = applyAction(game, action);
    if (action.type === 'confirmProjects' && action.actor === 'F2') {
      assert.equal(currentTurn(game).kind, 'quote');
      markets.push(available(game, 'F1'));
    }
    if (game.draft.phase === 'results') assert.equal(available(game, 'F1'), 0);
  }
  assert.deepEqual(markets,[20,20,20]);
  assert.equal(game.foundations.F1.issued,60);
  assert.equal(game.foundations.F1.sold,0);
  assert.deepEqual(importGame(exportGame(game)),game);
});

test('Three-round cap is inclusive and the role totals reconcile with the physical account', () => {
  const rounds = Array.from({length:4}, () => ({
    tarifa:20, produccion:{A:100,B:100,C:100}, proyectos:{F1:[],F2:[]}, contratos:[],
  }));
  const boundary = playTemplate(rounds);
  assert.equal(boundary.history.length,3);
  assert.equal(boundary.emissions,1050);
  assert.ok(isGameOver(boundary));
  assert.equal(scores(boundary).Estado.components[0],30);
  assert.equal(scores(boundary).Estado.productionMet,false);
  assert.throws(() => act(boundary,'next','Docente'), /terminó/);
  for (const round of rounds) round.produccion = {A:300,B:300,C:300};
  const loss = playTemplate(rounds);
  assert.equal(loss.history.length,2);
  assert.equal(loss.emissions,1300);
  assert.ok(Object.values(scores(loss)).every(role => !role.victory));
  const demo = playTemplate();
  assert.ok(scores(demo).Estado.productionMet);
  assert.equal(Object.values(emissionsByRole(demo)).reduce((sum, role) => sum+role.emissions,0),demo.emissions);
  for (const result of demo.history) {
    assert.equal(Object.values(emissionsByRole(demo,result)).reduce((sum, role) => sum+role.emissions,0),result.emissions);
  }
});
function beforeAction(predicate) {
  let game=createGame({},'3.1.0');
  for(const action of playTemplate(undefined,undefined,game.version).actions.filter(item=>item.origin!=='system')) {
    if(predicate(game,action))return game;
    game=applyAction(game,action);
  }
  throw Error('Fixture condition not found');
}

test('Zero grants advance automatically while nonzero grants retain State approval',()=>{
  for(const year of [1,2]) {
    let game=beforeAction((state,action)=>state.draft.year===year&&action.type==='confirmProjects'&&action.actor==='F2');
    game=act(game,'confirmProjects','F2');
    assert.equal(game.draft.stateConfirmed,year===1);
    assert.equal(currentTurn(game).role,year===1?'Docente':'Estado');
    if(year===1)assert.deepEqual(game.actions.at(-1),{type:'confirmGrants',actor:'Estado',origin:'system'});
  }
});

test('Rejected or absent verified supply skips impossible offers and closes without inventing purchases',()=>{
  let game=beforeAction((state,action)=>action.type==='execute');
  game=act(game,'execute','Docente');
  for(const foundation of ['F1','F2'])game=act(game,'verify','Docente',{foundation,verified:false});
  const before=game;game=act(game,'openMarket','Docente');
  assert.equal(game.draft.phase,'results');assert.equal(game.history[0].credits,0);
  assert.equal(game.actions.at(-1).type,'close');assert.equal(game.actions.at(-1).origin,'system');
  assert.equal(game.actions.filter(action=>action.type==='submitBids'&&action.origin==='system').length,3);
  assert.equal(transactionEffects(before,game).some(effect=>effect.kind==='purchase'),false);
});

test('An unavailable foundation does not require a price or a manual decline',()=>{
  let game=beforeAction((state,action)=>action.type==='openMarket');
  game=act(game,'verify','Docente',{foundation:'F1',verified:false});game=act(game,'openMarket','Docente');
  assert.equal(currentTurn(game).role,'F2');assert.equal(currentTurn(game).kind,'quote');
  assert.equal(game.draft.marketFinished.F1,true);assert.equal(game.draft.quotes.F1,null);
});

test('The final sale settles once, completes seller bookkeeping and shows a closed year',()=>{
  const game=beforeAction((state,action)=>state.draft.year===1&&action.type==='accept'&&action.actor==='F2'&&state.draft.contracts.filter(contract=>contract.foundation==='F2'&&contract.status==='pending').length===1);
  const pending=game.draft.contracts.find(contract=>contract.foundation==='F2'&&contract.status==='pending');
  const next=act(game,'accept','F2',{id:pending.id});
  assert.equal(next.history.length,1);assert.equal(next.draft.phase,'results');
  assert.deepEqual(next.actions.slice(-2).map(action=>[action.type,action.origin]),[['finishSales','system'],['close','system']]);
  const effects=transactionEffects(game,next);
  assert.equal(effects.filter(effect=>effect.kind==='purchase').length,1);
  assert.equal(effects.find(effect=>effect.kind==='purchase').amount,pending.quantity*pending.price);
  const receipt=transactionReceipt(game,next,1);
  assert.match(receipt.text,/pagó/);assert.match(receipt.text,/cerrado/);
  assert.deepEqual(committedFrames(game,next).map(frame=>frame.phase),['market','market','market']);
});

test('The streamlined replay retains economic outcomes and validates system-generated history',()=>{
  const game=playTemplate(undefined,undefined,'3.1.0'),old=playTemplate(undefined,undefined,'3.0.0');
  for(const key of ['companies','foundations','treasury','emissions','production'])assert.deepEqual(game[key],old[key]);
  assert.deepEqual(scores(game),scores(old));assert.deepEqual(importGame(exportGame(game)),game);
  const corrupted=exportGame(game);corrupted.actions=corrupted.actions.filter(action=>!(action.type==='confirmGrants'&&action.origin==='system'));
  assert.throws(()=>importGame(corrupted),/bitácora/);
  assert.throws(()=>act(createGame(),'publish','Estado',{origin:'system'}),/dentro del motor/);
  assert.equal(old.actions.some(action=>action.origin==='system'),false);
});

test('Effects are receipts of committed transfers, never previews or repeated historical payments',()=>{
  let game=beforeAction((state,action)=>action.type==='propose');
  const next=act(game,'propose','A',{company:'A',foundation:'F1',quantity:1,price:10});
  assert.equal(transactionReceipt(game,next,1),null);
  const execution=beforeAction((state,action)=>action.type==='execute');
  const after=act(execution,'execute','Docente');
  assert.equal(transactionEffects(execution,after).filter(effect=>effect.kind==='project').length,2);
  assert.equal(transactionEffects(execution,after).some(effect=>effect.kind==='grant'),false);
  assert.equal(transactionReceipt(after,after,2),null);
  const prior=structuredClone(execution);transactionReceipt(execution,after,3);assert.deepEqual(execution,prior);
});
