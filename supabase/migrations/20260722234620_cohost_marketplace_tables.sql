-- Section 3.8 / Decision 006 founder override: request/application model,
-- explicitly NOT a public directory. No table here is directly browsable by
-- anon or authenticated non-admin roles — Stage 10 adds narrow SECURITY
-- DEFINER RPCs (token-gated) for the public submit/apply/select flows so
-- nothing can be enumerated by querying the table directly.
-- Kept in beta/request-access state per Section 6 until real ToS exists.

create table public.cohost_requests (
  id uuid primary key default gen_random_uuid(),
  host_name text not null,
  host_contact text not null,
  property_description text not null,
  -- unguessable link a host uses (no login) to view applications & select one
  host_token uuid not null default gen_random_uuid(),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'open', 'matched', 'closed')),
  created_at timestamptz not null default now()
);
create unique index cohost_requests_host_token_idx on public.cohost_requests (host_token);

create table public.cohost_applications (
  id uuid primary key default gen_random_uuid(),
  cohost_request_id uuid not null references public.cohost_requests(id) on delete cascade,
  applicant_name text not null,
  applicant_contact text not null,
  message text,
  status text not null default 'submitted'
    check (status in ('submitted', 'selected', 'not_selected')),
  created_at timestamptz not null default now()
);

create table public.cohost_agreements (
  id uuid primary key default gen_random_uuid(),
  cohost_request_id uuid not null references public.cohost_requests(id) on delete cascade,
  selected_applicant_id uuid not null references public.cohost_applications(id),
  terms_note text,
  date_matched timestamptz not null default now()
);

alter table public.cohost_requests enable row level security;
alter table public.cohost_applications enable row level security;
alter table public.cohost_agreements enable row level security;

-- Admin-only direct table access. Public submission/apply/select happens
-- through RPCs (Stage 10) that never expose a listing of all rows.
create policy "cohost_requests_admin_all" on public.cohost_requests
  for all using (public.is_admin()) with check (public.is_admin());
create policy "cohost_applications_admin_all" on public.cohost_applications
  for all using (public.is_admin()) with check (public.is_admin());
create policy "cohost_agreements_admin_all" on public.cohost_agreements
  for all using (public.is_admin()) with check (public.is_admin());
