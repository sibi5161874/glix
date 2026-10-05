-- 016: Support tickets — tenant + platform-only
-- -------------------------------------------------------------------

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  subject text not null,
  body text not null,
  category text not null check (category in ('billing', 'technical', 'hr_feature', 'bug')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid references public.platform_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger support_tickets_set_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

create index support_tickets_org_id_idx on public.support_tickets(org_id);
create index support_tickets_user_id_idx on public.support_tickets(user_id);
create index support_tickets_status_idx on public.support_tickets(status);

alter table public.support_tickets enable row level security;

create policy "support_tickets_select_submitter_admin_or_superadmin"
  on public.support_tickets for select
  using (
    public.is_platform_admin()
    or user_id = public.current_user_id()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "support_tickets_insert_authenticated"
  on public.support_tickets for insert
  with check (public.current_user_id() is not null and user_id = public.current_user_id());

create policy "support_tickets_update_submitter_admin_or_superadmin"
  on public.support_tickets for update
  using (
    public.is_platform_admin()
    or user_id = public.current_user_id()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or user_id = public.current_user_id()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "support_tickets_delete_superadmin"
  on public.support_tickets for delete
  using (public.is_platform_admin());
