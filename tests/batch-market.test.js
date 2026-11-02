import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame as createCurrentGame,applyAction,companyView,companyCommitment,purchasePreview,productionView,policyIssues,available,remaining,climateStatus,scores,exportGame,importGame,isGameOver,lot } from '../src/engine.js';
import { currentTurn,projectOptionIssue,foundationOrder } from '../src/workflow.js';
import { playTemplate as playCurrentTemplate,DEMO } from '../src/demo.js';

const createGame=(setup,version='3.0.0')=>createCurrentGame(setup,version);
const playTemplate=(rounds,setup,version='3.0.0')=>playCurrentTemplate(rounds,setup,version);
const act=(game,type,actor,data={})=>applyAction(game,{type,actor,...data});
function market(tax=25,production={}) {
  let game=act(createGame(),'policy','Estado',{tax,subsidy:0});
  game=act(game,'publish','Estado');
  for(const role of ['A','B','C']){if(production[role])game=act(game,'production',role,{quantity:production[role]});game=act(game,'confirmProduction',role,{lock:true});}
  for(const role of ['F1','F2']){game=act(game,'addProject',role,{project:'P2'});game=act(game,'confirmProjects',role);}
  game=act(game,'confirmGrants','Estado');game=act(game,'execute','Docente');
  for(const foundation of ['F1','F2'])game=act(game,'verify','Docente',{foundation,verified:true});
  game=act(game,'openMarket','Docente');
  for(const role of ['F1','F2']){game=act(game,'publishQuote',role,{price:18});game=act(game,'finishFoundationTurn',role);}
  return game;
}
const bid=(game,company,foundation,quantity,price)=>act(game,'propose',company,{company,foundation,quantity,price});

test('Production includes tax and distinguishes profit from closing cash',()=>{
  const game=createGame();const before=structuredClone(game);
  assert.deepEqual([productionView(game,'A',200).income,productionView(game,'A',200).cost,productionView(game,'A',200).tax,productionView(game,'A',200).profit,productionView(game,'A',200).closingCash],[10000,6600,2000,1400,6400]);
  assert.equal(productionView(game,'C',300,40).profit,-2600);
  assert.deepEqual(game,before);
});

test('Purchase previews match settlement below, at and above the tax without mutating the game',()=>{
  for(const price of [10,25,35,0]){
    let game=market();const before=structuredClone(game);
    const preview=purchasePreview(game,'A',{foundation:'F1',quantity:20,price});
    assert.equal(preview.valid,true);assert.deepEqual(game,before);
    assert.equal(preview.payment,20*price);assert.equal(preview.taxSavings,500);assert.equal(preview.profitChange,20*(25-price));
    game=bid(game,'A','F1',20,price);
    for(const company of ['A','B','C'])game=act(game,'submitBids',company);
    game=act(game,'accept','F1',{id:game.draft.contracts[0].id});
    assert.deepEqual(companyView(game,'A'),preview.projected);
    assert.equal(game.companies.A.cash,5000-preview.payment);
    assert.equal(climateStatus(game).projected,365);
  }
});

test('All buyers submit before sellers compare, without first-arrival stock reservation',()=>{
  let game=market();game=bid(game,'A','F1',40,10);game=act(game,'submitBids','A');
  assert.equal(available(game,'F1'),40);assert.equal(remaining(game,'A'),0);
  assert.throws(()=>act(game,'accept','F1',{id:game.draft.contracts[0].id}),/corresponde/);
  game=bid(game,'B','F1',20,20);game=act(game,'submitBids','B');
  game=bid(game,'C','F1',20,18);game=act(game,'submitBids','C');
  assert.deepEqual([currentTurn(game).kind,currentTurn(game).role],['sales','F1']);
  assert.equal(currentTurn(game).next,'Docente');
  game=act(game,'accept','F1',{id:game.draft.contracts[1].id});game=act(game,'accept','F1',{id:game.draft.contracts[2].id});
  assert.equal(available(game,'F1'),0);assert.equal(game.foundations.F1.cash,760);
  assert.throws(()=>act(game,'accept','F1',{id:game.draft.contracts[0].id}),/inventario/);
  game=act(game,'finishSales','F1');assert.equal(game.draft.contracts[0].status,'rejected');
  assert.equal(game.draft.salesFinished.F2,true);assert.equal(currentTurn(game).kind,'close');
  game=act(game,'close','Docente');assert.equal(game.history[0].emissions,365);
  assert.deepEqual(importGame(exportGame(game)),game);
});

test('Draft withdrawal is allowed, firm withdrawal and accepted cancellation are rejected',()=>{
  let game=market();game=bid(game,'A','F1',20,10);game=act(game,'cancel','A',{id:game.draft.contracts[0].id});
  assert.equal(remaining(game,'A'),40);
  game=bid(game,'A','F1',20,10);game=act(game,'submitBids','A');
  assert.throws(()=>act(game,'cancel','A',{id:game.draft.contracts[1].id}),/rol|corresponde/);
  for(const company of ['B','C'])game=act(game,'submitBids',company);
  game=act(game,'accept','F1',{id:game.draft.contracts[1].id});
  assert.throws(()=>act(game,'cancel','F1',{id:game.draft.contracts[1].id}),/definitivo/);
  assert.throws(()=>act(game,'reopenNegotiation','Docente'),/vinculantes/);
});

test('Combined offers cannot overcommit cash across both foundations',()=>{
  let game=market();game=bid(game,'A','F1',20,200);
  const preview=purchasePreview(game,'A',{foundation:'F2',quantity:20,price:200});
  assert.equal(preview.valid,false);assert.ok(preview.maxQuantity<20);
  assert.throws(()=>bid(game,'A','F2',20,200),/caja/);
  for(const quantity of [0,1.5,NaN,Infinity])assert.equal(purchasePreview(game,'A',{foundation:'F2',quantity,price:20}).valid,false);
});

test('Solvency holds even if sellers reject tax-saving offers and accept costly offers',()=>{
  let game=market(40,{C:300});
  for(const company of ['A','B'])game=act(game,'submitBids',company);
  game=bid(game,'C','F1',40,0);
  const unsafe=purchasePreview(game,'C',{foundation:'F2',quantity:40,price:110});
  assert.equal(unsafe.projected.closingCash,1200);assert.equal(unsafe.worstClosingCash,-400);
  assert.equal(unsafe.cashAfterPayment,600);assert.equal(unsafe.valid,false);
  assert.throws(()=>bid(game,'C','F2',40,110),/combinación/);
  const preview=purchasePreview(game,'C',{foundation:'F2',quantity:40,price:100});
  assert.equal(preview.valid,true);
  game=bid(game,'C','F2',40,100);
  const pending=companyCommitment(game,'C');assert.equal(pending.cashAfterPayment,1000);
  game=act(game,'submitBids','C');
  game=act(game,'finishSales','F1');game=act(game,'accept','F2',{id:game.draft.contracts[1].id});
  assert.equal(companyView(game,'C').closingCash,0);
});

test('The State cannot publish a tax with no viable production and production cannot rely on uncertain sales',()=>{
  let game=createGame();game.companies.C.cash=500;
  assert.equal(policyIssues(game,40).length,1);assert.equal(policyIssues(game,20).length,0);
  game=act(game,'policy','Estado',{tax:40,subsidy:0});assert.throws(()=>act(game,'publish','Estado'),/ningún nivel/);
  game=act(game,'policy','Estado',{tax:35,subsidy:0});game=act(game,'publish','Estado');
  assert.throws(()=>act(game,'confirmProduction','C'),/caja al cierre/);
  game=act(game,'production','C',{quantity:100});game=act(game,'confirmProduction','C');assert.equal(game.draft.productionLocked.C,true);
});

test('Four batch years preserve reference economic accounts, physical outcomes and scores',()=>{
  const batch=playTemplate();const legacy=playTemplate(undefined,undefined,'2.2.0');
  for(const key of ['companies','foundations','treasury','emissions','production'])assert.deepEqual(batch[key],legacy[key],key);
  assert.deepEqual(scores(batch),scores(legacy));assert.deepEqual(importGame(exportGame(batch)),batch);
  assert.equal(batch.version,'3.0.0');assert.equal(legacy.version,'2.2.0');
  let guidedLegacy=createGame({},'2.2.0');
  for(const action of batch.actions){
    if(['accept','finishSales'].includes(action.type))continue;
    if(action.type==='submitBids')guidedLegacy=act(guidedLegacy,'confirmCompany',action.actor);
    else {
      guidedLegacy=applyAction(guidedLegacy,action);
      if(action.type==='propose')guidedLegacy=act(guidedLegacy,'accept',action.foundation,{id:guidedLegacy.draft.contracts.at(-1).id});
    }
  }
  const count=game=>game.actions.reduce((result,action)=>{const next=applyAction(result.game,action);return {game:next,count:result.count+(currentTurn(next).role!==currentTurn(result.game).role?1:0)};},{game:createGame({},game.version),count:0}).count;
  assert.ok(count(batch)<count(guidedLegacy),`${count(batch)} vs ${count(guidedLegacy)}`);
});

test('Climate feedback uses confirmed emissions, keeps exactly 1400 valid and does not hide provisional values',()=>{
  const game=createGame();
  for(const [emissions,band] of [[0,'green'],[700,'ochre'],[1050,'terracotta'],[1260,'red'],[1400,'red'],[1401,'defeat']]){
    const status=climateStatus({...game,emissions});assert.equal(status.band,band);assert.equal(status.remaining,Math.max(0,1400-emissions));
  }
});

test('No offers skip both empty seller turns, retain explicit buyer choices, and permit closing',()=>{
  let game=market();
  assert.throws(()=>act(game,'close','Docente'),/finalizar/);
  for(const company of ['A','B','C'])game=act(game,'submitBids',company);
  assert.equal(currentTurn(game).kind,'close');
  assert.ok(Object.values(game.draft.salesFinished).every(Boolean));
  game=act(game,'close','Docente');assert.equal(game.history[0].credits,0);
});

test('A legacy acceptance preview includes tax savings instead of incorrectly blocking an affordable purchase',()=>{
  let game=importGame({...exportGame(market(40,{C:300})),version:'2.2.0'});
  game=act(game,'propose','F1',{company:'C',foundation:'F1',quantity:40,price:75});
  const contract=game.draft.contracts[0];
  assert.ok(companyView(game,'C').closingCash<3000);
  const preview=purchasePreview(game,'C',{foundation:'F1',quantity:40,price:75,contractId:contract.id});
  assert.equal(preview.valid,true);assert.equal(preview.projected.closingCash,1000);
  game=act(game,'accept','C',{id:contract.id});assert.deepEqual(companyView(game,'C'),preview.projected);
});

test('Version 3 ends collectively at the first excessive year closing and replays that outcome',()=>{
  const rounds=structuredClone(DEMO);for(const round of rounds)round.produccion={A:300,B:300,C:300};
  const game=playTemplate(rounds);assert.equal(game.version,'3.0.0');assert.equal(game.history.length,3);assert.equal(game.emissions,1590);
  assert.ok(Object.values(scores(game)).every(role=>!role.victory));assert.deepEqual(importGame(exportGame(game)),game);
});

for(const version of ['3.0.0','3.1.0'])test(`Thirty-two deterministic mixed-market games stay solvent and replayable (${version})`,()=>{
  for(let seed=1;seed<=32;seed++){
    let value=seed;const random=max=>{value=(value*1664525+1013904223)>>>0;return value%max;};
    let game=createGame({},version);
    for(let year=1;year<=4&&!isGameOver(game);year++){
      if(year>1)game=act(game,'next','Docente');
      let tax=20+random(21);if(policyIssues(game,tax).length)tax=20;
      game=act(game,'policy','Estado',{tax,subsidy:year===1?0:random(51)});game=act(game,'publish','Estado');
      for(const company of ['A','B','C']){
        const choices=[100,150,200,250,300].filter(quantity=>productionView(game,company,quantity).closingCash>=0);
        assert.ok(choices.length,`No feasible production, seed ${seed}`);
        game=act(game,'production',company,{quantity:choices[random(choices.length)]});game=act(game,'confirmProduction',company);
      }
      for(const foundation of ['F1','F2']){
        const project=random(2)?'P1':'P2';if(random(3)&&!projectOptionIssue(game,foundation,project))game=act(game,'addProject',foundation,{project});
        game=act(game,'confirmProjects',foundation);
      }
      if(!game.draft.stateConfirmed)game=act(game,'confirmGrants','Estado');game=act(game,'execute','Docente');
      for(const foundation of ['F1','F2'])game=act(game,'verify','Docente',{foundation,verified:random(5)!==0});
      game=act(game,'openMarket','Docente');
      for(const foundation of foundationOrder(game)){if(game.draft.phase!=='market'||game.draft.marketFinished[foundation])continue;game=act(game,'publishQuote',foundation,{price:lot(game,foundation)?10+random(61)/2:null});game=act(game,'finishFoundationTurn',foundation);}
      for(const company of ['A','B','C']){
        if(game.draft.phase!=='market'||game.draft.bidsSubmitted[company])continue;
        for(const foundation of ['F1','F2']){
          const price=5+random(91)/2;
          const preview=purchasePreview(game,company,{foundation,quantity:1,price});
          if(preview.maxQuantity&&random(3))game=bid(game,company,foundation,1+random(preview.maxQuantity),price);
        }
        game=act(game,'submitBids',company);
      }
      while(currentTurn(game).kind==='sales'){
        const foundation=currentTurn(game).role;
        for(const contract of game.draft.contracts.filter(item=>item.foundation===foundation&&item.status==='pending')){if(game.draft.phase!=='market'||game.draft.salesFinished[foundation])break;game=act(game,contract.quantity<=available(game,foundation)&&random(2)?'accept':'cancel',foundation,{id:contract.id});}
        if(game.draft.phase==='market'&&!game.draft.salesFinished[foundation])game=act(game,'finishSales',foundation);
      }
      for(const company of ['A','B','C']){assert.ok(game.companies[company].cash>=0);if(game.draft.phase==='market')assert.ok(companyView(game,company).closingCash>=0);}
      if(game.draft.phase==='market')game=act(game,'close','Docente');assert.deepEqual(importGame(exportGame(game)),game);
    }
  }
});
