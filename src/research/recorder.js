import { ACTION_FIELDS, CONSENT_VERSION, actionData, hasStudentCodes, outcome, roundData } from './data.js';
import { currentTurn } from '../workflow.js';
import { committedFrames } from '../engine.js';

const STORAGE_KEY = 'tension-carbono-research-v1';
const empty = () => ({sessions:[],activeId:null});
export class ResearchRecorder {
  constructor({storage,transport,config,now=Date.now,uuid=()=>crypto.randomUUID(),schedule=(callback,delay)=>setTimeout(callback,delay),cancel=id=>clearTimeout(id)}) {
    Object.assign(this,{storage,transport,config,now,uuid,schedule,cancel});
    try { this.state = JSON.parse(storage?.getItem(STORAGE_KEY)) || empty(); } catch { this.state = empty(); }
    if (!Array.isArray(this.state.sessions)) this.state = empty();
    this.state.sessions = this.state.sessions.filter(row=>row?.payload?.p_session?.id && row.payload.p_codes && Array.isArray(row.payload.p_events) && Number.isInteger(row.ack));
    this.state.currentRecordId ??= this.state.activeId;
    this.listeners = new Set(); this.status = this.state.currentRecordId && this.state.confirmedId === this.state.currentRecordId ? 'saved' : 'idle'; this.visible = true; this.visibleSince = now();
    this.timer = null; this.sending = false;
  }
  subscribe(listener) { this.listeners.add(listener); listener(this.snapshot()); return () => this.listeners.delete(listener); }
  snapshot() { return {configured:this.config.enabled,recorded:!!this.state.currentRecordId,active:!!this.active(),status:this.status,pending:this.state.sessions.some(row=>row.ack < row.payload.p_events.length)}; }
  active() { return this.state.sessions.find(row=>row.payload.p_session.id === this.state.activeId); }
  persist() {
    try { this.storage?.setItem(STORAGE_KEY,JSON.stringify(this.state)); } catch { this.status = 'storage_error'; }
    for (const listener of this.listeners) listener(this.snapshot());
  }
  context(game) { return {year:game.draft.year,phase:game.draft.phase,actor:currentTurn(game).role}; }
  attach(game) {
    const row = this.active();
    if (row && (!game || row.project !== this.config.url || row.payload.p_session.game_version !== game.version || row.actionCount !== game.actions.length || JSON.stringify(row.payload.p_codes) !== JSON.stringify(game.setup.studentCodes))) {
      this.state.activeId = null;
      this.state.currentRecordId = null;
    }
    if (game) this.game = game;
    this.visibleSince = this.now();
    this.persist();
  }
  begin(game,minutes) {
    if (!this.config.enabled || !this.transport || !hasStudentCodes(game.setup) || game.actions.length) return false;
    if (this.active()) this.finish('restarted');
    const row = {project:this.config.url,actionCount:0,ack:0,visibleMs:0,payload:{
      p_session:{id:this.uuid(),study:this.config.study,game_version:game.version,consent_version:CONSENT_VERSION,
        started_at:new Date(this.now()).toISOString(),outcome:'in_progress',timer_minutes:minutes},
      p_codes:structuredClone(game.setup.studentCodes),p_events:[],p_rounds:[],
    }};
    this.state.sessions.push(row); this.state.activeId = row.payload.p_session.id; this.state.currentRecordId = this.state.activeId; this.game = game;
    this.visibleSince = this.now(); this.record('session_started');
    return true;
  }
  record(kind,data={},actor,actionType=null) {
    const row = this.active();
    if (!row || !this.game) return;
    if (row.payload.p_events.length >= 5000) { this.status = 'queue_full'; this.state.activeId = null; this.persist(); return; }
    const time = this.now();
    row.visibleMs += this.visible ? Math.max(0,time-this.visibleSince) : 0; this.visibleSince = time;
    const elapsed = Math.max(0,Math.min(604800000,time-Date.parse(row.payload.p_session.started_at)));
    row.payload.p_events.push({...this.context(this.game),actor:actor || this.context(this.game).actor,
      seq:row.payload.p_events.length+1,kind,data,action_type:actionType,elapsed_ms:elapsed,visible_elapsed_ms:Math.min(elapsed,row.visibleMs)});
    this.status = 'pending'; this.persist(); this.queue();
  }
  applied(before,after,actions) {
    if (!this.active()) return;
    this.game = before;
    for (const frame of committedFrames(before,after)) {
      this.game={...before,draft:{...before.draft,year:frame.year,phase:frame.phase}};
      this.record('engine_action',actionData(frame.action),frame.action.actor,frame.action.type);
    }
    const row = this.active();
    if (!row) return;
    row.actionCount = after.actions.length; row.payload.p_rounds = roundData(after); this.game = after;
    if (outcome(after) !== 'in_progress') this.finish(outcome(after));
    else this.persist();
  }
  rejected(action) { if (Object.hasOwn(ACTION_FIELDS,action?.type)) this.record('action_rejected',{},undefined,action.type); }
  setVisible(visible) { this.record('visibility_changed',{visible}); this.visible = visible; this.visibleSince = this.now(); }
  setMinutes(minutes) { const row = this.active(); if (row) { row.payload.p_session.timer_minutes = minutes; this.record('timer_changed',{minutes}); } }
  finish(result='restarted') {
    const row = this.active(); if (!row) return;
    row.payload.p_session.outcome = result;
    this.record(result === 'restarted' ? 'session_restarted' : 'session_finished');
    this.state.activeId = null; this.persist();
  }
  withdraw() {
    const id = this.state.activeId;
    this.state.sessions = this.state.sessions.filter(row=>row.payload.p_session.id !== id);
    this.state.activeId = null; this.state.currentRecordId = null; this.status = 'stopped'; this.persist();
  }
  unrecorded(game) { this.state.activeId = null; this.state.currentRecordId = null; this.game = game; this.status = 'idle'; this.persist(); }
  queue(delay=1500) { this.cancel(this.timer); this.timer = this.schedule(()=>this.flush(),delay); }
  async flush() {
    if (this.sending || !this.transport || !this.snapshot().pending) return;
    this.sending = true;
    try {
      for (const row of [...this.state.sessions]) {
        if (row.ack >= row.payload.p_events.length || row.project !== this.config.url) continue;
        const payload = structuredClone(row.payload), revision = payload.p_events.length;
        this.status = 'sending'; this.persist();
        const acknowledged = await this.transport(payload);
        if (!Number.isInteger(acknowledged) || acknowledged < revision) throw Error('Unacknowledged research batch');
        const live = this.state.sessions.find(item=>item.payload.p_session.id === payload.p_session.id);
        if (live) {
          live.ack = revision;
          if (payload.p_session.id === this.state.currentRecordId) this.state.confirmedId = payload.p_session.id;
          if (this.state.activeId !== payload.p_session.id && live.ack === live.payload.p_events.length) this.state.sessions = this.state.sessions.filter(item=>item !== live);
        }
      }
      this.status = this.snapshot().pending ? 'pending' : 'saved'; this.persist();
    } catch { this.status = 'pending'; this.persist(); this.queue(15000); }
    finally { this.sending = false; }
    if (this.snapshot().pending) this.queue(15000);
  }
  dispose() { this.cancel(this.timer); }
}
