import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
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
          <h1 className="text-xl font-semibold text-navy-black">Reset your password</h1>
          <p className="mt-1 text-sm text-navy-black/60">
            Enter the email on your account and we&apos;ll send a link to
            reset your password.
          </p>

          <form action={requestPasswordReset} className="mt-6 space-y-4">
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
            <button
              type="submit"
              className="w-full rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
            >
              Send reset link
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-black/60">
            <Link href="/login" className="font-medium text-charcoal underline underline-offset-2">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
