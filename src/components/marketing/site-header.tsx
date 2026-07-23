import Link from "next/link";
import { LogoMark } from "@/components/logo";

const NAV = [
  { href: "#problem", label: "The problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-charcoal/10 bg-off-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="text-sm font-semibold text-charcoal sm:text-base">
            Deseret Facility Management
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-navy-black/70 hover:text-navy-black"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-md border border-charcoal/20 px-4 py-1.5 text-sm font-medium text-charcoal hover:border-charcoal/40"
        >
          Log in
        </Link>
      </div>
    </header>
  );
}
