-- Turns "Approve" from a single click into something that requires real
-- vetting to have happened first: a photo ID, a reference contact, and a
-- checklist admin actually has to tick through. approveArtisanApplication
-- enforces the checklist server-side too, not just hidden in the UI.
alter table public.artisan_applications
  add column id_document_url text,
  add column reference_name text,
  add column reference_contact text,
  add column vetting_id_verified boolean not null default false,
  add column vetting_call_completed boolean not null default false,
  add column vetting_reference_checked boolean not null default false;

-- ID documents are sensitive (government ID scans) — private bucket,
-- write-only for the public (applicants aren't authenticated), admin-only
-- read. No public select policy at all, so nothing can be listed back.
insert into storage.buckets (id, name, public)
values ('artisan-application-documents', 'artisan-application-documents', false)
on conflict (id) do nothing;

create policy "artisan_application_documents_public_insert" on storage.objects
  for insert with check (bucket_id = 'artisan-application-documents');

create policy "artisan_application_documents_admin_select" on storage.objects
  for select using (bucket_id = 'artisan-application-documents' and public.is_admin());

create policy "artisan_application_documents_admin_delete" on storage.objects
  for delete using (bucket_id = 'artisan-application-documents' and public.is_admin());
