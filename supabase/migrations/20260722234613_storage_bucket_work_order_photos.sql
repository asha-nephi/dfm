insert into storage.buckets (id, name, public)
values ('work-order-photos', 'work-order-photos', false)
on conflict (id) do nothing;

-- Objects are stored as {work_order_id}/{filename}; policies parse the
-- work_order_id out of the path to check ownership, same scoping as the
-- work_order_photos table itself.
create policy "wop_storage_select" on storage.objects
  for select using (
    bucket_id = 'work-order-photos'
    and (
      public.is_admin()
      or exists (
        select 1 from public.work_orders wo
        where wo.id::text = (storage.foldername(name))[1]
          and (
            wo.assigned_artisan_id = public.current_artisan_id()
            or exists (
              select 1 from public.properties p
              where p.id = wo.property_id and p.client_id = public.current_client_id()
            )
          )
      )
    )
  );

create policy "wop_storage_admin_insert" on storage.objects
  for insert with check (bucket_id = 'work-order-photos' and public.is_admin());

create policy "wop_storage_artisan_insert" on storage.objects
  for insert with check (
    bucket_id = 'work-order-photos'
    and exists (
      select 1 from public.work_orders wo
      where wo.id::text = (storage.foldername(name))[1]
        and wo.assigned_artisan_id = public.current_artisan_id()
    )
  );

create policy "wop_storage_admin_delete" on storage.objects
  for delete using (bucket_id = 'work-order-photos' and public.is_admin());
