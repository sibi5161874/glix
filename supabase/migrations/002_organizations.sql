-- 002: Organizations (tenants) + users profile mirror
-- -------------------------------------------------------------------

-- Mirror of auth.users so we can FK from tenant tables
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Auto-create public.users row when auth.users row is created
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Organizations (tenants)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext unique not null,
  owner_id uuid not null references public.users(id) on delete restrict,
  tier text not null default 'free' check (tier in ('free','pro')),
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create index organizations_owner_id_idx on public.organizations(owner_id);
create index organizations_slug_idx on public.organizations(slug);
create index organizations_tier_idx on public.organizations(tier);
