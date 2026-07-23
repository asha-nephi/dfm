"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white px-4 text-center">
      <LogoMark className="h-10 w-10" />
      <h1 className="mt-6 text-2xl font-semibold text-navy-black">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-navy-black/60">
        That was unexpected on our end. Try again, or head back to the
        homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-charcoal/20 px-5 py-2.5 text-sm font-medium text-navy-black hover:border-charcoal/40"
        >
          Homepage
        </Link>
      </div>
    </div>
  );
}
