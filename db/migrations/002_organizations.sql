-- 002: Users and Organizations (tenants)
-- -------------------------------------------------------------------

-- Users table
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  password_hash text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Organizations (tenants)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext unique not null,
  owner_id uuid not null references public.users(id) on delete restrict,
  tier text not null default 'free' check (tier in ('free','pro','enterprise')),
  currency text not null default 'AED',
  phone text,
  industry text,
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
