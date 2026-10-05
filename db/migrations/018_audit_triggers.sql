-- 018: Database-level audit hooks on sensitive tables
-- -------------------------------------------------------------------
-- Covers the mutation events RULES.md §11 requires that are representable as
-- row changes (role change, member invite, tier change, employee/document/
-- loan/leave-request mutations). Events that are reads, not writes — login,
-- logout, document view, document download — are NOT representable as DB
-- triggers; the backend must insert those into audit_log explicitly
-- (see backend-constitution.md §12).

create or replace function public.audit_log_record_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_entity_id uuid;
  v_metadata jsonb;
begin
  if tg_op = 'DELETE' then
    v_org_id := old.org_id;
    v_entity_id := old.id;
    v_metadata := to_jsonb(old);
  else
    v_org_id := new.org_id;
    v_entity_id := new.id;
    v_metadata := to_jsonb(new);
  end if;

  insert into public.audit_log (org_id, actor_id, action, entity_type, entity_id, metadata)
  values (
    v_org_id,
    public.current_user_id(),
    lower(tg_op) || '.' || tg_argv[0],
    tg_argv[0],
    v_entity_id,
    v_metadata
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger audit_memberships
  after insert or update or delete on public.memberships
  for each row execute function public.audit_log_record_change('membership');

create trigger audit_employees
  after insert or update or delete on public.employees
  for each row execute function public.audit_log_record_change('employee');

create trigger audit_documents
  after insert or update or delete on public.documents
  for each row execute function public.audit_log_record_change('document');

create trigger audit_loans
  after insert or update or delete on public.loans
  for each row execute function public.audit_log_record_change('loan');

create trigger audit_leave_requests
  after insert or update or delete on public.leave_requests
  for each row execute function public.audit_log_record_change('leave_request');

-- ── organizations.plan_id change (tier change) ─────────────────────
-- Separate function: organizations has no `org_id` column (its `id` IS the
-- org id), so it can't share audit_log_record_change() above.
create or replace function public.audit_log_tier_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.plan_id is distinct from old.plan_id then
    insert into public.audit_log (org_id, actor_id, action, entity_type, entity_id, metadata)
    values (
      new.id,
      public.current_user_id(),
      'tier_change',
      'organization',
      new.id,
      jsonb_build_object('old_plan_id', old.plan_id, 'new_plan_id', new.plan_id)
    );
  end if;
  return new;
end;
$$;

create trigger audit_organizations_tier_change
  after update of plan_id on public.organizations
  for each row execute function public.audit_log_tier_change();
