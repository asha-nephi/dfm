-- These run as the function owner (postgres), which bypasses RLS on the
-- tables they read — this is what lets policies on clients/artisans/admins
-- check role membership without recursing into their own RLS.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.auth_user_id = auth.uid());
$$;

create or replace function public.current_client_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select c.id from public.clients c where c.auth_user_id = auth.uid();
$$;

create or replace function public.current_artisan_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select a.id from public.artisans a where a.auth_user_id = auth.uid();
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_client_id() to anon, authenticated;
grant execute on function public.current_artisan_id() to anon, authenticated;
