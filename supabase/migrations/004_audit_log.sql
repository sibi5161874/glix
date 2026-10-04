-- 004: Audit log — append-only
-- -------------------------------------------------------------------

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_log_org_id_created_at_idx
  on public.audit_log(org_id, created_at desc);
create index audit_log_actor_id_idx on public.audit_log(actor_id);
create index audit_log_action_idx on public.audit_log(action);

-- Append-only: block updates and deletes at the DB layer
create or replace function public.audit_log_block_mutations()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_no_update
  before update on public.audit_log
  for each row execute function public.audit_log_block_mutations();

create trigger audit_log_no_delete
  before delete on public.audit_log
  for each row execute function public.audit_log_block_mutations();
