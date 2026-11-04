import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { createGame as createCurrentGame, applyAction, ROLES } from '../src/engine.js';
import { ResearchRecorder } from '../src/research/recorder.js';
import { actionData } from '../src/research/data.js';
import { TEAM_ALIASES } from '../src/table_setup.js';
import { playTemplate as playCurrentTemplate } from '../src/demo.js';
const createGame = setup => createCurrentGame(setup,'2.2.0');
const playTemplate = (rounds,setup) => playCurrentTemplate(rounds,setup,'2.2.0');

const codes=Object.fromEntries(ROLES.map((role,index)=>[role,`TEST-00${index}`]));
const setup={studentCodes:codes,names:{team:'PRIVATE TEAM'},players:{A:'PRIVATE NAME'}};
const config={enabled:true,url:'https://example.supabase.co',study:'validation'};
function recorder(transport=async payload=>payload.p_events.length,storage) {
  let saved=null;
  const disk=storage||{getItem:()=>saved,setItem:(key,value)=>{saved=value;}};
  return new ResearchRecorder({storage:disk,config,transport,uuid:()=>crypto.randomUUID(),schedule:()=>0,cancel:()=>{},now:()=>Date.parse('2026-11-01T12:00:00Z')});
}

test('Research requires explicit begin and keeps student codes outside event and outcome payloads',async()=>{
  let calls=0;
  const tracker=recorder(async payload=>{calls++;return payload.p_events.length;});
  const game=createGame(setup);
  tracker.attach(game); tracker.record('help_opened'); await tracker.flush();
  assert.equal(calls,0);
  assert.equal(tracker.begin(createGame(),12),false);
  assert.equal(tracker.begin(game,12),true);
  const action={type:'policy',actor:'Estado',tax:20,subsidy:0,note:'PRIVATE FREE TEXT'};
  const next=applyAction(game,action); tracker.applied(game,next,[action]);
  const payload=tracker.active().payload;
  assert.deepEqual(payload.p_codes,codes);
  const analytical=JSON.stringify([payload.p_session,payload.p_events,payload.p_rounds]);
  for(const value of ['PRIVATE TEAM','PRIVATE NAME','PRIVATE FREE TEXT',...Object.values(codes)]) assert.equal(analytical.includes(value),false,value);
  assert.deepEqual(actionData(action),{tax:20,subsidy:0});
  await tracker.flush(); assert.equal(tracker.snapshot().pending,false);
});

test('A network failure persists pending data, survives reload, and later acknowledges it',async()=>{
  let stored=null;
  const storage={getItem:()=>stored,setItem:(key,value)=>{stored=value;}};
  const game=createGame(setup);
  const failed=recorder(async()=>{throw Error('offline');},storage);
  failed.begin(game,8); await failed.flush();
  assert.equal(failed.snapshot().pending,true);
  const restored=recorder(undefined,storage); restored.attach(game);
  assert.equal(restored.snapshot().active,true);
  await restored.flush(); assert.equal(restored.snapshot().pending,false);
  assert.equal(game.actions.length,0);
});

test('New events added during a request are not discarded by an older acknowledgement',async()=>{
  let resolve;
  const tracker=recorder(payload=>new Promise(done=>{resolve=()=>done(payload.p_events.length);}));
  tracker.begin(createGame(setup),12);
  const request=tracker.flush(); tracker.record('help_opened'); resolve(); await request;
  assert.equal(tracker.snapshot().pending,true);
  assert.equal(tracker.active().ack,1);
  assert.equal(tracker.active().payload.p_events.length,2);
});

test('Stopping collection discards unsent current data and never changes the game',async()=>{
  let calls=0; const tracker=recorder(async()=>{calls++;return 1;});
  const game=createGame(setup); tracker.begin(game,4); tracker.withdraw(); await tracker.flush();
  assert.equal(tracker.snapshot().active,false); assert.equal(calls,0);
  assert.equal(game.setup.studentCodes.A,codes.A);
});

test('A new unrecorded game is not reported as registered when an older session is acknowledged',async()=>{
  const tracker=recorder(); tracker.begin(createGame(setup),12); tracker.finish();
  tracker.unrecorded(createGame(setup)); await tracker.flush();
  assert.equal(tracker.snapshot().recorded,false);
  assert.equal(tracker.snapshot().active,false);
});

test('The database blocks public reads, unauthenticated writes, identity changes, and another owner',async()=>{
  const db=new PGlite();
  try {
    await db.exec("create role anon;create role authenticated;create schema auth;create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;");
    await db.exec(readFileSync(new URL('../supabase/migrations/202611010001_research.sql',import.meta.url),'utf8'));
    await db.exec(readFileSync(new URL('../supabase/migrations/202611010002_batch_market.sql',import.meta.url),'utf8'));
    await db.exec(readFileSync(new URL('../supabase/migrations/20261102051505_automatic_action_origin.sql',import.meta.url),'utf8'));
    await db.exec(readFileSync(new URL('../supabase/migrations/20261103130310_session_profile.sql',import.meta.url),'utf8'));
    await db.exec(readFileSync(new URL('../supabase/migrations/20261103213831_latin_american_team_aliases.sql',import.meta.url),'utf8'));
    assert.equal((await db.query("select research.valid_event_data('engine_action','submitBids','{}') as valid")).rows[0].valid,true);
    assert.equal((await db.query("select research.valid_event_data('engine_action','finishSales','{}') as valid")).rows[0].valid,true);
    assert.equal((await db.query("select research.valid_event_data('engine_action','close','{\"origin\":\"system\"}') as valid")).rows[0].valid,true);
    assert.equal((await db.query("select research.valid_event_data('engine_action','close','{\"origin\":\"student\"}') as valid")).rows[0].valid,false);
    const tracker=recorder(); tracker.begin(createGame(setup),12);
    const payload=tracker.active().payload;
    payload.p_session.consent_version = '2026-11-01';
    const args=body=>[body.p_session,body.p_codes,body.p_events,body.p_rounds].map(JSON.stringify);
    const rpc=body=>db.query('select public.record_research_session($1::jsonb,$2::jsonb,$3::jsonb,$4::jsonb) as revision',args(body));
    await db.exec('set role anon');
    await assert.rejects(rpc(payload),/permission denied/);
    await db.exec("reset role;select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);set role authenticated;");
    assert.equal((await rpc(payload)).rows[0].revision,1);
    assert.equal((await rpc(payload)).rows[0].revision,1);
    await assert.rejects(db.query('select * from research.participants'),/permission denied/);
    await assert.rejects(db.query('select * from research.events'),/permission denied/);
    const changed=structuredClone(payload); changed.p_codes.A='OTHER-CODE';
    await assert.rejects(rpc(changed),/cannot change/);
    await db.exec("reset role;select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',false);set role authenticated;");
    await assert.rejects(rpc(payload),/Session unavailable/);
    await db.exec("reset role;select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);set role authenticated;");
    const unsafe=structuredClone(payload); unsafe.p_session.id=crypto.randomUUID(); unsafe.p_events[0].data={student_code:'PRIVATE'};
    await assert.rejects(rpc(unsafe),/Invalid event/);
    await db.exec('reset role');
    assert.equal((await db.query('select count(*)::int as count from research.events')).rows[0].count,1);
    assert.equal((await db.query('select count(*)::int as count from research.participants')).rows[0].count,6);
    const full=recorder(); let game=createGame(setup); full.begin(game,12);
    for(const action of playTemplate().actions){const next=applyAction(game,action);full.applied(game,next,[action]);game=next;}
    const completed=full.state.sessions[0].payload;
    assert.equal(completed.p_session.outcome,'completed');
    assert.equal(completed.p_rounds.length,4);
    await db.exec('set role authenticated');
    assert.equal((await rpc(completed)).rows[0].revision,completed.p_events.length);
    await db.exec('reset role');
    const analyses=await db.exec(readFileSync(new URL('../supabase/analysis.sql',import.meta.url),'utf8').replaceAll("'pilot-2026'","'validation'"));
    const contracts=analyses.at(-1).rows;
    assert.equal(contracts.length,game.history.reduce((sum,round)=>sum+round.contracts.length,0));
    assert.ok(contracts.every(contract=>contract.accepted&&!contract.cancelled_or_rejected));
    const batchTracker=recorder();
    let batch=createCurrentGame({ ...setup, names:{team:'México'}, avatarGenders:{A:'other',B:'private text'} });
    batchTracker.begin(batch,8);
    for(const action of playCurrentTemplate().actions.filter(action=>action.origin!=='system')){const next=applyAction(batch,action);batchTracker.applied(batch,next,[action]);batch=next;}
    const batchPayload=batchTracker.state.sessions[0].payload;
    assert.deepEqual(batchPayload.p_events[0].data,{team_alias:'mexico',avatar_genders:{A:'other'}});
    const events=batchPayload.p_events.filter(event=>event.kind==='engine_action');
    assert.equal(events.length,batch.actions.length);
    assert.equal(events.filter(event=>event.data.origin==='system').length,batch.actions.filter(action=>action.origin==='system').length);
    assert.deepEqual(events.filter(event=>['execute','verify','openMarket'].includes(event.action_type)).slice(0,4).map(event=>[event.actor,event.phase]),[['Docente','projects'],['Docente','verification'],['Docente','verification'],['Docente','verification']]);
    await db.exec('set role authenticated');
    assert.equal((await rpc(batchPayload)).rows[0].revision,batchPayload.p_events.length);
    await db.exec('reset role');
    const combined=await db.exec(readFileSync(new URL('../supabase/analysis.sql',import.meta.url),'utf8').replaceAll("'pilot-2026'","'validation'"));
    assert.ok(combined[1].rows.some(row=>row.session_id===batchPayload.p_session.id&&row.team_alias==='mexico'&&row.initial_avatar_gender==='other'));
    for (const alias of [...Object.keys(TEAM_ALIASES), 'pallet_town', 'hyrule', 'wakanda', 'springfield', 'gravity_falls']) {
      const result = await db.query("select research.valid_event_data('session_started',null,$1::jsonb) as valid",[JSON.stringify({team_alias:alias})]);
      assert.equal(result.rows[0].valid,true,alias);
    }
    for (const data of [{team_alias:'private text'}, {avatar_genders:{A:'private text'}}, {avatar_genders:{name:'woman'}}]) {
      const result = await db.query("select research.valid_event_data('session_started',null,$1::jsonb) as valid",[JSON.stringify(data)]);
      assert.equal(result.rows[0].valid,false);
    }
    assert.equal(combined.at(-1).rows.filter(row=>row.session_id===batchPayload.p_session.id).length,batch.history.reduce((total,round)=>total+round.contracts.length,0));
  } finally {await db.close();}
});
