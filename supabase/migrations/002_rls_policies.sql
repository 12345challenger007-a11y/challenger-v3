-- RLS: lock down sensitive tables
-- Enable RLS on user-personal tables
alter table profiles enable row level security;
alter table lecture_progress enable row level security;
alter table test_attempts enable row level security;
alter table test_answers enable row level security;
alter table mistakes enable row level security;
alter table study_plans enable row level security;
alter table study_progress enable row level security;
alter table notifications enable row level security;
alter table user_achievements enable row level security;
alter table xp_transactions enable row level security;
alter table resources enable row level security;
alter table bookmarks enable row level security;
alter table doubts enable row level security;
alter table doubt_replies enable row level security;
-- Example policy: allow users to insert their own profile (server side should create)
create policy "profiles_allow_insert_for_service" on profiles
  for insert using (auth.role() = 'service') with check (true);

-- Allow users to select/update their own profile
create policy "profiles_select_update_owner" on profiles
  for select using (auth.uid() = auth_uid) ;
create policy "profiles_update_owner" on profiles
  for update using (auth.uid() = auth_uid) with check (auth.uid() = auth_uid);

-- lecture_progress: allow owner
create policy "lecture_progress_owner" on lecture_progress
  for all using (profile_id::text = auth.uid());

-- test_attempts: owner only
create policy "test_attempts_owner" on test_attempts
  for all using (profile_id::text = auth.uid());

-- mistakes: owner only
create policy "mistakes_owner" on mistakes
  for all using (profile_id::text = auth.uid());

-- doubts: allow public read, owner insert/update
create policy "doubts_public_read" on doubts
  for select using (true);

create policy "doubts_insert_owner" on doubts
  for insert with check (profile_id::text = auth.uid());

create policy "doubts_update_owner" on doubts
  for update using (profile_id::text = auth.uid());

-- Admin: use service_role key for admin operations. Do NOT expose it to clients.
