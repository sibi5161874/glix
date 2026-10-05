-- 020: Separate the runtime role from the table-owner role
-- -------------------------------------------------------------------
-- Fixes the RLS table-owner bypass found during Phase 0 verification:
-- `glix_user` owns every table (it ran migrations 001-019), and PostgreSQL
-- exempts a table's owner from its own RLS policies — confirmed empirically
-- (querying `organizations` with a bogus `app.org_id` returned every row).
--
-- This migration creates `glix_app`, a non-owner role with only row-level
-- DML privileges. RLS is NOT bypassed for a non-owner role just because it
-- has table privileges — policies apply to it unconditionally. No
-- FORCE ROW LEVEL SECURITY is used or needed for this role.
--
-- `glix_user` keeps owning every table and stays the role `scripts/migrate.ts`
-- and `scripts/seed.ts` connect as (DATABASE_URL_MIGRATE). The backend's
-- runtime connection (DATABASE_URL) must be switched to `glix_app` — see
-- `.env.example` / `.env.local` and `backend/src/index.ts`.
--
-- Password below is a local-dev-only value, consistent with the existing
-- `dev_password` already used for `glix_user` in .env.local. Rotate it for
-- any non-local environment.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'glix_app') then
    create role glix_app login password 'glix_app_dev_password';
  end if;
end
$$;

grant connect on database glix_dev to glix_app;
grant usage on schema public to glix_app;

-- Row-level DML only. No CREATE, no ownership, no BYPASSRLS, no DDL.
grant select, insert, update, delete on all tables in schema public to glix_app;
grant usage, select on all sequences in schema public to glix_app;

alter default privileges in schema public
  grant select, insert, update, delete on tables to glix_app;
alter default privileges in schema public
  grant usage, select on sequences to glix_app;

-- The signup path (019_users_insert_policy.sql) — only glix_app may call it.
grant execute on function public.create_user(citext, text, text) to glix_app;
