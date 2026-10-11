-- 024: CRM Leads & Public Contact Inquiries
-- -------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create index leads_status_idx on public.leads(status);
create index leads_created_at_idx on public.leads(created_at desc);

alter table public.leads enable row level security;

-- Public visitors can submit contact inquiries
create policy "leads_public_insert"
  on public.leads for insert
  with check (true);

-- Platform superadmins can view and manage all inquiries
create policy "leads_platform_admin_select"
  on public.leads for select
  using (public.is_platform_admin());

create policy "leads_platform_admin_update"
  on public.leads for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "leads_platform_admin_delete"
  on public.leads for delete
  using (public.is_platform_admin());
