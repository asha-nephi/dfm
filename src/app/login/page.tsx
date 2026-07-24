import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { PasswordInput } from "@/components/password-input";

export const metadata: Metadata = { title: "Log in" };

// Some error values are internal codes (set by routes like /auth/callback),
// not messages meant for display — map those to accurate, reassuring text
// instead of dumping the raw code. `confirmation_failed` in particular
// doesn't mean confirmation failed outright: the email gets confirmed by
// Supabase before our callback ever runs, so this fires when only the
// one-time auto-login link was already used (often by an email client's
// link-scanner) — the account is still confirmed, just not auto-signed-in.
const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed:
    "That confirmation link was already used, but your email should still be confirmed — try logging in with your password below.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? error) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-1.5 text-center text-lg font-semibold text-charcoal hover:text-navy-black"
        >
          <span aria-hidden="true">&larr;</span> Deseret Facility Management
        </Link>
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-8">
          <h1 className="text-xl font-semibold text-navy-black">Log in</h1>
          <p className="mt-1 text-sm text-navy-black/60">
            For clients, artisans, and DFM admin.
          </p>

          {errorMessage && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <form action={login} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-navy-black">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-charcoal underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
            </div>
            <SubmitButton className="w-full rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Log in
</SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-navy-black/60">
            Already added as a client or artisan by DFM?{" "}
            <Link href="/signup" className="font-medium text-charcoal underline underline-offset-2">
              Set your password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
