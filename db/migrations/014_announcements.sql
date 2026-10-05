-- 014: Company announcements & bulletins
-- -------------------------------------------------------------------

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('normal', 'high', 'urgent')),
  publish_at timestamptz not null default now(),
  expires_at timestamptz,
  attachment_url text,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

create index announcements_org_publish_idx on public.announcements(org_id, publish_at desc);
create index announcements_org_priority_idx on public.announcements(org_id, priority);

alter table public.announcements enable row level security;

create policy "announcements_select_members"
  on public.announcements for select
  using (org_id = public.current_org_id() or public.is_platform_admin());

create policy "announcements_insert_admin_or_staff"
  on public.announcements for insert
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "announcements_update_admin_or_staff"
  on public.announcements for update
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() in ('org_admin', 'org_staff'))
  );

create policy "announcements_delete_admin"
  on public.announcements for delete
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.current_role() = 'org_admin')
  );
