-- 021: Controlled lookup functions for login (pre-authentication)
-- -------------------------------------------------------------------
-- Same reasoning as create_user() in 019: a login attempt has no session
-- context yet, so it can't satisfy users_select_self_or_org or the employees
-- select policy. These SECURITY DEFINER functions return exactly the columns
-- the login flow needs (never a full row, never a list), and EXECUTE is
-- granted only to glix_app.

create or replace function public.find_user_by_email(p_email citext)
returns table (id uuid, password_hash text, full_name text)
language sql
security definer
set search_path = public
as $$
  select u.id, u.password_hash, u.full_name
  from public.users u
  where u.email = p_email;
$$;

grant execute on function public.find_user_by_email(citext) to glix_app;

-- Dual login: employee_code + DOB (or a custom password, if ever set).
-- Only resolves employees already linked to a portal user (employees.user_id
-- not null) — auto-provisioning a user on an employee's first login is a
-- Phase 1 simplification deferred to a later pass (see .agents/_session.md).
create or replace function public.find_employee_login(p_employee_code text)
returns table (
  user_id uuid,
  password_hash text,
  dob date,
  employee_id uuid,
  org_id uuid,
  role text,
  employee_status text
)
language sql
security definer
set search_path = public
as $$
  select u.id, u.password_hash, e.dob, e.id, e.org_id, m.role::text, e.status
  from public.employees e
  join public.users u on u.id = e.user_id
  left join public.memberships m on m.org_id = e.org_id and m.user_id = u.id
  where e.employee_code = p_employee_code
  limit 2; -- cap: if >1 row comes back, the caller must treat it as ambiguous
$$;

grant execute on function public.find_employee_login(text) to glix_app;

comment on function public.find_employee_login(text) is
  'employee_code is unique per org, not globally — if the same code exists in
   two orgs this returns 2 rows and the caller must reject as ambiguous
   (no subdomain/org-scoping on login yet). Acceptable for Phase 1.';

-- Org signup (Flow 1, docs/legacy-analysis/02-user-flows.md): creates the
-- admin user and their organization atomically. owner_id = the user just
-- created inside the same function, so this isn't a blanket RLS bypass —
-- it's the one legitimate case where the row being inserted provably
-- belongs to the actor, before that actor has a session to prove it with.
create or replace function public.register_organization(
  p_email citext,
  p_password_hash text,
  p_full_name text,
  p_org_name text,
  p_org_slug citext,
  p_plan_slug text,
  p_currency text,
  p_phone text,
  p_industry text
)
returns table (user_id uuid, org_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_plan_id uuid;
begin
  select id into v_plan_id from public.plans where slug = p_plan_slug and is_active = true;
  if v_plan_id is null then
    raise exception 'invalid plan: %', p_plan_slug using errcode = '22023';
  end if;

  insert into public.users (email, password_hash, full_name)
  values (p_email, p_password_hash, p_full_name)
  returning id into v_user_id;

  insert into public.organizations (name, slug, owner_id, plan_id, currency, phone, industry)
  values (p_org_name, p_org_slug, v_user_id, v_plan_id, coalesce(p_currency, 'AED'), p_phone, p_industry)
  returning id into v_org_id;
  -- on_organization_created (003_memberships.sql, extended by
  -- 017_org_creation_trigger.sql) seeds the admin membership, default leave
  -- types, and default document types automatically.

  return query select v_user_id, v_org_id;
end;
$$;

grant execute on function public.register_organization(
  citext, text, text, text, citext, text, text, text, text
) to glix_app;
