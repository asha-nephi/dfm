-- Prevents the same contact from having two applications sitting in "new"
-- at once — same idempotency pattern as payments' recurring_period unique
-- index. Doesn't block reapplying after a decision (approved/declined),
-- only a second pending submission while the first is still unreviewed.
create unique index artisan_applications_contact_pending_unique
  on public.artisan_applications (contact)
  where status = 'new';
