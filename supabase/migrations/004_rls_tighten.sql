-- Tighten Row Level Security and admin controls for CHALLENGER

-- admin_users table (optional) to allow JWT-based admin recognition
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  auth_uid text unique,
  email text unique,
  role text default 'admin',
  created_at timestamptz default now()
);

-- restrict more tables and add selective policies

-- lectures: public read, admin insert/update/delete OR creators
alter table lectures enable row level security;
create policy "lectures_public_read" on lectures for select using (true);
create policy "lectures_insert_admin_or_service" on lectures for insert using (auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()));
create policy "lectures_update_admin_or_owner" on lectures for update using (auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()) OR created_by::text = auth.uid());
create policy "lectures_delete_admin_or_owner" on lectures for delete using (auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()) OR created_by::text = auth.uid());

-- resources: owner only for modify; public read only metadata
alter table resources enable row level security;
create policy "resources_public_select" on resources for select using (true);
create policy "resources_insert_owner_check" on resources for insert with check (profile_id::text = auth.uid() OR auth.role() = 'service');
create policy "resources_update_owner" on resources for update using (profile_id::text = auth.uid() OR auth.role() = 'service');
create policy "resources_delete_owner" on resources for delete using (profile_id::text = auth.uid() OR auth.role() = 'service');

-- notifications: owner only
alter table notifications enable row level security;
create policy "notifications_owner" on notifications for all using (profile_id::text = auth.uid());

-- votes: allow vote insert if authenticated; prevent multiple votes by unique constraint ideally
alter table votes enable row level security;
create policy "votes_insert_auth" on votes for insert with check (profile_id::text = auth.uid());
create policy "votes_select_public" on votes for select using (true);

-- announcements: admin only insert/update/delete, public select
alter table announcements enable row level security;
create policy "announcements_public" on announcements for select using (true);
create policy "announcements_admin" on announcements for insert, update, delete using (auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()));

-- doubts: public select, owner insert/update; replies owner insert
alter table doubts enable row level security;
create policy "doubts_public_select" on doubts for select using (true);
create policy "doubts_insert_owner" on doubts for insert with check (profile_id::text = auth.uid());
create policy "doubts_update_owner" on doubts for update using (profile_id::text = auth.uid());

alter table doubt_replies enable row level security;
create policy "doubt_replies_public" on doubt_replies for select using (true);
create policy "doubt_replies_insert_owner" on doubt_replies for insert with check (profile_id::text = auth.uid());
create policy "doubt_replies_update_owner" on doubt_replies for update using (profile_id::text = auth.uid());

-- test_attempts & test_answers: owner only
alter table test_attempts enable row level security;
create policy "test_attempts_owner_only" on test_attempts for all using (profile_id::text = auth.uid());

alter table test_answers enable row level security;
create policy "test_answers_owner_only" on test_answers for select using (exists(select 1 from test_attempts ta where ta.id = attempt_id and ta.profile_id::text = auth.uid()));

-- mistakes: owner only
alter table mistakes enable row level security;
create policy "mistakes_owner_only" on mistakes for all using (profile_id::text = auth.uid());

-- xp_transactions: owner only and admin insert
alter table xp_transactions enable row level security;
create policy "xp_transactions_owner" on xp_transactions for select using (profile_id::text = auth.uid());
create policy "xp_transactions_insert_admin_or_owner" on xp_transactions for insert with check (profile_id::text = auth.uid() OR auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()));

-- profiles: allow select of public username but restrict sensitive fields
alter table profiles enable row level security;
create policy "profiles_public_select" on profiles for select using (true);
create policy "profiles_update_owner" on profiles for update using (auth.uid() = auth_uid) with check (auth.uid() = auth_uid);

-- admin_users: allow admin users to be managed only by service_role or existing admins
alter table admin_users enable row level security;
create policy "admin_users_manage_service_or_admin" on admin_users for all using (auth.role() = 'service' OR exists (select 1 from admin_users au where au.auth_uid = auth.uid()));

-- NOTES:
-- 1) These policies provide a conservative baseline. Review them in the Supabase SQL editor and adjust per your security model.
-- 2) Use SUPABASE_SERVICE_ROLE_KEY for server-side admin actions only. Never expose it to the browser.
