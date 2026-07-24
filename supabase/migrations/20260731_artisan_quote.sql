-- Lets an artisan propose itemized pricing for a job they're assigned to,
-- instead of pricing only ever being typed in by admin after an
-- out-of-band conversation. Admin reviews and either accepts it (which
-- copies it into the work order's real cost_breakdown) or declines it
-- (artisan can revise and resubmit) — the artisan never writes directly
-- to cost_breakdown/cost_amount, so a proposed quote can't become the
-- billed cost without admin sign-off.
alter table public.work_orders
  add column artisan_quote jsonb,
  add column artisan_quote_note text;

create or replace function public.artisan_submit_quote(
  p_work_order_id uuid,
  p_quote jsonb,
  p_note text default null
)
returns public.work_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artisan_id uuid := public.current_artisan_id();
  v_row public.work_orders;
begin
  if v_artisan_id is null then
    raise exception 'not an artisan';
  end if;

  update public.work_orders
    set artisan_quote = p_quote,
        artisan_quote_note = p_note
    where id = p_work_order_id and assigned_artisan_id = v_artisan_id
    returning * into v_row;

  if v_row.id is null then
    raise exception 'work order not found or not assigned to you';
  end if;

  return v_row;
end;
$$;

revoke all on function public.artisan_submit_quote(uuid, jsonb, text) from public;
grant execute on function public.artisan_submit_quote(uuid, jsonb, text) to authenticated;
