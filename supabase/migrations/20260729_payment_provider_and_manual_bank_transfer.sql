-- Paystack can't process international payments for this business (real
-- estate businesses are on its ineligible list), and Stripe/the US LLC is
-- deferred for cost reasons — see Decision_Log.md Decision 003's correction
-- and amendment. This adds a manual bank-transfer fallback so diaspora
-- clients still have a working payment path in the meantime.
alter table public.payments
  add column provider text not null default 'paystack'
    check (provider in ('paystack', 'manual_bank_transfer', 'stripe')),
  add column bank_transfer_reference text;
