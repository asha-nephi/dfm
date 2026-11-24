import { AuthShell } from "@/components/auth-shell";
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
    <AuthShell>
      <div>
        <div className="card p-8 shadow-[0_20px_60px_-30px_rgba(24,58,47,0.25)]">
          <h1 className="font-display text-3xl text-navy-black">Log in</h1>
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
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 input"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
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
                className="mt-1 input"
              />
            </div>
            <SubmitButton className="w-full btn-primary">
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
    </AuthShell>
  );
}
