-- 007: Storage buckets + RLS for tenant-scoped documents
-- Canonical pattern: folder name = org_id
-- -------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('org-documents', 'org-documents', false)
on conflict (id) do nothing;

-- ── Storage RLS: users can only touch files under their org_id prefix ──
create policy "org_docs_select"
  on storage.objects for select
  using (
    bucket_id = 'org-documents'
    and (storage.foldername(name))[1] = public.auth_org_id()::text
  );

create policy "org_docs_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'org-documents'
    and (storage.foldername(name))[1] = public.auth_org_id()::text
  );

create policy "org_docs_update"
  on storage.objects for update
  using (
    bucket_id = 'org-documents'
    and (storage.foldername(name))[1] = public.auth_org_id()::text
  );

create policy "org_docs_delete"
  on storage.objects for delete
  using (
    bucket_id = 'org-documents'
    and (storage.foldername(name))[1] = public.auth_org_id()::text
    and public.auth_role() in ('org_admin')
  );
