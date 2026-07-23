import Link from "next/link";

export default function ForgotPasswordCheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-navy-black">Check your email</h1>
        <p className="mt-3 text-sm text-navy-black/70">
          If that email is on file, we&apos;ve sent a link to reset your
          password. Click it to choose a new one.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-charcoal underline underline-offset-2"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
