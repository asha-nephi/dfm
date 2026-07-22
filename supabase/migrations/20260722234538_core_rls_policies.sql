alter table public.admins enable row level security;
alter table public.clients enable row level security;
alter table public.artisans enable row level security;
alter table public.properties enable row level security;
alter table public.work_orders enable row level security;
alter table public.work_order_photos enable row level security;
alter table public.payments enable row level security;

-- ADMINS: visible to self and other admins; no client-role writes at all
-- (the roster is seeded by migration, not created through the app).
create policy "admins_select" on public.admins
  for select using (auth_user_id = auth.uid() or public.is_admin());

-- CLIENTS: admin manages the roster; a client can see only their own row.
create policy "clients_select" on public.clients
  for select using (auth_user_id = auth.uid() or public.is_admin());
create policy "clients_admin_insert" on public.clients
  for insert with check (public.is_admin());
create policy "clients_admin_update" on public.clients
  for update using (public.is_admin());
create policy "clients_admin_delete" on public.clients
  for delete using (public.is_admin());

-- ARTISANS: same shape as clients.
create policy "artisans_select" on public.artisans
  for select using (auth_user_id = auth.uid() or public.is_admin());
create policy "artisans_admin_insert" on public.artisans
  for insert with check (public.is_admin());
create policy "artisans_admin_update" on public.artisans
  for update using (public.is_admin());
create policy "artisans_admin_delete" on public.artisans
  for delete using (public.is_admin());

-- PROPERTIES: admin full access; client sees their own; artisan sees only
-- properties tied to a work order assigned to them.
create policy "properties_select" on public.properties
  for select using (
    public.is_admin()
    or client_id = public.current_client_id()
    or exists (
      select 1 from public.work_orders wo
      where wo.property_id = properties.id
        and wo.assigned_artisan_id = public.current_artisan_id()
    )
  );
create policy "properties_admin_insert" on public.properties
  for insert with check (public.is_admin());
create policy "properties_admin_update" on public.properties
  for update using (public.is_admin());
create policy "properties_admin_delete" on public.properties
  for delete using (public.is_admin());

-- WORK ORDERS
create policy "work_orders_select" on public.work_orders
  for select using (
    public.is_admin()
    or assigned_artisan_id = public.current_artisan_id()
    or exists (
      select 1 from public.properties p
      where p.id = work_orders.property_id and p.client_id = public.current_client_id()
    )
  );

-- A client may submit a new maintenance request (Section 3.3) for their own
-- property, but only as a bare, unflagged, unpriced, unassigned "requested"
-- row — admin fills in cost/assignment afterwards.
create policy "work_orders_client_insert" on public.work_orders
  for insert with check (
    created_by = 'client'
    and status = 'requested'
    and flagged_for_review = false
    and cost_amount = 0
    and assigned_artisan_id is null
    and exists (
      select 1 from public.properties p
      where p.id = work_orders.property_id and p.client_id = public.current_client_id()
    )
  );
create policy "work_orders_admin_insert" on public.work_orders
  for insert with check (public.is_admin() and created_by = 'admin');
create policy "work_orders_admin_update" on public.work_orders
  for update using (public.is_admin());
create policy "work_orders_admin_delete" on public.work_orders
  for delete using (public.is_admin());
-- Artisans update status/checklist only via the artisan_update_work_order()
-- RPC (added separately) — no direct table UPDATE grant for that role, so
-- they can't rewrite cost_amount or flagged_for_review from the browser.

-- WORK ORDER PHOTOS
create policy "wop_select" on public.work_order_photos
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_photos.work_order_id
        and (
          wo.assigned_artisan_id = public.current_artisan_id()
          or exists (
            select 1 from public.properties p
            where p.id = wo.property_id and p.client_id = public.current_client_id()
          )
        )
    )
  );
create policy "wop_admin_insert" on public.work_order_photos
  for insert with check (public.is_admin() and uploaded_by = 'admin');
create policy "wop_artisan_insert" on public.work_order_photos
  for insert with check (
    uploaded_by = 'artisan'
    and exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_photos.work_order_id
        and wo.assigned_artisan_id = public.current_artisan_id()
    )
  );
create policy "wop_admin_delete" on public.work_order_photos
  for delete using (public.is_admin());

-- PAYMENTS: client can only ever insert a 'pending' row for themselves and
-- read their own history; flipping status to success/failed is admin-only
-- (or a trusted server key later) so a client can't fake a paid status.
create policy "payments_select" on public.payments
  for select using (public.is_admin() or client_id = public.current_client_id());
create policy "payments_client_insert_pending" on public.payments
  for insert with check (
    status = 'pending' and client_id = public.current_client_id()
  );
create policy "payments_admin_insert" on public.payments
  for insert with check (public.is_admin());
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin());
create policy "payments_admin_delete" on public.payments
  for delete using (public.is_admin());
