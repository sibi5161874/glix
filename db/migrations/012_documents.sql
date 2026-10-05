-- 012: Document types + the document vault
-- -------------------------------------------------------------------

create table public.document_types (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  requires_expiry boolean not null default true,
  alert_days integer[] not null default '{90,60,30}',
  retention_days integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, code)
);

create trigger document_types_set_updated_at
  before update on public.document_types
  for each row execute function public.set_updated_at();

create index document_types_org_id_idx on public.document_types(org_id);

alter table public.document_types enable row level security;

create policy "document_types_select_members"
  on public.document_types for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "document_types_write_admin"
  on public.document_types for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "document_types_update_admin"
  on public.document_types for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

create policy "document_types_delete_admin"
  on public.document_types for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );

-- ── documents ───────────────────────────────────────────────────────
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  document_type_id uuid not null references public.document_types(id) on delete cascade,
  document_number text,
  issue_date date,
  expiry_date date,
  file_path text not null,
  file_size bigint not null,
  mime_type text not null,
  alert_90_sent boolean not null default false,
  alert_60_sent boolean not null default false,
  alert_30_sent boolean not null default false,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

create index documents_org_employee_idx on public.documents(org_id, employee_id);
create index documents_org_expiry_idx on public.documents(org_id, expiry_date);
create index documents_org_type_idx on public.documents(org_id, document_type_id);

alter table public.documents enable row level security;

create policy "documents_select_admin_staff_or_self"
  on public.documents for select
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

create policy "documents_insert_admin_or_staff"
  on public.documents for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "documents_update_admin_or_staff"
  on public.documents for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "documents_delete_admin"
  on public.documents for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
