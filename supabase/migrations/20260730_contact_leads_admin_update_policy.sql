-- contact_leads was missing an UPDATE policy entirely — admin select/delete
-- policies existed, but nothing allowed the status column to actually be
-- changed, so "Convert to client" and "Archive" silently no-op under RLS
-- (0 rows affected, no error surfaced to the app).
create policy "contact_leads_admin_update" on public.contact_leads
  for update using (public.is_admin()) with check (public.is_admin());
