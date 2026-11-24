-- DFM now sells five named services. Tag jobs and leads with which one.
alter table public.work_orders
  add column service_type text
    check (service_type in ('cleaning', 'ac', 'electrical', 'plumbing', 'generator')),
  add column preferred_timing text;

create index work_orders_service_type_idx on public.work_orders (service_type);

alter table public.contact_leads
  add column service_interest text;

-- Starting prices for the five services (Nov 2026 research). Admin can edit these.
insert into public.cost_benchmarks (label, category, typical_amount)
select v.label, v.category, v.amount
from (values
  ('Regular clean, 2-bedroom (per visit)', 'cleaning', 25000),
  ('Regular clean, 3-bedroom (per visit)', 'cleaning', 35000),
  ('Deep / move-in or move-out clean', 'cleaning', 60000),
  ('AC servicing, per split unit', 'ac', 15000),
  ('Electrical inspection visit', 'electrical', 15000),
  ('Plumbing inspection visit', 'plumbing', 15000),
  ('Generator servicing, small home set', 'generator', 25000)
) as v(label, category, amount)
where not exists (select 1 from public.cost_benchmarks b where b.label = v.label);

-- Earnings page: an artisan can read (never change) their own payouts.
create policy "Artisans read own payouts"
  on public.payouts for select
  using (artisan_id = public.current_artisan_id());
