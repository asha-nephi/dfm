-- Trade and service area were captured on artisan_applications but never
-- carried over on approval, so they vanished the moment someone joined the
-- roster — meaning there was no way to tell who's a plumber vs. electrician,
-- or who covers which area, when assigning a work order.
alter table public.artisans
  add column trade text,
  add column service_area text;
