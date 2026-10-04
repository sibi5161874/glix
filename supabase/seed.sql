-- Seed: dev-only fixtures.
-- NOTE: auth.users rows must be created via Supabase Auth API (see script below).
-- This seed assumes those users already exist with known IDs.

-- Project owner (replace UUID with a real auth user id)
insert into public.project_owners (user_id)
values ('00000000-0000-0000-0000-000000000001')
on conflict do nothing;

-- Demo organization
insert into public.organizations (id, name, slug, owner_id, tier)
values (
  '11111111-1111-1111-1111-111111111111',
  'Acme Corp',
  'acme',
  '00000000-0000-0000-0000-000000000001',
  'pro'
) on conflict (id) do nothing;

-- Demo staff membership
insert into public.memberships (org_id, user_id, role, accepted_at)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000002',
  'org_admin',
  now()
) on conflict do nothing;
