alter table public.artisans
  add column bank_name text,
  add column bank_code text,
  add column account_number text,
  add column account_name text,
  add column paystack_recipient_code text;

alter table public.clients
  add column bank_name text,
  add column bank_code text,
  add column account_number text,
  add column account_name text,
  add column paystack_recipient_code text;

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans(id) on delete cascade,
  work_order_id uuid references public.work_orders(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  reason text,
  status text not null default 'pending'
    check (status in ('pending', 'otp_required', 'success', 'failed', 'reversed')),
  paystack_transfer_code text,
  paystack_reference text unique,
  failure_reason text,
  initiated_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payouts_artisan_id_idx on public.payouts(artisan_id);
create index payouts_work_order_id_idx on public.payouts(work_order_id);

alter table public.payouts enable row level security;

-- Admin-only: payouts are money leaving the business, never exposed to the
-- artisan or client directly (an artisan sees they got paid via email/bank
-- alert, not via the app).
create policy "Admins manage payouts"
  on public.payouts for all
  using (public.is_admin())
  with check (public.is_admin());

create trigger payouts_set_updated_at
  before update on public.payouts
  for each row execute function public.set_updated_at();
