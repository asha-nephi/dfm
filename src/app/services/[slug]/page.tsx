import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HowItWorks } from "@/components/marketing/home-sections";
import { Icon } from "@/components/ui/icons";
import { SERVICES, getService } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} in Lagos`,
    description: `${service.short} ${service.tagline} Free quote within 24 hours.`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link href="/services" className="text-sm font-medium text-charcoal hover:underline">
            &larr; All services
          </Link>
          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal text-gold-light">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h1 className="font-display mt-5 text-5xl text-navy-black sm:text-6xl">{service.name}</h1>
              <p className="mt-4 max-w-xl text-lg text-navy-black/75">{service.tagline}</p>

              <h2 className="mt-10 font-semibold text-navy-black">What&apos;s included</h2>
              <ul className="mt-4 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-navy-black/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal/10 text-charcoal">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-semibold text-navy-black">Good for</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.goodFor.map((g) => (
                  <span key={g} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-charcoal">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="card sticky top-28 p-7">
                <p className="eyebrow">Free quote</p>
                <p className="font-display mt-2 text-3xl text-navy-black">
                  Get a price for your property
                </p>
                <p className="mt-2 text-sm text-navy-black/70">
                  Tell us what you need and we reply with a clear quote, usually within 24 hours.
                  No obligation.
                </p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-navy-black/55">
                  What affects the price
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-navy-black/75">
                  {service.quoteFactors.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-navy-black/75">
                  <p className="flex items-center gap-2"><Icon name="camera" className="h-4 w-4 text-charcoal" /> Dated before-and-after photos</p>
                  <p className="flex items-center gap-2"><Icon name="receipt" className="h-4 w-4 text-charcoal" /> Itemized costs, you approve first</p>
                  <p className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4 text-charcoal" /> We redo it if it&apos;s not right</p>
                </div>
                <Link href={`/?service=${service.slug}#contact`} className="btn-primary mt-7 w-full !py-3.5">
                  Get a free quote
                </Link>
                <Link href="/login" className="mt-3 block text-center text-sm text-navy-black/60 hover:text-charcoal">
                  Already a client? Book from your account
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <HowItWorks />

        <section className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="eyebrow">Other services</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="card flex items-center gap-3 p-5 transition hover:border-charcoal/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                    <Icon name={s.icon} />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy-black">{s.name}</span>
                    <span className="text-xs text-navy-black/55">{s.short}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
