import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingSummary } from "@/components/marketing/pricing-summary";
import { Icon } from "@/components/ui/icons";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "How pricing works",
  description:
    "Free, itemized quotes for cleaning, AC servicing, electrical, plumbing and generator servicing in Lagos. You approve the price before any work starts.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <p className="eyebrow">How pricing works</p>
          <h1 className="font-display mt-2 max-w-3xl text-5xl text-navy-black sm:text-6xl">
            Clear prices, agreed before any work starts.
          </h1>
          <p className="mt-4 max-w-2xl text-navy-black/70">
            Every quote is built for your property and your job. It&apos;s free, there&apos;s no
            obligation, and you only pay once you&apos;ve said yes.
          </p>
          <Link href="/#contact" className="btn-primary mt-8 !px-6 !py-3.5">
            Get a free quote
          </Link>
        </section>

        <PricingSummary />

        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">What affects your quote</p>
              <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
                What we look at for each service
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.slug} className="card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                      <Icon name={s.icon} />
                    </span>
                    <h3 className="font-display text-2xl text-navy-black">{s.name}</h3>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-navy-black/75">
                    {s.quoteFactors.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/?service=${s.slug}#contact`}
                    className="mt-5 inline-block text-sm font-semibold text-charcoal hover:underline"
                  >
                    Get a quote &rarr;
                  </Link>
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-2xl bg-charcoal p-6 text-off-white">
                <div>
                  <p className="eyebrow !text-gold-light">Monthly care</p>
                  <h3 className="font-display mt-2 text-2xl">Full property management</h3>
                  <p className="mt-2 text-sm text-off-white/75">
                    One fixed monthly fee for regular checks, tenant requests and coordinating
                    every job. Agreed with you based on your property.
                  </p>
                </div>
                <Link href="/?service=management#contact" className="btn-gold mt-6">
                  Ask about monthly care
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-charcoal">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="font-display text-3xl text-off-white">Need a price for your property?</h2>
              <p className="mt-1 text-sm text-off-white/70">
                Tell us the size and what you need. We&apos;ll send a quote within 24 hours.
              </p>
            </div>
            <Link href="/#contact" className="btn-gold !px-6 !py-3.5">
              Get a free quote
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
