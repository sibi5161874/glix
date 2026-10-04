-- 006: RLS policies — session-variable based tenant isolation
-- -------------------------------------------------------------------

-- ── Enable RLS everywhere ─────────────────────────────────────────
alter table public.users         enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships   enable row level security;
alter table public.audit_log     enable row level security;

-- ── Helper functions reading from session variables set by the backend
create or replace function public.current_user_id()
returns uuid language sql stable as $$
  select nullif(current_setting('app.user_id', true), '')::uuid;
$$;

create or replace function public.current_org_id()
returns uuid language sql stable as $$
  select nullif(current_setting('app.org_id', true), '')::uuid;
$$;

create or replace function public.current_role()
returns text language sql stable as $$
  select nullif(current_setting('app.role', true), '');
$$;

create or replace function public.current_employee_id()
returns uuid language sql stable as $$
  select nullif(current_setting('app.employee_id', true), '')::uuid;
$$;

create or replace function public.is_platform_admin()
returns boolean language sql stable as $$
  select coalesce(nullif(current_setting('app.is_platform_admin', true), '')::boolean, false);
$$;

-- ── users ─────────────────────────────────────────────────────────
create policy "users_select_self_or_org"
  on public.users for select
  using (
    id = public.current_user_id()
    or exists (
      select 1 from public.memberships m
      where m.user_id = public.users.id
        and m.org_id = public.current_org_id()
        and m.accepted_at is not null
    )
    or public.is_platform_admin()
  );

create policy "users_update_self"
  on public.users for update
  using (id = public.current_user_id())
  with check (id = public.current_user_id());

-- ── organizations ─────────────────────────────────────────────────
create policy "orgs_select_member"
  on public.organizations for select
  using (
    id = public.current_org_id()
    or owner_id = public.current_user_id()
    or public.is_platform_admin()
  );

create policy "orgs_insert_self_owner"
  on public.organizations for insert
  with check (
    owner_id = public.current_user_id()
    or public.is_platform_admin()
  );

create policy "orgs_update_admin_or_owner"
  on public.organizations for update
  using (
    public.is_platform_admin()
    or (id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── memberships ───────────────────────────────────────────────────
create policy "memberships_select_same_org"
  on public.memberships for select
  using (
    org_id = public.current_org_id()
    or user_id = public.current_user_id()
    or public.is_platform_admin()
  );

create policy "memberships_insert_admin"
  on public.memberships for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "memberships_update_admin"
  on public.memberships for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "memberships_delete_admin"
  on public.memberships for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── audit_log ─────────────────────────────────────────────────────
create policy "audit_select_admin_or_owner"
  on public.audit_log for select
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (public.current_user_id() is not null);

create policy "audit_no_update" on public.audit_log for update using (false);
create policy "audit_no_delete" on public.audit_log for delete using (false);
