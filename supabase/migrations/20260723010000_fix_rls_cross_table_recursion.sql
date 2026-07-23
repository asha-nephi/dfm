-- properties_select and work_orders_select each had a raw EXISTS subquery
-- into the other RLS-protected table, which Postgres evaluates by
-- re-invoking that table's own RLS policy — creating infinite recursion on
-- ANY query against either table. Fix: route the cross-table checks through
-- SECURITY DEFINER functions (same pattern as is_admin()), which bypass RLS
-- entirely since they run as the table owner.

create or replace function public.client_owns_property(p_property_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.properties p
    where p.id = p_property_id and p.client_id = public.current_client_id()
  );
$$;

create or replace function public.artisan_assigned_to_property(p_property_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.work_orders wo
    where wo.property_id = p_property_id and wo.assigned_artisan_id = public.current_artisan_id()
  );
$$;

create or replace function public.can_access_work_order(p_work_order_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.work_orders wo
    where wo.id = p_work_order_id
      and (
        wo.assigned_artisan_id = public.current_artisan_id()
        or public.client_owns_property(wo.property_id)
      )
  );
$$;

revoke all on function public.client_owns_property(uuid) from public;
revoke all on function public.artisan_assigned_to_property(uuid) from public;
revoke all on function public.can_access_work_order(uuid) from public;
grant execute on function public.client_owns_property(uuid) to authenticated;
grant execute on function public.artisan_assigned_to_property(uuid) to authenticated;
grant execute on function public.can_access_work_order(uuid) to authenticated;

drop policy "properties_select" on public.properties;
create policy "properties_select" on public.properties
  for select using (
    public.is_admin()
    or client_id = public.current_client_id()
    or public.artisan_assigned_to_property(id)
  );

drop policy "work_orders_select" on public.work_orders;
create policy "work_orders_select" on public.work_orders
  for select using (
    public.is_admin()
    or assigned_artisan_id = public.current_artisan_id()
    or public.client_owns_property(property_id)
  );

drop policy "work_orders_client_insert" on public.work_orders;
create policy "work_orders_client_insert" on public.work_orders
  for insert with check (
    created_by = 'client'
    and status = 'requested'
    and flagged_for_review = false
    and cost_amount = 0
    and assigned_artisan_id is null
    and public.client_owns_property(property_id)
  );

drop policy "wop_select" on public.work_order_photos;
create policy "wop_select" on public.work_order_photos
  for select using (
    public.is_admin() or public.can_access_work_order(work_order_id)
  );

drop policy "wop_artisan_insert" on public.work_order_photos;
create policy "wop_artisan_insert" on public.work_order_photos
  for insert with check (
    uploaded_by = 'artisan'
    and exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_photos.work_order_id
        and wo.assigned_artisan_id = public.current_artisan_id()
    )
  );
