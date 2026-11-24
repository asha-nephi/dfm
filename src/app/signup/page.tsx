import { AuthShell } from "@/components/auth-shell";
import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { PasswordInput } from "@/components/password-input";

export const metadata: Metadata = { title: "Set your password" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <div>
        <div className="card p-8 shadow-[0_20px_60px_-30px_rgba(24,58,47,0.25)]">
          <h1 className="font-display text-3xl text-navy-black">Set your password</h1>
          <p className="mt-1 text-sm text-navy-black/60">
            Use the same email address DFM has on file for you as a client or
            artisan. If you haven&apos;t been added yet, reach out via the
            contact form on the homepage first.
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form action={signup} className="mt-6 space-y-4">
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
              <label htmlFor="password" className="label">
                Choose a password
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1 input"
              />
            </div>
            <SubmitButton className="w-full btn-primary">
  Create account
</SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-navy-black/60">
            Already set your password?{" "}
            <Link href="/login" className="font-medium text-charcoal underline underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
