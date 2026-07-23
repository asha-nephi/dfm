alter table public.payments
  add column work_order_id uuid references public.work_orders(id) on delete set null;

create index if not exists payments_work_order_id_idx on public.payments(work_order_id);
