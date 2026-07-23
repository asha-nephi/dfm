-- Recurring monthly management fee per property (0/null = none configured).
alter table public.properties add column monthly_fee numeric(12,2) not null default 0;

-- Lead lifecycle tracking, so "convert to client" has somewhere to record it.
alter table public.contact_leads add column status text not null default 'new'
  check (status in ('new', 'converted', 'archived'));

-- Tags auto-generated recurring-fee payments with their billing period, so the
-- cron job can check "has this property already been billed for this month"
-- idempotently instead of relying on fragile description-string matching.
alter table public.payments add column recurring_period text;
create unique index payments_property_recurring_period_key
  on public.payments (property_id, recurring_period)
  where recurring_period is not null;

-- Auto-generated (cron) work orders need a third created_by value alongside
-- the existing client/admin.
alter table public.work_orders drop constraint work_orders_created_by_check;
alter table public.work_orders add constraint work_orders_created_by_check
  check (created_by in ('client', 'admin', 'system'));

-- Admin's own reusable price-benchmark library, surfaced as quick-add
-- suggestions in the work order cost breakdown editor.
create table public.cost_benchmarks (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  category text,
  typical_amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);
alter table public.cost_benchmarks enable row level security;
create policy "cost_benchmarks_admin_all" on public.cost_benchmarks
  for all using (is_admin()) with check (is_admin());

-- Preventive maintenance schedules per property. The daily cron creates a
-- work order when next_due_date arrives and advances it by interval_months.
create table public.maintenance_schedules (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  interval_months integer not null check (interval_months > 0),
  next_due_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.maintenance_schedules enable row level security;
create policy "maintenance_schedules_admin_all" on public.maintenance_schedules
  for all using (is_admin()) with check (is_admin());
create policy "maintenance_schedules_client_select" on public.maintenance_schedules
  for select using (client_owns_property(property_id));

create index maintenance_schedules_property_id_idx on public.maintenance_schedules(property_id);
