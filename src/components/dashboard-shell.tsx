"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { Wordmark } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icons";

export type NavItem = { href: string; label: string; icon?: string };
export type NavGroup = { label?: string; items: NavItem[] };

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Pick the longest matching link so nested pages light up the right item.
function activeHref(groups: NavGroup[], homeHref: string, pathname: string) {
  let best = "";
  for (const g of groups) {
    for (const item of g.items) {
      const match =
        item.href === homeHref ? pathname === homeHref : pathname.startsWith(item.href);
      if (match && item.href.length > best.length) best = item.href;
    }
  }
  return best;
}

function NavLinks({
  groups,
  homeHref,
  pathname,
  onNavigate,
}: {
  groups: NavGroup[];
  homeHref: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const current = activeHref(groups, homeHref, pathname);
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-3">
      {groups.map((group, gi) => (
        <div key={group.label ?? gi}>
          {group.label && (
            <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-off-white/40">
              {group.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.href === current;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-off-white text-charcoal"
                      : "text-off-white/75 hover:bg-white/10 hover:text-off-white"
                  }`}
                >
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      className={`h-[18px] w-[18px] shrink-0 ${active ? "text-amber" : "text-off-white/50"}`}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function RoleFooter({ roleLabel, userName }: { roleLabel: string; userName?: string }) {
  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/20 text-sm font-semibold text-gold-light">
          {(userName ?? roleLabel).charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          {userName && <p className="truncate text-sm font-medium text-off-white">{userName}</p>}
          <p className="text-xs text-off-white/50">{roleLabel}</p>
        </div>
        <form action={logout}>
          <SubmitButton
            pendingText="..."
            className="rounded-md px-2 py-1 text-xs font-medium text-off-white/70 hover:bg-white/10 hover:text-off-white"
          >
            Log out
          </SubmitButton>
        </form>
      </div>
      <Link
        href="/"
        className="mt-3 block text-xs text-off-white/40 hover:text-off-white/70"
      >
        &larr; deseretfacilities.com
      </Link>
    </div>
  );
}

export function DashboardShell({
  roleLabel,
  homeHref,
  nav,
  userName,
  cta,
  children,
}: {
  roleLabel: string;
  homeHref: string;
  nav: NavGroup[];
  userName?: string;
  cta?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sidebar = (onNavigate?: () => void) => (
    <>
      {cta && (
        <div className="px-3 pt-1">
          <Link
            href={cta.href}
            onClick={onNavigate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-3 py-2.5 text-sm font-semibold text-navy-black transition hover:bg-[#a17a3d]"
          >
            <Icon name="plus" className="h-4 w-4" />
            {cta.label}
          </Link>
        </div>
      )}
      <NavLinks groups={nav} homeHref={homeHref} pathname={pathname} onNavigate={onNavigate} />
      <RoleFooter roleLabel={roleLabel} userName={userName} />
    </>
  );

  return (
    <div className="min-h-screen bg-off-white md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden bg-charcoal md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col">
        <Link href={homeHref} className="px-5 py-5">
          <Wordmark tone="light" />
        </Link>
        {sidebar()}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-off-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href={homeHref}>
          <Wordmark compact />
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
            className="absolute inset-0 bg-navy-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-charcoal shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <Link href={homeHref} onClick={() => setOpen(false)}>
                <Wordmark tone="light" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-off-white"
              >
                <CloseIcon />
              </button>
            </div>
            {sidebar(() => setOpen(false))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
