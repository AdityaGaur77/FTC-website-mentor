-- =============================================================================
-- Relay for FTC — database schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> Run.
-- Safe to re-run: every statement is guarded.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- profiles — one row per account, created automatically at signup.
-- auth.users is managed by Supabase and cannot be queried from the browser,
-- so this is the table the app reads for names and account types.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  full_name    text,
  account_type text not null default 'team' check (account_type in ('team', 'mentor')),
  team_number  text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Signed-in users can see each other (the mentor directory needs this).
drop policy if exists "profiles are readable by signed-in users" on public.profiles;
create policy "profiles are readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

-- But you may only ever write your own row.
drop policy if exists "users insert their own profile" on public.profiles;
create policy "users insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- -----------------------------------------------------------------------------
-- Create the profile row whenever someone signs up.
-- full_name / account_type arrive from the `options.data` passed to signUp().
-- security definer lets the trigger write past RLS; the empty search_path is
-- the hardening Supabase recommends, so every name below is fully qualified.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, account_type)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'account_type', 'team')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- mentor_applications — submissions from the /join page, pending review.
-- -----------------------------------------------------------------------------
create table if not exists public.mentor_applications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  role       text not null check (role in ('student', 'adult')),
  full_name  text not null,
  email      text not null,
  experience text not null,
  skills     text[] not null default '{}',
  status     text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.mentor_applications enable row level security;

-- You can read and file your own application, and nobody else's.
drop policy if exists "users read their own applications" on public.mentor_applications;
create policy "users read their own applications"
  on public.mentor_applications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users file their own applications" on public.mentor_applications;
create policy "users file their own applications"
  on public.mentor_applications for insert
  to authenticated
  with check (auth.uid() = user_id);

create index if not exists mentor_applications_user_id_idx
  on public.mentor_applications (user_id);


-- =============================================================================
-- Reviewing applications: RLS blocks the browser from reading other people's
-- rows on purpose. Review them in the dashboard (Table Editor), which uses the
-- service role and bypasses RLS. When you want an in-app admin screen, add an
-- `is_admin boolean` to profiles and an extra select policy that checks it.
-- =============================================================================
