create or replace function public.update_own_artisan_bank_details(
  p_bank_name text,
  p_bank_code text,
  p_account_number text,
  p_account_name text,
  p_paystack_recipient_code text
)
returns public.artisans
language plpgsql security definer set search_path = public
as $$
declare
  v_artisan_id uuid := public.current_artisan_id();
  v_row public.artisans;
begin
  if v_artisan_id is null then raise exception 'not an artisan'; end if;
  update public.artisans set
    bank_name = p_bank_name,
    bank_code = p_bank_code,
    account_number = p_account_number,
    account_name = p_account_name,
    paystack_recipient_code = p_paystack_recipient_code
  where id = v_artisan_id
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.update_own_artisan_bank_details(text, text, text, text, text) from public;
grant execute on function public.update_own_artisan_bank_details(text, text, text, text, text) to authenticated;

create or replace function public.update_own_client_bank_details(
  p_bank_name text,
  p_bank_code text,
  p_account_number text,
  p_account_name text,
  p_paystack_recipient_code text
)
returns public.clients
language plpgsql security definer set search_path = public
as $$
declare
  v_client_id uuid := public.current_client_id();
  v_row public.clients;
begin
  if v_client_id is null then raise exception 'not a client'; end if;
  update public.clients set
    bank_name = p_bank_name,
    bank_code = p_bank_code,
    account_number = p_account_number,
    account_name = p_account_name,
    paystack_recipient_code = p_paystack_recipient_code
  where id = v_client_id
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.update_own_client_bank_details(text, text, text, text, text) from public;
grant execute on function public.update_own_client_bank_details(text, text, text, text, text) to authenticated;
