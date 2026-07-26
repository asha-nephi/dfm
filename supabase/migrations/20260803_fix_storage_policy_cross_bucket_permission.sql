-- Postgres evaluates every applicable INSERT policy on storage.objects for
-- the operation, not just the one for the bucket being written to — so an
-- anonymous insert into ANY bucket was failing outright with "permission
-- denied for function artisan_assigned_to_work_order", because that
-- function (used only by the unrelated work-order-photos policy) was
-- granted to authenticated but not anon. The function is safe for anon to
-- call: it's STABLE and only reads current_artisan_id(), which is already
-- null for anon and already anon-grantable — this just lets the boolean
-- itself be evaluated (and short-circuit to false) instead of erroring.
grant execute on function public.artisan_assigned_to_work_order(uuid) to anon;
