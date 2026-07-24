-- Public "join our artisan network" applications — solves the actual
-- recruiting bottleneck (work comes in but there's no one to assign it
-- to) the same way the co-host marketplace solved its cold-start problem:
-- a request/application queue admin reviews, not an open public roster.
create table public.artisan_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null, -- email or WhatsApp, same convention as contact_leads
  trade text not null,
  service_area text,
  experience text,
  status text not null default 'new'
    check (status in ('new', 'approved', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.artisan_applications enable row level security;

create policy "artisan_applications_public_insert" on public.artisan_applications
  for insert with check (true);
create policy "artisan_applications_admin_select" on public.artisan_applications
  for select using (public.is_admin());
-- Learned this the hard way on contact_leads: an admin select/delete pair
-- with no update policy means status changes silently no-op under RLS.
create policy "artisan_applications_admin_update" on public.artisan_applications
  for update using (public.is_admin()) with check (public.is_admin());
create policy "artisan_applications_admin_delete" on public.artisan_applications
  for delete using (public.is_admin());

create index artisan_applications_status_idx on public.artisan_applications(status);
