import Link from "next/link";
import { ProofCard } from "@/components/marketing/proof-card";
import { Icon } from "@/components/ui/icons";
import {
  COORDINATION_CAP,
  MONTHLY_FEE,
  SERVICES,
  SERVICE_AREAS,
  usdEstimate,
} from "@/lib/services";
import { formatNaira } from "@/lib/format";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-6">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/60 px-3 py-1.5 font-mono text-xs text-charcoal">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            IKEJA &middot; LAGOS, NIGERIA
          </span>
          <h1 className="font-display text-[2.6rem] leading-[1.06] text-navy-black sm:text-6xl lg:text-[64px]">
            Your Lagos property, cared for{" "}
            <span className="italic text-charcoal">while you&apos;re away.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-navy-black/75 sm:text-lg">
            Cleaning, AC servicing, electrical, plumbing and generator work — done by vetted
            artisans and proven with dated before-and-after photos and itemized costs. Book and
            approve everything from anywhere in the world.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/#contact" className="btn-primary !px-6 !py-3.5">
              Book a service
            </Link>
            <Link href="/services" className="btn-secondary !px-6 !py-3.5">
              See our services
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <p className="font-mono text-lg font-semibold text-charcoal sm:text-xl">5</p>
              <p className="mt-0.5 text-xs text-navy-black/60">Core services</p>
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-charcoal sm:text-xl">100%</p>
              <p className="mt-0.5 text-xs text-navy-black/60">Jobs with photo proof</p>
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-charcoal sm:text-xl">
                ₦{COORDINATION_CAP / 1000}k
              </p>
              <p className="mt-0.5 text-xs text-navy-black/60">Max fee per job</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <ProofCard />
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section id="services" className="border-t border-line bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {heading && (
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
              Five services, one trusted team.
            </h2>
            <p className="mt-4 text-navy-black/70">
              We find the client, send a vetted artisan, check the work and send you the proof.
              You deal with one company instead of five different people.
            </p>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-off-white p-7 transition hover:border-charcoal/40 hover:bg-white"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-charcoal text-gold-light">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-amber">0{i + 1}</span>
                </div>
                <h3 className="font-display mt-5 text-2xl text-charcoal">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-black/70">{s.short}</p>
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-navy-black/50">From</p>
                  <p className="font-mono text-lg font-semibold text-charcoal">
                    {formatNaira(s.fromPrice)}
                  </p>
                  <p className="text-[11px] text-navy-black/50">{usdEstimate(s.fromPrice)}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-charcoal">
                  Details
                  <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
          <div className="flex flex-col justify-between rounded-2xl bg-charcoal p-7 text-off-white">
            <div>
              <p className="eyebrow !text-gold-light">Monthly care</p>
              <h3 className="font-display mt-3 text-2xl">Full property management</h3>
              <p className="mt-2 text-sm leading-relaxed text-off-white/75">
                Regular checks, tenant requests handled and every job coordinated for one flat
                monthly fee.
              </p>
            </div>
            <div className="mt-6 border-t border-white/15 pt-4">
              <p className="font-mono text-lg font-semibold">
                {formatNaira(MONTHLY_FEE)}
                <span className="text-sm font-normal text-off-white/60"> / month</span>
              </p>
              <Link href="/pricing" className="mt-1 inline-block text-sm font-semibold text-gold-light">
                See pricing &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "You book",
    body: "Tell us what you need on the site, by WhatsApp or from your account. Add photos if you have them.",
    icon: "calendar",
  },
  {
    title: "You approve the price",
    body: "For repairs, we inspect first and send an itemized quote. Nothing starts until you say yes.",
    icon: "receipt",
  },
  {
    title: "A vetted artisan does the job",
    body: "We send someone from our checked roster who knows the trade and the area.",
    icon: "briefcase",
  },
  {
    title: "You get the proof",
    body: "Dated before-and-after photos and the final cost land in your account, with an email update.",
    icon: "camera",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
            Four steps. No guesswork.
          </h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card relative p-6">
              <span className="font-mono text-xs font-semibold text-amber">STEP 0{i + 1}</span>
              <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                <Icon name={step.icon} />
              </span>
              <h3 className="mt-4 font-semibold text-navy-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-black/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Abroad() {
  const points = [
    {
      icon: "globe",
      title: "Sign up from anywhere",
      body: "Create your account, add your Lagos property and book services from the US, UK, Canada or anywhere else.",
    },
    {
      icon: "wallet",
      title: "Pay the way that works for you",
      body: "Nigerian cards pay online with Paystack. Paying from abroad? We arrange a bank transfer and confirm it on your account.",
    },
    {
      icon: "chat",
      title: "Updates that fit your time zone",
      body: "Quotes, photos and receipts wait in your account. We also update you by email and WhatsApp.",
    },
    {
      icon: "shield",
      title: "Not right? We redo it",
      body: "If a job doesn't meet our standard, we send someone back to fix it at no extra labour cost.",
    },
  ];

  return (
    <section id="abroad" className="border-t border-line bg-charcoal text-off-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow !text-gold-light">For owners abroad</p>
            <h2 className="font-display mt-2 text-4xl sm:text-5xl">
              Manage your property from 5,000 miles away.
            </h2>
            <p className="mt-4 leading-relaxed text-off-white/75">
              No more sending money for &ldquo;urgent repairs&rdquo; with nothing to show for it,
              or asking relatives to cross Lagos traffic to check. You see what was wrong, what
              was done and what it cost.
            </p>
            <Link href="/#contact" className="btn-gold mt-8 !px-6 !py-3.5">
              Talk to us about your property
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {points.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/20 text-gold-light">
                  <Icon name={p.icon} />
                </span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-off-white/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const ROWS = [
  {
    bad: "Can't tell if the work was done",
    badBody: "A voice note saying \"the plumber finished\" — no photos, no record.",
    good: "Dated before-and-after photos",
    goodBody: "Every job has photos taken on the day, saved to your account.",
  },
  {
    bad: "Round-figure quotes",
    badBody: "Parts and labour lumped into one number, with hidden extras.",
    good: "Itemized, checked costs",
    goodBody: "Parts and labour listed line by line and checked against Lagos prices.",
  },
  {
    bad: "Small problems grow",
    badBody: "Nobody keeps a history, so a small leak becomes real damage.",
    good: "A running record",
    goodBody: "Every inspection and repair stays on file for your property.",
  },
];

export function Comparison() {
  return (
    <section id="why-dfm" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">Why DFM</p>
          <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
            The usual way vs. the DFM way
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="grid grid-cols-1 border-b border-line bg-off-white/80 md:grid-cols-2">
            <div className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-navy-black/55">
              A typical caretaker
            </div>
            <div className="border-line px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-charcoal md:border-l">
              Deseret Facility Management
            </div>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.bad}
              className={`grid grid-cols-1 md:grid-cols-2 ${i < ROWS.length - 1 ? "border-b border-line" : ""}`}
            >
              <div className="p-6 text-sm text-navy-black/65">
                <p className="mb-1 font-semibold text-navy-black">{r.bad}</p>
                <p>{r.badBody}</p>
              </div>
              <div className="border-line bg-charcoal/[0.03] p-6 text-sm md:border-l">
                <p className="mb-1 flex items-center gap-2 font-semibold text-charcoal">
                  <Icon name="check" className="h-4 w-4" />
                  {r.good}
                </p>
                <p className="text-navy-black/80">{r.goodBody}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Coverage() {
  return (
    <section id="coverage" className="border-t border-line bg-off-white py-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="eyebrow">Where we work</p>
          <h3 className="font-display mt-1 text-3xl text-navy-black">
            Based in Ikeja, growing across Lagos.
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {SERVICE_AREAS.map((a) => (
            <span
              key={a}
              className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-charcoal"
            >
              {a}
            </span>
          ))}
          <span className="rounded-full border border-charcoal/20 bg-charcoal/10 px-4 py-2 text-xs font-medium text-charcoal">
            + Other Lagos areas on request
          </span>
        </div>
      </div>
    </section>
  );
}
