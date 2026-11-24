import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingSummary } from "@/components/marketing/pricing-summary";
import { FeeCalculator } from "@/components/marketing/fee-calculator";
import { SERVICES, USD_RATE, usdEstimate } from "@/lib/services";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting prices for cleaning, AC servicing, electrical, plumbing and generator servicing in Lagos, plus our monthly management fee and capped coordination fee.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <p className="eyebrow">Pricing</p>
          <h1 className="font-display mt-2 max-w-3xl text-5xl text-navy-black sm:text-6xl">
            Clear prices before any work starts.
          </h1>
          <p className="mt-4 max-w-2xl text-navy-black/70">
            These are starting prices. Repairs always get an itemized quote for your approval
            first. Dollar amounts are rough guides at about ₦{USD_RATE.toLocaleString()} to $1 —
            you pay in naira.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-off-white font-mono text-xs uppercase tracking-wider text-navy-black/55">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">What the price covers</th>
                  <th className="px-6 py-4 text-right font-medium">From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SERVICES.map((s) => (
                  <tr key={s.slug}>
                    <td className="px-6 py-5 align-top">
                      <Link href={`/services/${s.slug}`} className="font-semibold text-charcoal hover:underline">
                        {s.name}
                      </Link>
                      <p className="mt-1 text-xs text-navy-black/60 md:hidden">{s.priceNote}</p>
                    </td>
                    <td className="hidden px-6 py-5 align-top text-navy-black/70 md:table-cell">
                      {s.priceNote}
                    </td>
                    <td className="px-6 py-5 text-right align-top">
                      <p className="font-mono font-semibold text-navy-black">{formatNaira(s.fromPrice)}</p>
                      <p className="text-xs text-navy-black/50">{usdEstimate(s.fromPrice)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <PricingSummary />

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <p className="eyebrow">Fee calculator</p>
              <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
                See how the ₦20,000 cap protects you.
              </h2>
              <p className="mt-4 text-navy-black/70">
                Move the slider to any job size. Our fee is 10% until the job reaches ₦200,000,
                then it stops growing.
              </p>
            </div>
            <div className="lg:col-span-7">
              <FeeCalculator />
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
              Get a quote
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
