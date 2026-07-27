-- Tracks whether/when an overdue-payment reminder was last sent, so the
-- daily cron can nudge a client again without re-sending every single day.
alter table public.payments add column last_reminder_sent_at timestamptz;
