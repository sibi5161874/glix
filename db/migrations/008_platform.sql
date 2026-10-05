-- 008: Platform scope — superadmin team, global settings, notification templates
-- -------------------------------------------------------------------

create table public.platform_users (
  id uuid primary key references public.users(id) on delete cascade,
  email citext unique not null,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'support')),
  created_at timestamptz not null default now()
);

create index platform_users_role_idx on public.platform_users(role);

alter table public.platform_users enable row level security;

create policy "platform_users_select_self_or_admin"
  on public.platform_users for select
  using (id = public.current_user_id() or public.is_platform_admin());

create policy "platform_users_write_admin"
  on public.platform_users for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ── platform_settings ────────────────────────────────────────────────
create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.platform_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger platform_settings_set_updated_at
  before update on public.platform_settings
  for each row execute function public.set_updated_at();

alter table public.platform_settings enable row level security;

create policy "platform_settings_select_admin_or_public"
  on public.platform_settings for select
  using (
    public.is_platform_admin()
    or key like 'landing.%'
    or key like 'legal.%'
  );

create policy "platform_settings_write_admin"
  on public.platform_settings for insert
  with check (public.is_platform_admin());

create policy "platform_settings_update_admin"
  on public.platform_settings for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "platform_settings_delete_admin"
  on public.platform_settings for delete
  using (public.is_platform_admin());

-- ── notification_templates ────────────────────────────────────────────
create table public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp')),
  key text not null,
  subject text,
  body text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- One platform default per (channel, key); one override per (org, channel, key).
create unique index notification_templates_platform_key_idx
  on public.notification_templates(channel, key) where org_id is null;
create unique index notification_templates_org_key_idx
  on public.notification_templates(org_id, channel, key) where org_id is not null;
create index notification_templates_org_id_idx on public.notification_templates(org_id);

alter table public.notification_templates enable row level security;

create policy "notification_templates_select_defaults_or_org"
  on public.notification_templates for select
  using (
    org_id is null
    or org_id = public.current_org_id()
    or public.is_platform_admin()
  );

create policy "notification_templates_write_admin"
  on public.notification_templates for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "notification_templates_update_admin"
  on public.notification_templates for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "notification_templates_delete_admin"
  on public.notification_templates for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
