-- CHALLENGER initial schema
-- Use UUID extension
create extension if not exists "uuid-ossp";

-- profiles
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_uid text unique, -- supabase auth uid
  username text unique,
  full_name text,
  avatar_url text,
  class text,
  subjects jsonb default '[]'::jsonb,
  target_exam text,
  xp int default 0,
  level int default 1,
  streak int default 0,
  reputation int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_username on profiles(username);

-- subjects, chapters, topics
create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chapters (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) on delete cascade,
  name text not null,
  slug text,
  order_no int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists topics (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid references chapters(id) on delete cascade,
  name text not null,
  slug text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- lectures (YouTube links)
create table if not exists lectures (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  topic_id uuid references topics(id),
  youtube_id text,
  title text,
  description text,
  duration_seconds int,
  thumbnails jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- lecture progress
create table if not exists lecture_progress (
  id uuid primary key default uuid_generate_v4(),
  lecture_id uuid references lectures(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  watched_seconds int default 0,
  last_watched_at timestamptz,
  favorited boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- questions + options
create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id),
  chapter_id uuid references chapters(id),
  topic_id uuid references topics(id),
  content text not null,
  type text default 'mcq', -- mcq, sa, etc
  difficulty int default 2,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references questions(id) on delete cascade,
  content text,
  is_correct boolean default false,
  order_no int default 0
);

-- tests & test_questions
create table if not exists tests (
  id uuid primary key default uuid_generate_v4(),
  title text,
  subject_id uuid references subjects(id),
  chapter_id uuid references chapters(id),
  duration_seconds int default 600,
  total_questions int default 0,
  published boolean default false,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id) on delete cascade,
  question_id uuid references questions(id),
  order_no int default 0
);

-- attempts & answers
create table if not exists test_attempts (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id),
  profile_id uuid references profiles(id),
  started_at timestamptz default now(),
  ended_at timestamptz,
  score int default 0,
  correct int default 0,
  incorrect int default 0,
  time_taken_seconds int default 0,
  result jsonb,
  created_at timestamptz default now()
);

create table if not exists test_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid references test_attempts(id) on delete cascade,
  question_id uuid references questions(id),
  selected_option uuid references question_options(id),
  correct boolean,
  time_spent_seconds int default 0
);

-- mistakes
create table if not exists mistakes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  question_id uuid references questions(id),
  student_answer jsonb,
  correct_answer jsonb,
  topic_id uuid references topics(id),
  attempts int default 1,
  mastered boolean default false,
  last_seen timestamptz default now(),
  created_at timestamptz default now()
);

-- study_plans & progress
create table if not exists study_plans (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  plan jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists study_progress (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  topic_id uuid references topics(id),
  progress jsonb,
  mastery_percent int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- challenges
create table if not exists challenges (
  id uuid primary key default uuid_generate_v4(),
  title text,
  kind text,
  rules jsonb,
  reward_xp int default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists challenge_attempts (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid references challenges(id),
  profile_id uuid references profiles(id),
  score int,
  completed_at timestamptz default now()
);

-- battles
create table if not exists battles (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references tests(id),
  created_by uuid references profiles(id),
  state text default 'waiting', -- waiting, ongoing, finished
  created_at timestamptz default now()
);

create table if not exists battle_players (
  id uuid primary key default uuid_generate_v4(),
  battle_id uuid references battles(id) on delete cascade,
  profile_id uuid references profiles(id),
  score int default 0,
  joined_at timestamptz default now()
);

-- doubts & replies
create table if not exists doubts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  title text,
  body text,
  images jsonb default '[]'::jsonb,
  subject_id uuid references subjects(id),
  topic_id uuid references topics(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists doubt_replies (
  id uuid primary key default uuid_generate_v4(),
  doubt_id uuid references doubts(id) on delete cascade,
  profile_id uuid references profiles(id),
  body text,
  helpful_count int default 0,
  created_at timestamptz default now()
);

create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  target_type text, -- doubt, reply, resource
  target_id uuid,
  value int, -- 1 or -1
  created_at timestamptz default now()
);

-- bookmarks & resources
create table if not exists resources (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  title text,
  description text,
  storage_path text,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists bookmarks (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  target_type text,
  target_id uuid,
  created_at timestamptz default now()
);

-- notifications
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  type text,
  payload jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

-- achievements & xp_transactions
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  key text unique,
  title text,
  description text,
  badge_url text,
  created_at timestamptz default now()
);

create table if not exists user_achievements (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  achievement_id uuid references achievements(id),
  awarded_at timestamptz default now()
);

create table if not exists xp_transactions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  amount int,
  reason text,
  created_at timestamptz default now()
);

-- reports & announcements
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references profiles(id),
  target_type text,
  target_id uuid,
  reason text,
  created_at timestamptz default now()
);

create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text,
  body text,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes for lookups
create index if not exists idx_questions_subject on questions(subject_id);
create index if not exists idx_questions_topic on questions(topic_id);
create index if not exists idx_test_questions_test on test_questions(test_id);
create index if not exists idx_test_attempts_profile on test_attempts(profile_id);
create index if not exists idx_doubts_subject on doubts(subject_id);
