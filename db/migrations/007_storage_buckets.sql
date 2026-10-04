-- 007: Attachments and file metadata (VPS filesystem storage)
-- -------------------------------------------------------------------

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  owner_type text not null, -- e.g. 'document', 'leave_request', 'announcement'
  owner_id uuid not null,
  file_path text not null, -- relative path on VPS filesystem (e.g. ./uploads/...)
  file_size bigint not null,
  mime_type text not null,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

alter table public.attachments enable row level security;

create policy "attachments_select_org_members"
  on public.attachments for select
  using (
    org_id = public.current_org_id()
    or public.is_platform_admin()
  );

create policy "attachments_insert_org_members"
  on public.attachments for insert
  with check (
    (org_id = public.current_org_id() and uploaded_by = public.current_user_id())
    or public.is_platform_admin()
  );

create policy "attachments_update_org_admin"
  on public.attachments for update
  using (
    (org_id = public.current_org_id() and public.current_role() = 'org_admin')
    or public.is_platform_admin()
  );

create policy "attachments_delete_org_admin"
  on public.attachments for delete
  using (
    (org_id = public.current_org_id() and public.current_role() = 'org_admin')
    or public.is_platform_admin()
  );

create index attachments_org_owner_idx on public.attachments(org_id, owner_type, owner_id);
create index attachments_org_uploaded_by_idx on public.attachments(org_id, uploaded_by);
