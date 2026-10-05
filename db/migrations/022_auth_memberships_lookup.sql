-- 022: Resolve org/role for an email-based login
-- -------------------------------------------------------------------
-- After find_user_by_email() + password verification, the login flow still
-- needs to know which org(s) and role(s) that user belongs to, and whether
-- they're a platform admin — both memberships and platform_users are
-- RLS-protected in ways a pre-auth request can't satisfy. Same pattern as
-- 021_auth_functions.sql.

create or replace function public.find_user_memberships(p_user_id uuid)
returns table (org_id uuid, role text)
language sql
security definer
set search_path = public
as $$
  select m.org_id, m.role::text
  from public.memberships m
  where m.user_id = p_user_id and m.accepted_at is not null;
$$;

grant execute on function public.find_user_memberships(uuid) to glix_app;

create or replace function public.is_user_platform_admin(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.platform_users pu where pu.id = p_user_id);
$$;

grant execute on function public.is_user_platform_admin(uuid) to glix_app;
