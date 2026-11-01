-- Run once in the project's SQL Editor. All research tables remain private.
begin;
create schema if not exists research;
revoke all on schema research from public, anon, authenticated;

create table if not exists research.sessions (
  id uuid primary key,
  owner_id uuid not null,
  study text not null check (length(study) between 1 and 60),
  game_version text not null check (length(game_version) between 1 and 20),
  consent_version text not null check (consent_version = '2026-11-01'),
  started_at timestamptz not null,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  outcome text not null check (outcome in ('in_progress','completed','climate_defeat','restarted')),
  timer_minutes integer not null check (timer_minutes in (12,8,4)),
  revision integer not null default 0 check (revision between 0 and 5000)
);
create table if not exists research.participants (
  session_id uuid not null references research.sessions(id) on delete cascade,
  role text not null check (role in ('Estado','A','B','C','F1','F2')),
  student_code text not null check (length(btrim(student_code)) between 1 and 40),
  primary key(session_id,role)
);
create table if not exists research.events (
  session_id uuid not null references research.sessions(id) on delete cascade,
  seq integer not null check (seq between 1 and 5000),
  kind text not null check (kind in ('session_started','engine_action','action_rejected','cabin_opened','help_opened','view_opened','timer_changed','visibility_changed','session_finished','session_restarted')),
  year integer not null check (year between 1 and 4),
  phase text not null check (phase in ('policy','projects','verification','market','results')),
  actor text not null check (actor in ('Estado','A','B','C','F1','F2','Docente')),
  elapsed_ms bigint not null check (elapsed_ms between 0 and 604800000),
  visible_elapsed_ms bigint not null check (visible_elapsed_ms between 0 and elapsed_ms),
  action_type text,
  data jsonb not null default '{}',
  received_at timestamptz not null default now(),
  primary key(session_id,seq)
);
create table if not exists research.rounds (
  session_id uuid not null references research.sessions(id) on delete cascade,
  year integer not null check (year between 1 and 4),
  emissions numeric not null check (emissions between 0 and 10000),
  cumulative_emissions numeric not null check (cumulative_emissions between 0 and 40000),
  production numeric not null check (production between 0 and 10000),
  tax numeric not null check (tax between 0 and 1000000),
  fund numeric not null check (fund between 0 and 1000000),
  credits numeric not null check (credits between 0 and 10000),
  reduction numeric not null check (reduction between 0 and 10000),
  tax_rate numeric not null check (tax_rate between 20 and 40),
  subsidy numeric not null check (subsidy between 0 and 50),
  primary key(session_id,year)
);
alter table research.sessions enable row level security;
alter table research.participants enable row level security;
alter table research.events enable row level security;
alter table research.rounds enable row level security;
revoke all on all tables in schema research from public, anon, authenticated;
create index if not exists research_sessions_study_time on research.sessions(study,started_at);
create index if not exists research_events_kind_year on research.events(kind,year);

create or replace function research.valid_event_data(p_kind text,p_action text,p_data jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare allowed text[]; k text; v jsonb;
begin
  if jsonb_typeof(p_data) <> 'object' then return false; end if;
  if p_kind = 'engine_action' then
    allowed := case p_action
      when 'policy' then array['tax','subsidy'] when 'subsidy' then array['subsidy']
      when 'production' then array['quantity'] when 'confirmProduction' then array['lock']
      when 'addProject' then array['project'] when 'removeProject' then array['id']
      when 'verify' then array['foundation','verified'] when 'publishQuote' then array['price']
      when 'propose' then array['company','foundation','quantity','price']
      when 'accept' then array['id'] when 'cancel' then array['id']
      when 'publish' then array[]::text[] when 'confirmProjects' then array[]::text[]
      when 'confirmGrants' then array[]::text[] when 'execute' then array[]::text[]
      when 'openMarket' then array[]::text[] when 'finishFoundationTurn' then array[]::text[]
      when 'reopenNegotiation' then array[]::text[] when 'confirmCompany' then array[]::text[]
      when 'close' then array[]::text[] when 'next' then array[]::text[] else null end;
    if allowed is null then return false; end if;
  elsif p_kind = 'timer_changed' then allowed := array['minutes'];
  elsif p_kind = 'view_opened' then allowed := array['view'];
  elsif p_kind = 'visibility_changed' then allowed := array['visible'];
  else allowed := array[]::text[];
  end if;
  for k,v in select * from jsonb_each(p_data) loop
    if not k = any(allowed) then return false; end if;
    if k in ('tax','subsidy','quantity','price','minutes') then
      if k = 'price' and v = 'null'::jsonb then continue; end if;
      if jsonb_typeof(v) <> 'number' or (v::text)::numeric not between 0 and 10000 then return false; end if;
      if k = 'minutes' and (v::text)::numeric not in (12,8,4) then return false; end if;
    elsif k in ('lock','verified','visible') then
      if jsonb_typeof(v) <> 'boolean' then return false; end if;
    elsif k = 'company' then
      if v #>> '{}' not in ('A','B','C') then return false; end if;
    elsif k = 'foundation' then
      if v #>> '{}' not in ('F1','F2') then return false; end if;
    elsif k = 'project' then
      if v #>> '{}' not in ('P1','P2') then return false; end if;
    elsif k = 'view' then
      if v #>> '{}' not in ('home','table','results','guide','teacher') then return false; end if;
    elsif k = 'id' then
      if jsonb_typeof(v) <> 'string' or (v #>> '{}') !~ '^[PC]-[1-4]-[0-9]{1,8}$' then return false; end if;
    end if;
  end loop;
  return true;
end; $$;
revoke all on function research.valid_event_data(text,text,jsonb) from public,anon,authenticated;

create or replace function public.record_research_session(p_session jsonb,p_codes jsonb,p_events jsonb,p_rounds jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare sid uuid; caller uuid; stored research.sessions%rowtype; event_count integer; item jsonb; role_code text; position integer;
begin
  caller := auth.uid();
  if caller is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_session) <> 'object' or jsonb_typeof(p_codes) <> 'object'
     or jsonb_typeof(p_events) <> 'array' or jsonb_typeof(p_rounds) <> 'array' then raise exception 'Invalid payload'; end if;
  if octet_length(p_session::text || p_codes::text || p_events::text || p_rounds::text) > 524288 then raise exception 'Payload too large'; end if;
  sid := (p_session->>'id')::uuid;
  event_count := jsonb_array_length(p_events);
  if event_count not between 1 and 5000 or jsonb_array_length(p_rounds) > 4 then raise exception 'Invalid record count'; end if;
  if (select count(*) from jsonb_object_keys(p_codes)) <> 6 then raise exception 'Six student codes required'; end if;
  foreach role_code in array array['Estado','A','B','C','F1','F2'] loop
    if jsonb_typeof(p_codes->role_code) is distinct from 'string' or length(btrim(p_codes->>role_code)) not between 1 and 40 then raise exception 'Student code required'; end if;
  end loop;
  insert into research.sessions(id,owner_id,study,game_version,consent_version,started_at,outcome,timer_minutes)
  values(sid,caller,p_session->>'study',p_session->>'game_version',p_session->>'consent_version',(p_session->>'started_at')::timestamptz,p_session->>'outcome',(p_session->>'timer_minutes')::integer)
  on conflict(id) do nothing;
  select * into stored from research.sessions where id = sid for update;
  if stored.owner_id <> caller then raise exception 'Session unavailable'; end if;
  if stored.study <> p_session->>'study' or stored.game_version <> p_session->>'game_version'
     or stored.consent_version <> p_session->>'consent_version' then raise exception 'Session metadata cannot change'; end if;
  foreach role_code in array array['Estado','A','B','C','F1','F2'] loop
    insert into research.participants(session_id,role,student_code) values(sid,role_code,btrim(p_codes->>role_code)) on conflict do nothing;
    if not exists(select 1 from research.participants where session_id = sid and role = role_code and student_code = btrim(p_codes->>role_code)) then raise exception 'Student codes cannot change during collection'; end if;
  end loop;
  if event_count <= stored.revision then return stored.revision; end if;
  position := 0;
  for item in select * from jsonb_array_elements(p_events) loop
    position := position + 1;
    if (item->>'seq')::integer is distinct from position or not research.valid_event_data(item->>'kind',item->>'action_type',coalesce(item->'data','{}'::jsonb)) then raise exception 'Invalid event'; end if;
    insert into research.events(session_id,seq,kind,year,phase,actor,elapsed_ms,visible_elapsed_ms,action_type,data)
    values(sid,position,item->>'kind',(item->>'year')::integer,item->>'phase',item->>'actor',(item->>'elapsed_ms')::bigint,(item->>'visible_elapsed_ms')::bigint,item->>'action_type',coalesce(item->'data','{}'::jsonb)) on conflict do nothing;
  end loop;
  for item in select * from jsonb_array_elements(p_rounds) loop
    insert into research.rounds(session_id,year,emissions,cumulative_emissions,production,tax,fund,credits,reduction,tax_rate,subsidy)
    values(sid,(item->>'year')::integer,(item->>'emissions')::numeric,(item->>'cumulative_emissions')::numeric,(item->>'production')::numeric,(item->>'tax')::numeric,(item->>'fund')::numeric,(item->>'credits')::numeric,(item->>'reduction')::numeric,(item->>'tax_rate')::numeric,(item->>'subsidy')::numeric) on conflict do nothing;
  end loop;
  update research.sessions set revision = event_count,updated_at = now(),outcome = p_session->>'outcome',timer_minutes = (p_session->>'timer_minutes')::integer where id = sid;
  return event_count;
end; $$;
revoke all on function public.record_research_session(jsonb,jsonb,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.record_research_session(jsonb,jsonb,jsonb,jsonb) to authenticated;
comment on function public.record_research_session(jsonb,jsonb,jsonb,jsonb) is 'Write-only research ingestion. Requires Supabase Auth; no student data is returned.';
commit;
