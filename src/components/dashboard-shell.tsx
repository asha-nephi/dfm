"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { LogoMark } from "@/components/logo";

type NavItem = { href: string; label: string };

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function NavLinks({
  nav,
  homeHref,
  pathname,
  onNavigate,
}: {
  nav: NavItem[];
  homeHref: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
      {nav.map((item) => {
        const active =
          item.href === homeHref ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-amber bg-off-white text-navy-black"
                : "border-transparent text-navy-black/60 hover:bg-off-white/70 hover:text-navy-black"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function RoleFooter({ roleLabel }: { roleLabel: string }) {
  return (
    <div className="border-t border-charcoal/10 px-4 py-3">
      <div className="flex items-center justify-between">
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
  );
}

export function DashboardShell({
  roleLabel,
  homeHref,
  nav,
  children,
}: {
  roleLabel: string;
  homeHref: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-off-white md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-charcoal/10 md:bg-white">
        <Link href={homeHref} className="flex items-center gap-2 px-4 py-4">
          <LogoMark className="h-7 w-7 shrink-0" />
          <span className="text-sm font-semibold text-charcoal">Deseret Facility Management</span>
        </Link>
        <NavLinks nav={nav} homeHref={homeHref} pathname={pathname} />
        <RoleFooter roleLabel={roleLabel} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-charcoal/10 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href={homeHref} className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="text-sm font-semibold text-charcoal">DFM</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-navy-black"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-4">
              <Link
                href={homeHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <LogoMark className="h-7 w-7 shrink-0" />
                <span className="text-sm font-semibold text-charcoal">
                  Deseret Facility Management
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-navy-black"
              >
                <CloseIcon />
              </button>
            </div>
            <NavLinks
              nav={nav}
              homeHref={homeHref}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <RoleFooter roleLabel={roleLabel} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
