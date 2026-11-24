import { AuthShell } from "@/components/auth-shell";
import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div>
        <div className="card p-8 shadow-[0_20px_60px_-30px_rgba(24,58,47,0.25)]">
          <h1 className="font-display text-3xl text-navy-black">Reset your password</h1>
          <p className="mt-1 text-sm text-navy-black/60">
            Enter the email on your account and we&apos;ll send a link to
            reset your password.
          </p>

          <form action={requestPasswordReset} className="mt-6 space-y-4">
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
            <SubmitButton className="w-full btn-primary">
  Send reset link
</SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-navy-black/60">
            <Link href="/login" className="font-medium text-charcoal underline underline-offset-2">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
