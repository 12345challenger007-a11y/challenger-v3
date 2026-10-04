-- Upsert mistake rpc
create or replace function upsert_mistake(p_profile_id uuid, p_question_uuid uuid)
returns void as $$
begin
  if exists(select 1 from mistakes where profile_id = p_profile_id and question_id = p_question_uuid) then
    update mistakes set attempts = attempts + 1, last_seen = now() where profile_id = p_profile_id and question_id = p_question_uuid;
  else
    insert into mistakes (profile_id, question_id, attempts, created_at, last_seen) values (p_profile_id, p_question_uuid, 1, now(), now());
  end if;
end;
$$ language plpgsql security definer;

create or replace function increment_profile_xp(p_profile_id uuid, p_xp int)
returns void as $$
begin
  update profiles set xp = coalesce(xp,0) + p_xp where id = p_profile_id;
end;
$$ language plpgsql security definer;
