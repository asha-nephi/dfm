import Link from "next/link";
import { COORDINATION_CAP, MONTHLY_FEE } from "@/lib/services";
import { formatNaira } from "@/lib/format";

const ROWS = [
  {
    eyebrow: "One-off services",
    title: "Pay per job",
    body: "Book a single clean, AC service or repair. Starting prices are listed for every service.",
    value: "From ₦15,000",
    note: "per visit or inspection",
  },
  {
    eyebrow: "Monthly care",
    title: "Flat management fee",
    body: "Regular property checks, tenant requests handled and a running record of every job.",
    value: formatNaira(MONTHLY_FEE),
    note: "per property, per month",
  },
  {
    eyebrow: "Repairs",
    title: "Capped coordination fee",
    body: "10% of the artisan and materials cost, for finding the artisan, checking the work and the photo report.",
    value: "10%",
    note: `never more than ${formatNaira(COORDINATION_CAP)} per job`,
  },
];

export function PricingSummary() {
  return (
    <section id="pricing" className="border-t border-line bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Pricing</p>
            <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
              Simple prices. No hidden markups.
            </h2>
            <p className="mt-4 leading-relaxed text-navy-black/70">
              Artisan and materials costs are passed to you at the actual price, with receipts.
              Our fee is shown on its own line, so you always know what you&apos;re paying for.
            </p>
            <Link href="/pricing" className="btn-secondary mt-6">
              Full price list &amp; fee calculator
            </Link>
          </div>
          <div className="divide-y divide-line rounded-2xl border border-line bg-off-white lg:col-span-7">
            {ROWS.map((r) => (
              <div
                key={r.title}
                className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-amber">{r.eyebrow}</p>
                  <h3 className="font-display mt-1 text-2xl text-navy-black">{r.title}</h3>
                  <p className="mt-1 text-sm text-navy-black/70">{r.body}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="font-mono text-2xl font-bold text-charcoal sm:text-3xl">{r.value}</p>
                  <p className="text-xs text-navy-black/60">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
