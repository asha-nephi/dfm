-- Admin previously only had Approve/Close/Reopen — no way to distinguish
-- "closed because it's done" from "this was a scam submission" in the
-- record itself. Adds a distinct spam status the admin list can filter on.
alter table public.cohost_requests drop constraint cohost_requests_status_check;
alter table public.cohost_requests add constraint cohost_requests_status_check
  check (status in ('pending_review', 'open', 'matched', 'closed', 'spam'));
