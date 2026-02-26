-- ResQAI Database Schema
-- Tables: profiles, analyses, alerts, state_risks

-- 1. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'viewer' check (role in ('admin', 'operator', 'viewer')),
  organization text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, organization)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'organization', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 2. Analyses table
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  area text not null,
  rainfall numeric not null,
  elevation numeric not null,
  population numeric not null,
  coastal_distance numeric,
  disaster_intensity numeric,
  risk_score numeric,
  risk_level text,
  confidence numeric,
  zone_risks jsonb,
  resources jsonb,
  shelters jsonb,
  created_at timestamptz default now()
);

alter table public.analyses enable row level security;
create policy "analyses_select_own" on public.analyses for select using (auth.uid() = user_id);
create policy "analyses_insert_own" on public.analyses for insert with check (auth.uid() = user_id);
create policy "analyses_delete_own" on public.analyses for delete using (auth.uid() = user_id);

-- 3. Alerts table (with realtime)
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  severity text default 'info' check (severity in ('info', 'warning', 'critical')),
  zone text,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.alerts enable row level security;
create policy "alerts_select_own" on public.alerts for select using (auth.uid() = user_id);
create policy "alerts_insert_own" on public.alerts for insert with check (auth.uid() = user_id);
create policy "alerts_update_own" on public.alerts for update using (auth.uid() = user_id);

-- 4. State risks table (publicly readable for the heatmap)
create table if not exists public.state_risks (
  id uuid primary key default gen_random_uuid(),
  state_name text not null unique,
  state_code text not null unique,
  risk_score numeric default 0,
  risk_level text default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  last_updated timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

alter table public.state_risks enable row level security;
create policy "state_risks_select_all" on public.state_risks for select using (true);
create policy "state_risks_insert_auth" on public.state_risks for insert with check (auth.uid() is not null);
create policy "state_risks_update_auth" on public.state_risks for update using (auth.uid() is not null);
