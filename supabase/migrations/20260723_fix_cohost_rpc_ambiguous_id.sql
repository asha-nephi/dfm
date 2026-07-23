-- Both functions' RETURNS TABLE(id uuid) shadowed bare `id` column
-- references inside the function body ("column reference is ambiguous").
-- Qualify every reference explicitly.

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
  select cohost_requests.status into v_status
  from public.cohost_requests
  where cohost_requests.id = p_request_id;

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
  select cohost_requests.id, cohost_requests.status into v_request_id, v_request_status
  from public.cohost_requests where cohost_requests.host_token = p_host_token;

  if v_request_id is null then
    raise exception 'request not found';
  end if;
  if v_request_status <> 'open' then
    raise exception 'this request is not open';
  end if;

  select cohost_applications.cohost_request_id into v_application_request_id
  from public.cohost_applications where cohost_applications.id = p_application_id;

  if v_application_request_id is null or v_application_request_id <> v_request_id then
    raise exception 'application does not belong to this request';
  end if;

  insert into public.cohost_agreements (cohost_request_id, selected_applicant_id, terms_note)
  values (v_request_id, p_application_id, nullif(trim(p_terms_note), ''))
  returning cohost_agreements.id into v_agreement_id;

  update public.cohost_applications
    set status = case when cohost_applications.id = p_application_id then 'selected' else 'not_selected' end
    where cohost_applications.cohost_request_id = v_request_id;

  update public.cohost_requests set status = 'matched' where cohost_requests.id = v_request_id;

  return query select v_agreement_id;
end;
$$;
