-- 013: Employee loans & salary advances
-- -------------------------------------------------------------------

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  principal_amount numeric(12, 2) not null,
  monthly_installment numeric(12, 2) not null,
  repaid_amount numeric(12, 2) not null default 0,
  start_month date not null,
  term_months integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'paid_off', 'rejected')),
  reason text,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger loans_set_updated_at
  before update on public.loans
  for each row execute function public.set_updated_at();

create index loans_org_id_idx on public.loans(org_id);
create index loans_org_employee_idx on public.loans(org_id, employee_id);
create index loans_org_status_idx on public.loans(org_id, status);

alter table public.loans enable row level security;

create policy "loans_select_admin_staff_or_self"
  on public.loans for select
  using (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (
        public.current_role() in ('org_admin', 'org_staff')
        or employee_id = public.current_employee_id()
      )
    )
  );

create policy "loans_insert_admin_staff_or_self"
  on public.loans for insert
  with check (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (
        public.current_role() in ('org_admin', 'org_staff')
        or employee_id = public.current_employee_id()
      )
    )
  );

create policy "loans_update_admin_or_approver"
  on public.loans for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "loans_delete_admin"
  on public.loans for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
