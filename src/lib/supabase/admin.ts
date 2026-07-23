import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Server-only client using the service role key — bypasses RLS entirely.
// Only ever import this into trusted server code that independently
// verifies what it's about to write: the Paystack callback route (after
// Paystack itself has confirmed the transaction — the client role is
// deliberately forbidden from flipping payment status directly, see Stage 2
// payments RLS) and the daily cron job (system-generated writes with no
// user session to act as).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
