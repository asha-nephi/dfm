-- Section 3.8 / Section 6: the co-host marketplace is request/application
-- based, not a public directory. cohost_requests/applications/agreements
-- have admin-only direct table RLS (see cohost_agreements_admin_all etc.);
-- these SECURITY DEFINER functions are the only way anon/public users touch
-- this data, and each one enforces its own narrow authorization internally
-- (exact host_token match, or request.status = 'open') so there is no
-- browsable listing anywhere.

create or replace function public.submit_cohost_request(
  p_host_name text,
  p_host_contact text,
  p_property_description text
)
returns table (id uuid, host_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.cohost_requests;
begin
  if length(trim(p_host_name)) = 0 or length(trim(p_host_contact)) = 0
    or length(trim(p_property_description)) = 0 then
    raise exception 'missing required field';
  end if;

  insert into public.cohost_requests (host_name, host_contact, property_description)
  values (trim(p_host_name), trim(p_host_contact), trim(p_property_description))
  returning * into v_row;

  return query select v_row.id, v_row.host_token;
end;
$$;

create or replace function public.get_cohost_request_by_host_token(p_token uuid)
returns setof public.cohost_requests
language sql
security definer
stable
set search_path = public
as $$
  select * from public.cohost_requests where host_token = p_token;
$$;

create or replace function public.get_cohost_applications_by_host_token(p_token uuid)
returns setof public.cohost_applications
language sql
security definer
stable
set search_path = public
as $$
  select a.*
  from public.cohost_applications a
  join public.cohost_requests r on r.id = a.cohost_request_id
  where r.host_token = p_token
  order by a.created_at desc;
$$;

-- Minimal public-safe projection for the apply page — never exposes
-- host_name/host_contact, and status lets the page explain why a request
-- isn't (yet) accepting applications without needing a listing endpoint.
create or replace function public.get_cohost_request_public(p_request_id uuid)
returns table (id uuid, property_description text, status text)
language sql
security definer
stable
set search_path = public
as $$
  select r.id, r.property_description, r.status
  from public.cohost_requests r
  where r.id = p_request_id;
$$;

create or replace function public.submit_cohost_application(
  p_request_id uuid,
  p_applicant_name text,
  p_applicant_contact text,
  p_message text
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_row public.cohost_applications;
begin
  select status into v_status from public.cohost_requests where id = p_request_id;

  if v_status is null then
    raise exception 'request not found';
  end if;
  if v_status <> 'open' then
    raise exception 'this request is not currently accepting applications';
  end if;
  if length(trim(p_applicant_name)) = 0 or length(trim(p_applicant_contact)) = 0 then
    raise exception 'missing required field';
  end if;

  insert into public.cohost_applications (cohost_request_id, applicant_name, applicant_contact, message)
  values (p_request_id, trim(p_applicant_name), trim(p_applicant_contact), nullif(trim(p_message), ''))
  returning * into v_row;

  return query select v_row.id;
end;
$$;

create or replace function public.select_cohost_applicant(
  p_host_token uuid,
  p_application_id uuid,
  p_terms_note text
)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request_id uuid;
  v_request_status text;
  v_application_request_id uuid;
  v_agreement_id uuid;
begin
  select id, status into v_request_id, v_request_status
  from public.cohost_requests where host_token = p_host_token;

  if v_request_id is null then
    raise exception 'request not found';
  end if;
  if v_request_status <> 'open' then
    raise exception 'this request is not open';
  end if;

  select cohost_request_id into v_application_request_id
  from public.cohost_applications where id = p_application_id;

  if v_application_request_id is null or v_application_request_id <> v_request_id then
    raise exception 'application does not belong to this request';
  end if;

  insert into public.cohost_agreements (cohost_request_id, selected_applicant_id, terms_note)
  values (v_request_id, p_application_id, nullif(trim(p_terms_note), ''))
  returning cohost_agreements.id into v_agreement_id;

  update public.cohost_applications
    set status = case when id = p_application_id then 'selected' else 'not_selected' end
    where cohost_request_id = v_request_id;

  update public.cohost_requests set status = 'matched' where id = v_request_id;

  return query select v_agreement_id;
end;
$$;

revoke all on function public.submit_cohost_request(text, text, text) from public;
revoke all on function public.get_cohost_request_by_host_token(uuid) from public;
revoke all on function public.get_cohost_applications_by_host_token(uuid) from public;
revoke all on function public.get_cohost_request_public(uuid) from public;
revoke all on function public.submit_cohost_application(uuid, text, text, text) from public;
revoke all on function public.select_cohost_applicant(uuid, uuid, text) from public;

grant execute on function public.submit_cohost_request(text, text, text) to anon, authenticated;
grant execute on function public.get_cohost_request_by_host_token(uuid) to anon, authenticated;
grant execute on function public.get_cohost_applications_by_host_token(uuid) to anon, authenticated;
grant execute on function public.get_cohost_request_public(uuid) to anon, authenticated;
grant execute on function public.submit_cohost_application(uuid, text, text, text) to anon, authenticated;
grant execute on function public.select_cohost_applicant(uuid, uuid, text) to anon, authenticated;
