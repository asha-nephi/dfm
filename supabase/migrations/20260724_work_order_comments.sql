create table public.work_order_comments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  author_role text not null check (author_role in ('client', 'admin', 'artisan')),
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index work_order_comments_work_order_idx on public.work_order_comments (work_order_id, created_at);

alter table public.work_order_comments enable row level security;

create policy "work_order_comments_select" on public.work_order_comments
  for select using (public.is_admin() or public.can_access_work_order(work_order_id));

-- No direct INSERT policy — everyone goes through add_work_order_comment so
-- author_role/author_name are derived from the session, never client-supplied.

-- Auto-derives who's posting (and their display name) from the session
-- rather than trusting client-supplied role/name fields.
create or replace function public.add_work_order_comment(
  p_work_order_id uuid,
  p_body text
)
returns public.work_order_comments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_name text;
  v_row public.work_order_comments;
begin
  if length(trim(coalesce(p_body, ''))) = 0 then
    raise exception 'comment cannot be empty';
  end if;

  if public.is_admin() then
    v_role := 'admin';
    select name into v_name from public.admins where auth_user_id = auth.uid();
  elsif public.current_client_id() is not null then
    if not exists (
      select 1 from public.properties p
      join public.work_orders wo on wo.property_id = p.id
      where wo.id = p_work_order_id and p.client_id = public.current_client_id()
    ) then
      raise exception 'not your work order';
    end if;
    v_role := 'client';
    select name into v_name from public.clients where id = public.current_client_id();
  elsif public.current_artisan_id() is not null then
    if not public.artisan_assigned_to_work_order(p_work_order_id) then
      raise exception 'not assigned to this work order';
    end if;
    v_role := 'artisan';
    select name into v_name from public.artisans where id = public.current_artisan_id();
  else
    raise exception 'not authorized';
  end if;

  insert into public.work_order_comments (work_order_id, author_role, author_name, body)
  values (p_work_order_id, v_role, coalesce(v_name, 'Unknown'), trim(p_body))
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.add_work_order_comment(uuid, text) from public;
grant execute on function public.add_work_order_comment(uuid, text) to authenticated;
