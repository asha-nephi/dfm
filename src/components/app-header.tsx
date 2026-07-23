"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-charcoal/10 bg-white/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href={homeHref} className="shrink-0 font-semibold whitespace-nowrap text-charcoal">
            <span className="hidden sm:inline">Deseret Facility Management</span>
            <span className="sm:hidden">DFM</span>
          </Link>
          {nav && nav.length > 0 && (
            <nav className="hidden gap-1 sm:flex">
              {nav.map((item) => {
                const active =
                  item.href === homeHref
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-off-white text-navy-black"
                        : "text-navy-black/60 hover:text-navy-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
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

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md text-navy-black sm:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t border-charcoal/10 bg-white sm:hidden">
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {nav?.map((item) => {
              const active =
                item.href === homeHref
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-2 py-2.5 text-sm font-medium ${
                    active ? "bg-off-white text-navy-black" : "text-navy-black/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center justify-between border-t border-charcoal/10 px-2 py-3">
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
        </nav>
      )}
    </header>
  );
}
