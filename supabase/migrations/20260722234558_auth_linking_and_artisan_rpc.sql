-- Links a newly-CONFIRMED auth.users row to a pre-existing admins/clients/
-- artisans row by matching email. Runs only after email confirmation (not
-- at raw signup) so nobody can claim an account by signing up with an email
-- they don't actually own.
create or replace function public.handle_auth_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and (tg_op = 'INSERT' or old.email_confirmed_at is null) then
    update public.admins set auth_user_id = new.id
      where lower(email) = lower(new.email) and auth_user_id is null;
    update public.clients set auth_user_id = new.id
      where lower(email) = lower(new.email) and auth_user_id is null;
    update public.artisans set auth_user_id = new.id
      where lower(email) = lower(new.email) and auth_user_id is null;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_confirmed
  after insert on auth.users
  for each row
  when (new.email_confirmed_at is not null)
  execute function public.handle_auth_user_confirmed();

create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  execute function public.handle_auth_user_confirmed();

-- The only way an artisan can change a work order: status transitions and
-- their turnover checklist, never cost/flag fields.
create or replace function public.artisan_update_work_order(
  p_work_order_id uuid,
  p_status text,
  p_turnover_checklist jsonb default null
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
  if p_status not in ('accepted', 'in_progress', 'complete') then
    raise exception 'invalid status for artisan update: %', p_status;
  end if;

  update public.work_orders
    set status = p_status,
        turnover_checklist = coalesce(p_turnover_checklist, turnover_checklist)
    where id = p_work_order_id and assigned_artisan_id = v_artisan_id
    returning * into v_row;

  if v_row.id is null then
    raise exception 'work order not found or not assigned to you';
  end if;

  return v_row;
end;
$$;

revoke all on function public.artisan_update_work_order(uuid, text, jsonb) from public;
grant execute on function public.artisan_update_work_order(uuid, text, jsonb) to authenticated;

-- Seed the founder's admin row. He links to it automatically the first time
-- he signs up and confirms with this email (business_documents/details.txt).
insert into public.admins (email, name)
values ('nephi.asha@deseretfacilities.com', 'Nephi Asha')
on conflict (email) do nothing;
