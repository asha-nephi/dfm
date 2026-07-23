-- Scoped to the admin work-orders list + detail page for now: lets admin
-- see artisan status/comment updates without a manual refresh. RLS still
-- applies to realtime delivery, so this doesn't widen who can see what.
alter publication supabase_realtime add table public.work_orders;
alter publication supabase_realtime add table public.work_order_comments;
