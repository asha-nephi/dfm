create extension if not exists pgcrypto;

-- ADMINS: single founder/admin role (Section 4: no multi-admin in v1).
-- Seeded by email; linked to auth.users once that email signs up & confirms.
create table public.admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- CLIENTS
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now()
);

-- ARTISANS: admin's own vetted roster, not open signup (Decision 006 / Section 3.6).
create table public.artisans (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  added_by_admin uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now()
);

-- PROPERTIES
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  address text not null,
  notes text,
  -- Section 3.7: STR data-model readiness, no Airbnb integration.
  property_type text not null default 'long_term_let'
    check (property_type in ('long_term_let', 'short_term_rental')),
  created_at timestamptz not null default now()
);

-- WORK ORDERS
create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  date date not null default current_date,
  description text not null,
  cost_amount numeric(12,2) not null default 0,
  cost_breakdown jsonb not null default '[]'::jsonb,
  flagged_for_review boolean not null default false,
  flag_reason text,
  status text not null default 'requested'
    check (status in ('requested', 'accepted', 'in_progress', 'complete', 'cancelled')),
  assigned_artisan_id uuid references public.artisans(id) on delete set null,
  -- Section 3.7: basic turnover checklist structure for STR properties, e.g.
  -- [{"item": "Linens changed", "done": true}, ...]. Null for long-term-let.
  turnover_checklist jsonb,
  created_by text not null check (created_by in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger work_orders_set_updated_at
before update on public.work_orders
for each row execute function public.set_updated_at();

-- WORK ORDER PHOTOS
create table public.work_order_photos (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  uploaded_by text not null check (uploaded_by in ('admin', 'artisan')),
  photo_url text not null,
  caption text,
  "timestamp" timestamptz not null default now()
);

-- PAYMENTS (Paystack references/amounts only — never card data)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  amount numeric(12,2) not null,
  description text,
  paystack_reference text unique,
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed')),
  date timestamptz not null default now()
);
