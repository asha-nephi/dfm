import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold text-charcoal">
          Deseret Facility Management
        </Link>
        <div className="rounded-lg border border-charcoal/10 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-navy-black">Set your password</h1>
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
              <label htmlFor="email" className="block text-sm font-medium text-navy-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-black">
                Choose a password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white transition hover:bg-navy-black"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-black/60">
            Already set your password?{" "}
            <Link href="/login" className="font-medium text-charcoal underline underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
