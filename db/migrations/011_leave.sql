-- 011: Leave — types, balances, requests, holidays
-- -------------------------------------------------------------------

create table public.leave_types (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  days_per_year numeric(4, 1) not null default 0,
  is_paid boolean not null default true,
  requires_approval boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, code)
);

create trigger leave_types_set_updated_at
  before update on public.leave_types
  for each row execute function public.set_updated_at();

create index leave_types_org_id_idx on public.leave_types(org_id);

alter table public.leave_types enable row level security;

create policy "leave_types_select_members"
  on public.leave_types for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "leave_types_write_admin"
  on public.leave_types for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "leave_types_update_admin"
  on public.leave_types for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "leave_types_delete_admin"
  on public.leave_types for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── leave_balances ──────────────────────────────────────────────────
create table public.leave_balances (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  year integer not null,
  allocated numeric(4, 1) not null default 0,
  used numeric(4, 1) not null default 0,
  carried_over numeric(4, 1) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, employee_id, leave_type_id, year)
);

create trigger leave_balances_set_updated_at
  before update on public.leave_balances
  for each row execute function public.set_updated_at();

create index leave_balances_org_id_idx on public.leave_balances(org_id);
create index leave_balances_employee_id_idx on public.leave_balances(employee_id);
create index leave_balances_leave_type_id_idx on public.leave_balances(leave_type_id);

alter table public.leave_balances enable row level security;

create policy "leave_balances_select_admin_or_self"
  on public.leave_balances for select
  using (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (public.current_role() = 'org_admin' or employee_id = public.current_employee_id())
    )
  );

create policy "leave_balances_write_admin"
  on public.leave_balances for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "leave_balances_update_admin"
  on public.leave_balances for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "leave_balances_delete_admin"
  on public.leave_balances for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── leave_requests ──────────────────────────────────────────────────
create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  total_days numeric(4, 1) not null,
  reason text,
  attachment_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leave_requests_set_updated_at
  before update on public.leave_requests
  for each row execute function public.set_updated_at();

create index leave_requests_org_status_idx on public.leave_requests(org_id, status);
create index leave_requests_org_employee_start_idx
  on public.leave_requests(org_id, employee_id, start_date desc);

alter table public.leave_requests enable row level security;

create policy "leave_requests_select_admin_staff_or_self"
  on public.leave_requests for select
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

create policy "leave_requests_insert_self_or_admin"
  on public.leave_requests for insert
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

create policy "leave_requests_update_admin_or_approver"
  on public.leave_requests for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "leave_requests_delete_self_cancel"
  on public.leave_requests for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and employee_id = public.current_employee_id())
  );

-- On approval: decrement the matching leave_balances row (upsert if missing).
create or replace function public.handle_leave_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    insert into public.leave_balances (org_id, employee_id, leave_type_id, year, used)
    values (new.org_id, new.employee_id, new.leave_type_id, extract(year from new.start_date)::int, new.total_days)
    on conflict (org_id, employee_id, leave_type_id, year)
    do update set used = public.leave_balances.used + new.total_days;
  end if;
  return new;
end;
$$;

create trigger on_leave_approved
  after update of status on public.leave_requests
  for each row execute function public.handle_leave_approved();

-- ── holidays ────────────────────────────────────────────────────────
create table public.holidays (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  date date not null,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, date, name)
);

create index holidays_org_id_idx on public.holidays(org_id);

alter table public.holidays enable row level security;

create policy "holidays_select_members"
  on public.holidays for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "holidays_write_admin"
  on public.holidays for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "holidays_update_admin"
  on public.holidays for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "holidays_delete_admin"
  on public.holidays for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
