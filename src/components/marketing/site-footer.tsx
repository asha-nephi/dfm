import Link from "next/link";
import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-charcoal/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div className="flex items-start gap-2">
            <LogoMark className="h-7 w-7 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy-black">
                Deseret Facility Management Ltd
              </p>
              <p className="mt-1 text-xs text-navy-black/60">
                RC 9461286 &middot; Lagos, Nigeria
              </p>
              <p className="mt-1 text-xs text-navy-black/60">
                nephi.asha@deseretfacilities.com
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-navy-black/70">
            <Link href="/faq" className="hover:text-navy-black">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-navy-black">
              Privacy
            </Link>
            <Link href="/login" className="hover:text-navy-black">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
