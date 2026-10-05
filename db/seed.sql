-- Seed: dev-only fixtures.
--
-- Pattern: this file is plain SQL, idempotent via `on conflict ... do nothing`,
-- and run by `scripts/seed.ts` after `scripts/migrate.ts`. It inserts `users`
-- rows with no `password_hash` — `scripts/seed.ts` sets a known dev password
-- (argon2-hashed) for these same IDs right after this file runs, so demo
-- email+password login works out of the box. This file only guarantees the
-- rows and relationships exist. Never run this against a shared/staging/
-- production database.

-- Platform superadmin
insert into public.users (id, email, full_name)
values ('00000000-0000-0000-0000-000000000001', 'superadmin@glix.ae', 'Glix Superadmin')
on conflict (id) do nothing;

insert into public.platform_users (id, email, full_name, role)
values ('00000000-0000-0000-0000-000000000001', 'superadmin@glix.ae', 'Glix Superadmin', 'owner')
on conflict (id) do nothing;

-- Demo org owner (org_admin) + a staff member
insert into public.users (id, email, full_name)
values
  ('00000000-0000-0000-0000-000000000002', 'owner@acme.test', 'Acme Owner'),
  ('00000000-0000-0000-0000-000000000003', 'staff@acme.test', 'Acme Staff')
on conflict (id) do nothing;

-- Demo organization — plan_id resolved from the seeded `plans` table (009_plans.sql).
-- `tier` is kept in sync automatically by organizations_sync_tier_trigger.
insert into public.organizations (id, name, slug, owner_id, plan_id, currency)
select
  '11111111-1111-1111-1111-111111111111',
  'Acme Corp',
  'acme',
  '00000000-0000-0000-0000-000000000002',
  p.id,
  'AED'
from public.plans p
where p.slug = 'pro'
on conflict (id) do nothing;

-- Owner's org_admin membership is created automatically by on_organization_created
-- (003_memberships.sql). Add the staff membership explicitly.
insert into public.memberships (org_id, user_id, role, accepted_at)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000003',
  'org_staff',
  now()
) on conflict (org_id, user_id) do nothing;

-- Demo employees (leave_types / document_types for this org are seeded
-- automatically on org creation — see 017_org_creation_trigger.sql).
insert into public.employees
  (id, org_id, user_id, employee_code, first_name, last_name, email, dob, joining_date)
values
  (
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000003',
    'EMP-001',
    'Acme',
    'Staff',
    'staff@acme.test',
    '1990-05-15', -- lets EMP-001 + 1990-05-15 exercise the DOB-as-password login path
    current_date
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    null,
    'EMP-002',
    'Jane',
    'Doe',
    'jane.doe@acme.test',
    '1992-11-02',
    current_date
  )
on conflict (id) do update set dob = excluded.dob;
