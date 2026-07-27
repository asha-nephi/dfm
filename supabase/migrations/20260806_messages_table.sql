-- Lightweight in-app messaging so admin can reach a client or artisan
-- (and vice versa) even when the only contact on file is a WhatsApp
-- number email can't reach. Modeled as a 1:1 thread with admin per
-- client/artisan, not a general chat — matches how the business actually
-- runs (admin is the hub). Messages are immutable once sent for anyone
-- other than admin, so there's no update policy for client/artisan.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  artisan_id uuid references public.artisans(id) on delete cascade,
  sender_role text not null check (sender_role in ('admin', 'client', 'artisan')),
  body text not null,
  created_at timestamptz not null default now(),
  check (
    (client_id is not null and artisan_id is null)
    or (artisan_id is not null and client_id is null)
  )
);

alter table public.messages enable row level security;

create policy "messages_admin_all" on public.messages
  for all using (public.is_admin()) with check (public.is_admin());

create policy "messages_client_select" on public.messages
  for select using (client_id = public.current_client_id());
create policy "messages_client_insert" on public.messages
  for insert with check (
    client_id = public.current_client_id()
    and sender_role = 'client'
    and artisan_id is null
  );

create policy "messages_artisan_select" on public.messages
  for select using (artisan_id = public.current_artisan_id());
create policy "messages_artisan_insert" on public.messages
  for insert with check (
    artisan_id = public.current_artisan_id()
    and sender_role = 'artisan'
    and client_id is null
  );

create index messages_client_id_idx on public.messages(client_id);
create index messages_artisan_id_idx on public.messages(artisan_id);
