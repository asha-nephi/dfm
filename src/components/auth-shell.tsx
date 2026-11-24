import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { Icon } from "@/components/ui/icons";

// Split-screen frame for login, signup and password pages.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-charcoal p-12 text-off-white lg:flex">
        <Link href="/">
          <Wordmark tone="light" />
        </Link>
        <div>
          <h2 className="font-display text-5xl leading-tight">
            Your property, <span className="italic text-gold-light">on record.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-off-white/80">
            {[
              ["camera", "Dated before-and-after photos on every job"],
              ["receipt", "Itemized costs you approve first"],
              ["globe", "Book and track from anywhere"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-gold-light">
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-xs text-off-white/45">
          Deseret Facility Management Ltd &middot; RC 9461286 &middot; Ikeja, Lagos
        </p>
      </div>
      <div className="flex flex-col items-center justify-center bg-off-white px-4 py-12">
        <Link href="/" className="mb-8 lg:hidden">
          <Wordmark />
        </Link>
        <div className="w-full max-w-sm">{children}</div>
        <Link href="/" className="mt-8 text-sm text-navy-black/55 hover:text-charcoal">
          &larr; Back to deseretfacilities.com
        </Link>
      </div>
    </div>
  );
}
