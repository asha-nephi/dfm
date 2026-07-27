import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Shared spam guard for public, unauthenticated form submissions (contact
// form, co-host request/apply). Two layers: a honeypot field bots tend to
// auto-fill, and an IP-based rate limit backed by the check_rate_limit RPC.
export async function isSpamSubmission(
  formData: FormData,
  supabase: SupabaseClient<Database>,
  action: string,
  { maxEvents = 5, windowMinutes = 15 }: { maxEvents?: number; windowMinutes?: number } = {},
): Promise<boolean> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return true;
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const { data: allowed } = await supabase.rpc("check_rate_limit", {
    p_action: action,
    p_identifier: ip,
    p_max_events: maxEvents,
    p_window_minutes: windowMinutes,
  });

  return allowed !== true;
}

// Matching honeypot field for forms — visually hidden but still in the tab
// order for real keyboard users would be bad, so it's pulled off-screen and
// excluded from tabbing/autofill instead of display:none (which some bots
// skip filling).
export const HONEYPOT_FIELD_NAME = "website";

// Honeypot + rate limit only catch bulk/scripted abuse — neither inspects
// what was actually typed, so a single well-formed submission with a
// phishing link sails straight through both (this is exactly how a
// crypto-scam link ended up in a co-host request). None of these free-text
// fields (property description, application message, lead message,
// artisan experience) have any legitimate reason to contain a link, so any
// URL is treated as spam.
const URL_PATTERN = /(https?:\/\/|www\.)\S+/i;

export function containsSuspiciousLink(...values: (string | null | undefined)[]): boolean {
  return values.some((v) => typeof v === "string" && URL_PATTERN.test(v));
}
