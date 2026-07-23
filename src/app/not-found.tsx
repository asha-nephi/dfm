import Link from "next/link";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white px-4 text-center">
      <LogoMark className="h-10 w-10" />
      <h1 className="mt-6 text-2xl font-semibold text-navy-black">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-navy-black/60">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-charcoal px-5 py-2.5 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black"
      >
        Back to homepage
      </Link>
    </div>
  );
}
