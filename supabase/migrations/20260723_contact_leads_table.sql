-- Not in the brief's Section 5 suggested model, but Section 3.1 requires a
-- working contact/lead capture form, which has to land somewhere. Public can
-- insert (submit the form); only admin can read submissions.
create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null, -- email or WhatsApp number, per the brief's form spec
  property_location text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.contact_leads enable row level security;

create policy "contact_leads_public_insert" on public.contact_leads
  for insert with check (true);
create policy "contact_leads_admin_select" on public.contact_leads
  for select using (public.is_admin());
create policy "contact_leads_admin_delete" on public.contact_leads
  for delete using (public.is_admin());
