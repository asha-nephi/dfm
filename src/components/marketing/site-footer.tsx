import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { SERVICES } from "@/lib/services";

export function SiteFooter() {
  return (
    <footer className="bg-navy-black text-off-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Vetted artisans, dated before-and-after photos and itemized costs for your Lagos
              property, wherever you live.
            </p>
            <p className="mt-5 font-mono text-xs text-off-white/50">
              Deseret Facility Management Ltd &middot; RC 9461286
              <br />
              Ikeja, Lagos, Nigeria
              <br />
              nephi.asha@deseretfacilities.com
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow !text-gold-light">Services</p>
            <ul className="mt-4 space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-off-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow !text-gold-light">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-off-white">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-off-white">FAQ</Link></li>
              <li><Link href="/join-artisan" className="hover:text-off-white">Work with us (artisans)</Link></li>
              <li><Link href="/privacy" className="hover:text-off-white">Privacy</Link></li>
              <li><Link href="/login" className="hover:text-off-white">Client &amp; artisan log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-off-white/45">
          &copy; {new Date().getFullYear()} Deseret Facility Management Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
