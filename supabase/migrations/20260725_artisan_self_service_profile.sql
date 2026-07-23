-- Same pattern as update_own_client_profile — artisan can edit their own
-- name/phone, email stays admin-managed (tied to login/invite identity).
create or replace function public.update_own_artisan_profile(
  p_name text,
  p_phone text
)
returns public.artisans
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artisan_id uuid := public.current_artisan_id();
  v_row public.artisans;
begin
  if v_artisan_id is null then
    raise exception 'not an artisan';
  end if;
  if length(trim(coalesce(p_name, ''))) = 0 then
    raise exception 'name is required';
  end if;

  update public.artisans
    set name = trim(p_name),
        phone = nullif(trim(coalesce(p_phone, '')), '')
    where id = v_artisan_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.update_own_artisan_profile(text, text) from public;
grant execute on function public.update_own_artisan_profile(text, text) to authenticated;
