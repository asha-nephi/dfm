create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  description text,
  amount numeric(12,2) not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;
create policy "Admins manage expenses" on public.expenses
  for all using (public.is_admin()) with check (public.is_admin());

create index expenses_date_idx on public.expenses(date);

-- Optional structured breakdown for a payment request, e.g.
-- [{"label": "Coordination fee", "amount": 5000}, ...] — lets admin
-- compose a payment out of multiple standard charge types with the total
-- always derived from the line items, same pattern as work_orders.cost_breakdown.
alter table public.payments
  add column charge_breakdown jsonb not null default '[]'::jsonb;
