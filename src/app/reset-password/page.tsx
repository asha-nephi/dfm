import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";
import { updatePassword } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { PasswordInput } from "@/components/password-input";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <div>
        <div className="card p-8 shadow-[0_20px_60px_-30px_rgba(24,58,47,0.25)]">
          <h1 className="font-display text-3xl text-navy-black">Choose a new password</h1>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form action={updatePassword} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="label">
                New password
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
  Update password
</SubmitButton>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
