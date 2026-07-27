-- Narrow RPC for sending a message, same pattern as add_work_order_comment
-- and artisan_submit_quote — the caller's role is derived server-side
-- (current_client_id/current_artisan_id/is_admin), not trusted from the
-- client, so nobody can spoof sender_role or post into someone else's
-- thread. Admin is the only caller who supplies a target (exactly one of
-- p_client_id/p_artisan_id), since admin can message anyone; a client or
-- artisan can only ever reach their own thread with admin.
create or replace function public.send_message(
  p_body text,
  p_client_id uuid default null,
  p_artisan_id uuid default null
)
returns public.messages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid := public.current_client_id();
  v_artisan_id uuid := public.current_artisan_id();
  v_target_client uuid;
  v_target_artisan uuid;
  v_role text;
  v_row public.messages;
begin
  if length(trim(coalesce(p_body, ''))) = 0 then
    raise exception 'message body is required';
  end if;

  if public.is_admin() then
    if (p_client_id is null) = (p_artisan_id is null) then
      raise exception 'specify exactly one of p_client_id or p_artisan_id';
    end if;
    v_target_client := p_client_id;
    v_target_artisan := p_artisan_id;
    v_role := 'admin';
  elsif v_client_id is not null then
    v_target_client := v_client_id;
    v_target_artisan := null;
    v_role := 'client';
  elsif v_artisan_id is not null then
    v_target_client := null;
    v_target_artisan := v_artisan_id;
    v_role := 'artisan';
  else
    raise exception 'not authorized';
  end if;

  insert into public.messages (client_id, artisan_id, sender_role, body)
  values (v_target_client, v_target_artisan, v_role, trim(p_body))
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.send_message(text, uuid, uuid) from public;
grant execute on function public.send_message(text, uuid, uuid) to authenticated;
