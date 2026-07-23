-- Previous migration accidentally loosened this to "assigned to ANY work
-- order on the property" via artisan_assigned_to_property. Correct scope is
-- the exact work order encoded in the object path.
create or replace function public.artisan_assigned_to_work_order(p_work_order_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.work_orders wo
    where wo.id = p_work_order_id and wo.assigned_artisan_id = public.current_artisan_id()
  );
$$;

revoke all on function public.artisan_assigned_to_work_order(uuid) from public;
grant execute on function public.artisan_assigned_to_work_order(uuid) to authenticated;

drop policy "wop_storage_artisan_insert" on storage.objects;
create policy "wop_storage_artisan_insert" on storage.objects
  for insert with check (
    bucket_id = 'work-order-photos'
    and public.artisan_assigned_to_work_order(((storage.foldername(name))[1])::uuid)
  );

drop policy "wop_artisan_insert" on public.work_order_photos;
create policy "wop_artisan_insert" on public.work_order_photos
  for insert with check (
    uploaded_by = 'artisan'
    and public.artisan_assigned_to_work_order(work_order_id)
  );
