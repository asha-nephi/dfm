-- Client can edit their own name/phone. Email is deliberately excluded —
-- it's tied to their auth login identity and the admin-provisioning /
-- email-confirmation linking flow (see handle_auth_user_confirmed); a
-- self-service email change would need its own confirm-the-new-address
-- flow to stay safe, out of scope for this pass. Admin can still change it
-- directly (already has full UPDATE access to clients).
create or replace function public.update_own_client_profile(
  p_name text,
  p_phone text
)
returns public.clients
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid := public.current_client_id();
  v_row public.clients;
begin
  if v_client_id is null then
    raise exception 'not a client';
  end if;
  if length(trim(coalesce(p_name, ''))) = 0 then
    raise exception 'name is required';
  end if;

  update public.clients
    set name = trim(p_name),
        phone = nullif(trim(coalesce(p_phone, '')), '')
    where id = v_client_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.update_own_client_profile(text, text) from public;
grant execute on function public.update_own_client_profile(text, text) to authenticated;
