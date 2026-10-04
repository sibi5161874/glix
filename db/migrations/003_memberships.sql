-- 003: Memberships — who belongs to which org, with what role
-- -------------------------------------------------------------------

create type public.org_role as enum ('org_admin', 'org_staff', 'org_viewer');

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.org_role not null default 'org_staff',
  invited_by uuid references public.users(id) on delete set null,
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- Critical indexes for RLS performance (see §Performance below)
create index memberships_user_id_idx on public.memberships(user_id);
create index memberships_org_id_idx on public.memberships(org_id);
create index memberships_org_user_idx on public.memberships(org_id, user_id);

-- Owner is automatically an admin of their org
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.memberships (org_id, user_id, role, accepted_at)
  values (new.id, new.owner_id, 'org_admin', now())
  on conflict (org_id, user_id) do nothing;
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();
