-- Admit consented team aliases and explicit avatar choices in the first research event.
begin;
alter table research.sessions drop constraint sessions_consent_version_check;
alter table research.sessions add constraint sessions_consent_version_check
  check (consent_version in ('2026-11-01', '2026-11-03'));

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
      when 'submitBids' then array[]::text[] when 'finishSales' then array[]::text[] when 'close' then array[]::text[] when 'next' then array[]::text[] else null end;
    if allowed is null then return false; end if;
    allowed := array_append(allowed,'origin');
  elsif p_kind = 'session_started' then allowed := array['team_alias','avatar_genders'];
  elsif p_kind = 'timer_changed' then allowed := array['minutes'];
  elsif p_kind = 'view_opened' then allowed := array['view'];
  elsif p_kind = 'visibility_changed' then allowed := array['visible'];
  else allowed := array[]::text[];
  end if;
  for k,v in select * from jsonb_each(p_data) loop
    if not k = any(allowed) then return false; end if;
    if k = 'team_alias' then
      if jsonb_typeof(v) <> 'string' or v #>> '{}' not in ('pallet_town','hyrule','wakanda','springfield','gravity_falls') then
        return false;
      end if;
    elsif k = 'avatar_genders' then
      if jsonb_typeof(v) <> 'object' then return false; end if;
      if exists (
        select 1 from jsonb_each(v) as choice(role, gender)
        where role not in ('Estado','A','B','C','F1','F2')
           or jsonb_typeof(gender) <> 'string'
           or gender #>> '{}' not in ('woman','man','other')
      ) then return false; end if;
    elsif k = 'origin' then
      if v <> '"system"'::jsonb then return false; end if;
    elsif k in ('tax','subsidy','quantity','price','minutes') then
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

commit;
