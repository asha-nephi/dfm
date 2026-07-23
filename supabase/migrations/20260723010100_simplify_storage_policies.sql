drop policy "wop_storage_select" on storage.objects;
create policy "wop_storage_select" on storage.objects
  for select using (
    bucket_id = 'work-order-photos'
    and (
      public.is_admin()
      or public.can_access_work_order(((storage.foldername(name))[1])::uuid)
    )
  );

-- Note: superseded by 20260723010200 which scopes this to the exact work
-- order (assigned artisan) rather than any work order on the property.
