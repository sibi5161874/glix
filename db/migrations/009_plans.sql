-- 009: Plans — superadmin-editable tiers, seeded from shared/config/tiers.config.ts
-- -------------------------------------------------------------------
-- Note: 002_organizations.sql added `organizations.tier text` before this table
-- existed. We cannot edit a pushed migration (RULES.md §1), so this migration
-- adds `plan_id` as the new source of truth, backfills it from `tier`, and keeps
-- `tier` as a deprecated, denormalized mirror (kept in sync by trigger below)
-- so nothing already reading `organizations.tier` breaks.

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext unique not null check (slug in ('free', 'pro', 'enterprise')),
  max_employees integer not null,
  max_storage_mb integer not null,
  price_aed numeric(10, 2) not null default 0,
  price_usd numeric(10, 2) not null default 0,
  price_sar numeric(10, 2) not null default 0,
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger plans_set_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

create index plans_is_active_idx on public.plans(is_active);

alter table public.plans enable row level security;

create policy "plans_select_active_or_admin"
  on public.plans for select
  using (is_active = true or public.is_platform_admin());

create policy "plans_write_admin"
  on public.plans for insert
  with check (public.is_platform_admin());

create policy "plans_update_admin"
  on public.plans for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "plans_delete_admin"
  on public.plans for delete
  using (public.is_platform_admin());

-- Seed the 3 tiers (mirrors shared/config/tiers.config.ts — update both on change).
insert into public.plans
  (slug, name, max_employees, max_storage_mb, price_aed, price_usd, price_sar, features, sort_order)
values
  ('free', 'Starter', 25, 500, 0, 0, 0,
    '{"bulkImport": false, "customRoles": false, "apiAccess": false, "sso": false, "customBranding": false, "whatsappAlerts": false, "advancedReports": false}'::jsonb,
    1),
  ('pro', 'Growth', 250, 10000, 299, 81, 305,
    '{"bulkImport": true, "customRoles": true, "apiAccess": false, "sso": false, "customBranding": true, "whatsappAlerts": true, "advancedReports": true}'::jsonb,
    2),
  ('enterprise', 'Enterprise', 0, 0, 0, 0, 0,
    '{"bulkImport": true, "customRoles": true, "apiAccess": true, "sso": true, "customBranding": true, "whatsappAlerts": true, "advancedReports": true}'::jsonb,
    3)
on conflict (slug) do nothing;

-- ── organizations.plan_id — new source of truth for tier ──────────────
alter table public.organizations add column plan_id uuid references public.plans(id);

update public.organizations o
set plan_id = p.id
from public.plans p
where o.plan_id is null and p.slug = o.tier;

alter table public.organizations alter column plan_id set not null;

create index organizations_plan_id_idx on public.organizations(plan_id);

comment on column public.organizations.tier is
  'Deprecated: use plan_id -> plans.slug instead. Kept in sync by organizations_sync_tier for backward compatibility; do not read in new code.';

create or replace function public.organizations_sync_tier()
returns trigger
language plpgsql
as $$
begin
  select p.slug into new.tier from public.plans p where p.id = new.plan_id;
  return new;
end;
$$;

create trigger organizations_sync_tier_trigger
  before insert or update of plan_id on public.organizations
  for each row execute function public.organizations_sync_tier();
