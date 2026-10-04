-- 005: Custom Access Token Hook
-- Injects org_id + role into every issued JWT so RLS can read them
-- without an extra DB lookup.
-- -------------------------------------------------------------------

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  claims jsonb;
  v_org_id uuid;
  v_role public.org_role;
  v_is_project_owner boolean;
begin
  claims := event->'claims';

  -- Default: no active org
  v_org_id := null;
  v_role := null;
  v_is_project_owner := false;

  -- Project owner check (project_owners table, see below)
  select exists (
    select 1 from public.project_owners
    where user_id = (event->>'user_id')::uuid
  ) into v_is_project_owner;

  -- Active membership: pick the most recent accepted membership.
  -- Multi-org users can switch active org; for v1, one active org is enough.
  select m.org_id, m.role
    into v_org_id, v_role
  from public.memberships m
  where m.user_id = (event->>'user_id')::uuid
    and m.accepted_at is not null
  order by m.created_at asc
  limit 1;

  -- Inject claims
  claims := jsonb_set(claims, '{org_id}', to_jsonb(v_org_id));
  claims := jsonb_set(claims, '{role}',   to_jsonb(v_role));
  claims := jsonb_set(claims, '{is_project_owner}', to_jsonb(v_is_project_owner));

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Project owners table — separate from org roles
create table if not exists public.project_owners (
  user_id uuid primary key references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Grant permissions needed by the Auth hook
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
grant select on public.memberships, public.project_owners to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- Activate the hook (run once from SQL editor)
-- After running this migration, go to:
--   Dashboard → Auth → Hooks → Custom Access Token Hook
--   and select: public.custom_access_token_hook
