import Link from "next/link";
import { updatePassword } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
          <h1 className="text-xl font-semibold text-navy-black">Choose a new password</h1>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form action={updatePassword} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-black">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
