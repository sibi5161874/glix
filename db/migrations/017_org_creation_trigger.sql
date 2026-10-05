-- 017: Extend the org-creation trigger to seed default leave types + document types
-- -------------------------------------------------------------------
-- 003_memberships.sql defined handle_new_organization() to create the owner's
-- membership. We don't edit that migration (RULES.md §1) — instead we replace
-- the function body here to add the seeding behaviour documented in
-- DATA_MODEL.md ("Seeded on org create"). The trigger `on_organization_created`
-- from 003 keeps pointing at this function; CREATE OR REPLACE swaps its body.
--
-- Default rows mirror shared/config/document-types.config.ts
-- (defaultLeaveTypes, defaultDocumentTypes) — update both on change.

create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.memberships (org_id, user_id, role, accepted_at)
  values (new.id, new.owner_id, 'org_admin', now())
  on conflict (org_id, user_id) do nothing;

  insert into public.leave_types (org_id, name, code, days_per_year, is_paid, requires_approval)
  values
    (new.id, 'Annual Leave', 'annual', 30, true, true),
    (new.id, 'Sick Leave', 'sick', 15, true, true),
    (new.id, 'Maternity Leave', 'maternity', 45, true, true),
    (new.id, 'Paternity Leave', 'paternity', 5, true, true),
    (new.id, 'Unpaid Leave', 'unpaid', 0, false, true),
    (new.id, 'Emergency Leave', 'emergency', 5, true, false)
  on conflict (org_id, code) do nothing;

  insert into public.document_types
    (org_id, name, code, requires_expiry, alert_days, retention_days)
  values
    (new.id, 'Passport', 'passport', true, '{90,60,30}', 3650),
    (new.id, 'Visa', 'visa', true, '{90,60,30}', 1825),
    (new.id, 'Emirates ID', 'emirates_id', true, '{90,60,30}', 3650),
    (new.id, 'Labor Card', 'labor_card', true, '{90,60,30}', 1825),
    (new.id, 'Employment Contract', 'contract', false, '{}', 2555),
    (new.id, 'Degree Certificate', 'degree', false, '{}', null),
    (new.id, 'Health Insurance', 'insurance', true, '{60,30,15}', 1825),
    (new.id, 'Driving License', 'driving_license', true, '{90,30}', 3650)
  on conflict (org_id, code) do nothing;

  return new;
end;
$$;
