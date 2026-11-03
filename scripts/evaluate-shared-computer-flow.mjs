import { createGame, applyAction, projectDetails } from '../src/engine.js';
import { currentTurn } from '../src/workflow.js';
import { playTemplate } from '../src/demo.js';

// Count workflow ownership changes, not clicks, physical handovers, or elapsed time.
const reference=playTemplate(undefined,undefined,'3.0.0');
let game=createGame({},'3.0.0');
const visits=[];
function recordVisit(state) {
  const turn=currentTurn(state);
  visits.push({year:state.draft.year,role:turn.role,kind:turn.kind,
    publicGrant:turn.kind==='grants'?projectDetails(state).reduce((total,item)=>total+item.grant,0):null});
}
recordVisit(game);
for(const action of reference.actions){
  const next=applyAction(game,action);
  if(currentTurn(next).role!==currentTurn(game).role)recordVisit(next);
  game=next;
}

function summarize(sequence) {
  const collapsed=sequence.filter((visit,index)=>index===0||visit.role!==sequence[index-1].role);
  return {visits:collapsed.length,handoffs:Math.max(0,collapsed.length-1),byRole:Object.fromEntries([...new Set(collapsed.map(visit=>visit.role))].map(role=>[role,collapsed.filter(visit=>visit.role===role).length]))};
}
const closing=visit=>visit.role==='Docente'&&visit.kind==='close';
const grants=visit=>visit.role==='Estado'&&visit.kind==='grants';
const streamlined=playTemplate(undefined,undefined,'3.1.0');
let replay=createGame({},streamlined.version);const humanVisits=[];
for(const action of streamlined.actions.filter(action=>action.origin!=='system')) {
  if(action.type!=='next')humanVisits.push({role:currentTurn(replay).role});
  replay=applyAction(replay,action);
}
console.log(JSON.stringify({
  scope:'Reference replay. Proposed variants compress role visits only; they do not execute new rules or predict student behavior.',
  baseline:summarize(visits),
  firstYear:visits.filter(visit=>visit.year===1).map(({role,kind})=>({role,kind})),
  grantsByYear:visits.filter(grants).map(({year,publicGrant})=>({year,publicGrant})),
  implementedVersion31:{...summarize(humanVisits),automaticActions:streamlined.actions.filter(action=>action.origin==='system').length,scope:'Actual engine replay; human decision owners only, excluding the results next-year navigation. Not observed classroom handovers.'},
  proposed:{
    automaticClosing:summarize(visits.filter(visit=>!closing(visit))),
    automaticClosingAndZeroGrants:summarize(visits.filter(visit=>!closing(visit)&&!(grants(visit)&&visit.publicGrant===0))),
    automaticClosingAndEligibleGrants:summarize(visits.filter(visit=>!closing(visit)&&!grants(visit))),
    conditionalQuotesWithPlansAndAutomaticEligibleGrantsAndClosing:summarize(visits.filter(visit=>!closing(visit)&&!grants(visit)&&visit.kind!=='quote')),
  },
},null,2));
