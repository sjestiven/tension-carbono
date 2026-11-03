-- Run in the owner's SQL Editor. These queries are not public API endpoints.
-- Replace pilot-2026 with the cohort/study being analyzed. Validation data is excluded.

-- 1. Completion, explicit restart, and unresolved sessions by release.
select game_version,outcome,count(*) as sessions
from research.sessions where study = 'pilot-2026'
group by game_version,outcome order by game_version,outcome;

-- 2. Identified decision log. Keep this export restricted to the research team.
select s.id as session_id,s.started_at,profile.data->>'team_alias' as team_alias,
       profile.data->'avatar_genders'->>e.actor as initial_avatar_gender,e.seq,e.year,e.phase,e.actor,
       p.student_code,e.kind,e.action_type,coalesce(e.data->>'origin','player') as decision_origin,e.data,e.elapsed_ms,e.visible_elapsed_ms
from research.sessions s join research.events e on e.session_id=s.id
left join research.events profile on profile.session_id=s.id and profile.seq=1 and profile.kind='session_started'
left join research.participants p on p.session_id=e.session_id and p.role=e.actor
where s.study='pilot-2026'
order by s.started_at,s.id,e.seq;

-- 3. Production choices by year and role, without student identifiers.
select s.game_version,e.year,e.actor,(e.data->>'quantity')::numeric as production,count(*) as selections
from research.events e join research.sessions s on s.id=e.session_id
where s.study='pilot-2026' and e.kind='engine_action' and e.action_type='production'
group by s.game_version,e.year,e.actor,e.data->>'quantity' order by s.game_version,e.year,e.actor,production;

-- 4. Annual physical and fiscal outcomes, directly from the game engine.
select s.id as session_id,s.game_version,s.outcome,r.*
from research.sessions s join research.rounds r on r.session_id=s.id
where s.study='pilot-2026' order by s.started_at,r.year;

-- 5. Help use and rejected actions by role/phase. No free-text errors are collected.
select s.game_version,e.year,e.phase,e.actor,e.kind,e.action_type,count(*) as occurrences
from research.events e join research.sessions s on s.id=e.session_id
where s.study='pilot-2026' and e.kind in ('help_opened','action_rejected')
group by s.game_version,e.year,e.phase,e.actor,e.kind,e.action_type order by occurrences desc;

-- 6. Time between observable events, not a measure of attention or understanding.
with intervals as (
  select s.game_version,e.*,e.visible_elapsed_ms-lag(e.visible_elapsed_ms) over(partition by e.session_id order by e.seq) as observed_interval_ms
  from research.events e join research.sessions s on s.id=e.session_id where s.study='pilot-2026'
)
select game_version,year,phase,actor,kind,count(*) as observations,avg(observed_interval_ms)/1000 as average_visible_seconds
from intervals where observed_interval_ms >= 0
group by game_version,year,phase,actor,kind order by game_version,year,phase,actor;

-- 7. Offer reconstruction for engines 2.2 and 3.0: their ID counter advances on project
-- additions and proposals. Live collection starts before the first action.
with numbered as (
  select e.*,s.game_version,count(*) filter(where e.kind='engine_action' and e.action_type in ('addProject','propose'))
    over(partition by e.session_id order by e.seq) as engine_sequence
  from research.events e join research.sessions s on s.id=e.session_id
  where s.study='pilot-2026' and s.game_version in ('2.2.0','3.0.0','3.1.0')
), proposals as (
  select *,concat('C-',year,'-',engine_sequence) as contract_id
  from numbered where kind='engine_action' and action_type='propose'
)
select p.session_id,p.game_version,p.year,p.contract_id,p.data->>'company' as company,p.data->>'foundation' as foundation,
       (p.data->>'quantity')::numeric as quantity,(p.data->>'price')::numeric as unit_price,
       exists(select 1 from numbered a where a.session_id=p.session_id and a.kind='engine_action' and a.action_type='accept' and a.data->>'id'=p.contract_id) as accepted,
       (p.game_version='2.2.0' or exists(
         select 1 from numbered b where b.session_id=p.session_id and b.year=p.year and b.kind='engine_action' and b.action_type='submitBids' and b.actor=p.data->>'company' and b.seq>p.seq
         and not exists(select 1 from numbered d where d.session_id=p.session_id and d.kind='engine_action' and d.action_type='cancel' and d.data->>'id'=p.contract_id and d.seq<b.seq))) as submitted,
       (exists(select 1 from numbered c where c.session_id=p.session_id and c.kind='engine_action' and c.action_type='cancel' and c.data->>'id'=p.contract_id)
        or (not exists(select 1 from numbered a where a.session_id=p.session_id and a.kind='engine_action' and a.action_type='accept' and a.data->>'id'=p.contract_id)
            and exists(select 1 from numbered f where f.session_id=p.session_id and f.year=p.year and f.kind='engine_action' and f.action_type='finishSales' and f.actor=p.data->>'foundation' and f.seq>p.seq))) as cancelled_or_rejected
from proposals p order by p.session_id,p.seq;
