import Link from "next/link";
import { Icon } from "@/components/ui/icons";

const ROWS = [
  {
    icon: "chat",
    eyebrow: "Step 1",
    title: "Free, no-obligation quote",
    body: "Tell us about your property and what you need. We reply with a clear price, usually within 24 hours.",
  },
  {
    icon: "receipt",
    eyebrow: "Step 2",
    title: "Itemized before anything starts",
    body: "Repairs are broken down into parts, labour and our fee. Nothing starts until you approve it.",
  },
  {
    icon: "shield",
    eyebrow: "Step 3",
    title: "Pay for what was done",
    body: "Parts are charged at the actual cost, with receipts. No hidden markups, no surprise extras.",
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
              A fair price for your property, agreed up front.
            </h2>
            <p className="mt-4 leading-relaxed text-navy-black/70">
              No two homes are the same, so we don&apos;t use a one-size price list. You get a
              quote for your property and your job, and you always know what you&apos;re paying
              for before we start.
            </p>
            <Link href="/#contact" className="btn-primary mt-6">
              Get a free quote
            </Link>
          </div>
          <div className="divide-y divide-line rounded-2xl border border-line bg-off-white lg:col-span-7">
            {ROWS.map((r) => (
              <div key={r.title} className="flex items-start gap-5 p-6 sm:p-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-charcoal text-gold-light">
                  <Icon name={r.icon} />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-amber">{r.eyebrow}</p>
                  <h3 className="font-display mt-1 text-2xl text-navy-black">{r.title}</h3>
                  <p className="mt-1 text-sm text-navy-black/70">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
