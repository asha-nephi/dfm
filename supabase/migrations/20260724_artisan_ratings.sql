alter table public.work_orders
  add column artisan_rating smallint check (artisan_rating between 1 and 5),
  add column artisan_rating_note text;

-- Client rating goes through an RPC rather than a raw UPDATE policy, same
-- pattern as artisan_update_work_order — narrowly scoped so a client can
-- only ever touch the rating columns on their own completed jobs, not
-- status/cost/assignment.
create or replace function public.client_rate_work_order(
  p_work_order_id uuid,
  p_rating smallint,
  p_note text
)
returns public.work_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid := public.current_client_id();
  v_row public.work_orders;
begin
  if v_client_id is null then
    raise exception 'not a client';
  end if;
  if p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;

  update public.work_orders
    set artisan_rating = p_rating,
        artisan_rating_note = nullif(trim(coalesce(p_note, '')), '')
    where id = p_work_order_id
      and status = 'complete'
      and exists (
        select 1 from public.properties p
        where p.id = work_orders.property_id and p.client_id = v_client_id
      )
    returning * into v_row;

  if v_row.id is null then
    raise exception 'work order not found, not yours, or not complete';
  end if;

  return v_row;
end;
$$;

revoke all on function public.client_rate_work_order(uuid, smallint, text) from public;
grant execute on function public.client_rate_work_order(uuid, smallint, text) to authenticated;
