-- Lightweight IP-based rate limiting for public, unauthenticated form
-- submissions (contact form, co-host request/apply). No external service
-- needed — this is low-volume enough for a simple table + counting query.
create table public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  identifier text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx
  on public.rate_limit_events (action, identifier, created_at);

alter table public.rate_limit_events enable row level security;

create policy "rate_limit_events_admin_select" on public.rate_limit_events
  for select using (public.is_admin());

-- Returns true if the request is allowed (and records it), false if the
-- caller has hit p_max_events within the trailing p_window_minutes.
create or replace function public.check_rate_limit(
  p_action text,
  p_identifier text,
  p_max_events int,
  p_window_minutes int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  -- Opportunistic cleanup so this table doesn't grow unbounded; cheap given
  -- the composite index.
  delete from public.rate_limit_events where created_at < now() - interval '1 hour';

  select count(*) into v_count
    from public.rate_limit_events
    where action = p_action
      and identifier = p_identifier
      and created_at > now() - (p_window_minutes || ' minutes')::interval;

  if v_count >= p_max_events then
    return false;
  end if;

  insert into public.rate_limit_events (action, identifier) values (p_action, p_identifier);
  return true;
end;
$$;

revoke all on function public.check_rate_limit(text, text, int, int) from public;
grant execute on function public.check_rate_limit(text, text, int, int) to anon, authenticated;
