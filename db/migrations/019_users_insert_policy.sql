-- 019: users — INSERT policy + a controlled signup path
-- -------------------------------------------------------------------
-- 006_rls_policies.sql (already pushed) enabled RLS on `users` and defined
-- SELECT and UPDATE policies, but no INSERT policy. Once RLS is actually
-- enforced against the backend's runtime role (020_roles.sql), every insert
-- into `users` — org signup, employee-linked login creation, seeding — would
-- be silently denied with no policy at all.
--
-- Self-signup can't satisfy a row-level check at insert time (the row, and
-- therefore its would-be "owner" match, doesn't exist yet, and there is no
-- session for an unauthenticated signup). So the primary path is a
-- SECURITY DEFINER function: it runs with the privileges of its owner
-- (the migration/owner role, which is not RLS-restricted — see 020), so the
-- insert succeeds regardless of the caller's row-level permissions, while
-- the function body is the only thing that can be invoked, and only by
-- roles explicitly granted EXECUTE (granted to glix_app in 020).
--
-- The explicit INSERT policy below additionally allows a platform admin
-- session to insert directly (e.g. future admin tooling), without requiring
-- every insert to go through create_user().

create policy "users_insert_admin"
  on public.users for insert
  with check (public.is_platform_admin());

create or replace function public.create_user(
  p_email citext,
  p_password_hash text,
  p_full_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.users (email, password_hash, full_name)
  values (p_email, p_password_hash, p_full_name)
  returning id into v_id;
  return v_id;
end;
$$;

comment on function public.create_user(citext, text, text) is
  'Signup entry point. SECURITY DEFINER so it can insert into users without
   requiring the caller to already hold an INSERT-eligible session. EXECUTE
   is granted only to the restricted runtime role (020_roles.sql) — never to
   PUBLIC.';
