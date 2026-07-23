import Link from "next/link";
import { logout } from "@/app/login/actions";

export function AppHeader({
  roleLabel,
  homeHref,
  nav,
}: {
  roleLabel: string;
  homeHref: string;
  nav?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-charcoal/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href={homeHref} className="font-semibold text-charcoal">
            Deseret Facility Management
          </Link>
          {nav && nav.length > 0 && (
            <nav className="hidden gap-4 sm:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-navy-black/70 hover:text-navy-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-off-white px-3 py-1 text-xs font-medium text-navy-black/70">
            {roleLabel}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-charcoal underline underline-offset-2"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
