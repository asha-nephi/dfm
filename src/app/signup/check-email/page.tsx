import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <AuthShell>
      <div className="text-center">
        <h1 className="font-display text-3xl text-navy-black">Check your email</h1>
        <p className="mt-3 text-sm text-navy-black/70">
          We sent a confirmation link to the address you entered. Click it to
          activate your account, then come back and log in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-charcoal underline underline-offset-2"
        >
          Back to log in
        </Link>
      </div>
    </AuthShell>
  );
}
