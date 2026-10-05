-- 010: Departments, designations, employees — the core tenant entity
-- -------------------------------------------------------------------

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text,
  parent_id uuid references public.departments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, name)
);

create trigger departments_set_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

create index departments_org_id_idx on public.departments(org_id);
create index departments_parent_id_idx on public.departments(parent_id);

alter table public.departments enable row level security;

create policy "departments_select_members"
  on public.departments for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "departments_write_admin"
  on public.departments for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "departments_update_admin"
  on public.departments for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "departments_delete_admin"
  on public.departments for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── designations ────────────────────────────────────────────────────
create table public.designations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  level integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, title)
);

create trigger designations_set_updated_at
  before update on public.designations
  for each row execute function public.set_updated_at();

create index designations_org_id_idx on public.designations(org_id);

alter table public.designations enable row level security;

create policy "designations_select_members"
  on public.designations for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "designations_write_admin"
  on public.designations for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "designations_update_admin"
  on public.designations for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "designations_delete_admin"
  on public.designations for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── employees ───────────────────────────────────────────────────────
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  employee_code text not null,
  first_name text not null,
  last_name text not null,
  email citext not null,
  phone text,
  dob date,
  gender text check (gender in ('male', 'female', 'other')),
  nationality text,
  marital_status text check (marital_status in ('single', 'married', 'divorced', 'widowed')),
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  reporting_manager_id uuid references public.employees(id) on delete set null,
  joining_date date not null,
  employment_type text not null default 'full_time'
    check (employment_type in ('full_time', 'part_time', 'contract')),
  basic_salary numeric(12, 2) not null default 0,
  bank_account text,
  iban text,
  status text not null default 'active'
    check (status in ('active', 'probation', 'on_leave', 'terminated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, employee_code),
  unique (org_id, email)
);

create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

create index employees_org_id_idx on public.employees(org_id);
create index employees_org_status_idx on public.employees(org_id, status);
create index employees_org_department_idx on public.employees(org_id, department_id);
create index employees_org_employee_code_idx on public.employees(org_id, employee_code);
create index employees_reporting_manager_idx on public.employees(reporting_manager_id);
create index employees_user_id_idx on public.employees(user_id);

alter table public.employees enable row level security;

create policy "employees_select_org_or_self"
  on public.employees for select
  using (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (
        public.current_role() in ('org_admin', 'org_staff')
        or id = public.current_employee_id()
      )
    )
  );

create policy "employees_insert_admin_or_staff"
  on public.employees for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "employees_update_admin_staff_or_self"
  on public.employees for update
  using (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (
        public.current_role() in ('org_admin', 'org_staff')
        or id = public.current_employee_id()
      )
    )
  )
  with check (
    public.is_platform_admin()
    or (
      org_id = public.current_org_id()
      and (
        public.current_role() in ('org_admin', 'org_staff')
        or id = public.current_employee_id()
      )
    )
  );

create policy "employees_delete_admin"
  on public.employees for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
