-- 006: RLS policies — the core of tenant isolation
-- -------------------------------------------------------------------

-- ── Enable RLS everywhere ─────────────────────────────────────────
alter table public.users         enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships   enable row level security;
alter table public.audit_log     enable row level security;
alter table public.project_owners enable row level security;

-- ── Helper functions (SECURITY DEFINER bypasses RLS internally) ───
create or replace function public.auth_org_id()
returns uuid
language sql
stable
as $$
  select (auth.jwt() ->> 'org_id')::uuid;
$$;

create or replace function public.auth_role()
returns text
language sql
stable
as $$
  select auth.jwt() ->> 'role';
$$;

create or replace function public.is_project_owner()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'is_project_owner')::boolean, false);
$$;

-- ── users ─────────────────────────────────────────────────────────
create policy "users_select_self_or_org"
  on public.users for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.memberships m
      where m.user_id = public.users.id
        and m.org_id = public.auth_org_id()
        and m.accepted_at is not null
    )
    or public.is_project_owner()
  );

create policy "users_update_self"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ── organizations ─────────────────────────────────────────────────
create policy "orgs_select_member"
  on public.organizations for select
  using (
    id = public.auth_org_id()
    or owner_id = auth.uid()
    or public.is_project_owner()
  );

create policy "orgs_insert_self_owner"
  on public.organizations for insert
  with check (owner_id = auth.uid());

create policy "orgs_update_admin_or_owner"
  on public.organizations for update
  using (
    public.is_project_owner()
    or (id = public.auth_org_id() and public.auth_role() = 'org_admin')
  )
  with check (
    public.is_project_owner()
    or (id = public.auth_org_id() and public.auth_role() = 'org_admin')
  );

-- ── memberships ───────────────────────────────────────────────────
create policy "memberships_select_same_org"
  on public.memberships for select
  using (
    org_id = public.auth_org_id()
    or user_id = auth.uid()
    or public.is_project_owner()
  );

create policy "memberships_insert_admin"
  on public.memberships for insert
  with check (
    public.is_project_owner()
    or (org_id = public.auth_org_id() and public.auth_role() = 'org_admin')
  );

create policy "memberships_update_admin"
  on public.memberships for update
  using (
    public.is_project_owner()
    or (org_id = public.auth_org_id() and public.auth_role() = 'org_admin')
  );

create policy "memberships_delete_admin"
  on public.memberships for delete
  using (
    public.is_project_owner()
    or (org_id = public.auth_org_id() and public.auth_role() = 'org_admin')
  );

-- ── audit_log ─────────────────────────────────────────────────────
create policy "audit_select_admin_or_owner"
  on public.audit_log for select
  using (
    public.is_project_owner()
    or (org_id = public.auth_org_id() and public.auth_role() = 'org_admin')
  );

-- Insert allowed for any authenticated user; app writes entries
create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (auth.uid() is not null);

-- Update/delete blocked by trigger (see migration 004), but double-guard:
create policy "audit_no_update" on public.audit_log for update using (false);
create policy "audit_no_delete" on public.audit_log for delete using (false);

-- ── project_owners ────────────────────────────────────────────────
create policy "po_select_self"
  on public.project_owners for select
  using (user_id = auth.uid() or public.is_project_owner());

-- No insert/update/delete via API — manage via service_role only.
