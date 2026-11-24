import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HowItWorks, ServicesGrid } from "@/components/marketing/home-sections";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cleaning, AC servicing, electrical, plumbing and generator servicing for Lagos properties — by vetted artisans, with photo proof.",
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <p className="eyebrow">Services</p>
          <h1 className="font-display mt-2 max-w-3xl text-5xl text-navy-black sm:text-6xl">
            Everything your property needs, from one trusted team.
          </h1>
          <p className="mt-4 max-w-2xl text-navy-black/70">
            We vet every artisan, check their work and send you dated photos and itemized costs.
            Pick a service to see what&apos;s included.
          </p>
          <Link href="/#contact" className="btn-primary mt-8 !px-6 !py-3.5">
            Book a service
          </Link>
        </section>
        <ServicesGrid heading={false} />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
