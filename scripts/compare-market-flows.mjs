import { createGame, applyAction, scores, isGameOver } from '../src/engine.js';
import { currentTurn } from '../src/workflow.js';
import { playTemplate, DEMO } from '../src/demo.js';

function replayWithHandoffs(actions, version) {
  let game=createGame({},version), handoffs=0, marketHandoffs=0;
  for(const action of actions){
    const next=applyAction(game,action);
    if(currentTurn(next).role!==currentTurn(game).role){handoffs++;if(game.draft.phase==='market')marketHandoffs++;}
    game=next;
  }
  return {game,handoffs,marketHandoffs,actions:actions.length};
}

function compare(rounds) {
  const batch=playTemplate(rounds), actions=[];
  let legacy=createGame({},'2.2.0');
  const add=action=>{actions.push(action);legacy=applyAction(legacy,action);};
  for(const action of batch.actions){
    if(['accept','finishSales'].includes(action.type))continue;
    if(action.type==='submitBids')add({type:'confirmCompany',actor:action.actor});
    else {add(action);if(action.type==='propose')add({type:'accept',actor:action.foundation,id:legacy.draft.contracts.at(-1).id});}
  }
  const old=replayWithHandoffs(actions,'2.2.0'), next=replayWithHandoffs(batch.actions,'3.0.0');
  return {years:batch.history.length,bilateral:{handoffs:old.handoffs,marketHandoffs:old.marketHandoffs,actions:old.actions},batch:{handoffs:next.handoffs,marketHandoffs:next.marketHandoffs,actions:next.actions},emissions:batch.emissions,production:batch.production,scores:isGameOver(batch)?scores(batch):null,sameAccounts:JSON.stringify([batch.companies,batch.foundations,batch.treasury])===JSON.stringify([legacy.companies,legacy.foundations,legacy.treasury])};
}

const noTrade=structuredClone(DEMO).map(round=>({...round,contratos:[],proyectos:{F1:[],F2:[]},verificado:{F1:true,F2:true}}));
const oneTrade=[structuredClone(DEMO[0])];
oneTrade[0].contratos=oneTrade[0].contratos.slice(0,1);
console.log(JSON.stringify({reference:compare(DEMO),noTrade:compare(noTrade),oneTrade:compare(oneTrade)},null,2));
