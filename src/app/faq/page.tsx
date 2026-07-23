import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata = { title: "FAQ — Deseret Facility Management" };

const FAQS = [
  {
    q: "Who is DFM for?",
    a: "Landlords who own property in Lagos but can't be there in person to check on it — most often diaspora or absentee owners. That covers both long-term-let (tenanted residential) properties and short-term-rental (Airbnb-style) properties.",
  },
  {
    q: "What does DFM actually do?",
    a: "We handle maintenance and repairs on your property, document every job with dated before-and-after photos, give you an itemized breakdown of what each repair cost, and keep a running record you can check from your dashboard at any time — no need to call and ask if something got done.",
  },
  {
    q: "How do I know the work was actually done?",
    a: "Every work order gets timestamped photos tied to that specific job, an itemized cost breakdown, and a status you can track from request through completion. It's not a text message saying \"done\" — it's a verifiable record.",
  },
  {
    q: "How does pricing work?",
    a: "A flat monthly management fee per property, repairs billed at actual cost with an itemized breakdown, and a small, clearly disclosed coordination fee on repair jobs — never a percentage of the repair cost, since that creates an incentive to inflate it. Exact naira figures depend on the property, so reach out and we'll scope it with you.",
  },
  {
    q: "Is there a contract, and can I cancel?",
    a: "Reach out to us directly and we'll walk you through the terms for your specific property — happy to answer this before you commit to anything.",
  },
  {
    q: "What areas do you serve?",
    a: "Ikeja and its immediate surroundings (GRA, Opebi, Allen Avenue, Maryland, Ogba) — we're expanding carefully as we take on more properties, since every property is personally overseen.",
  },
  {
    q: "How do I pay?",
    a: "Online, through Paystack — you'll see payment status and a full payment history on your client dashboard, plus printable statements for your records.",
  },
  {
    q: "What's different about short-term-rental properties?",
    a: "STR properties get a turnover checklist that the assigned artisan works through and checks off between guest stays, so you have a record of exactly what was checked before the next guest arrives.",
  },
  {
    q: "What's the co-host marketplace?",
    a: "A beta feature for STR hosts who want a local co-host to help with day-to-day guest logistics. DFM facilitates the introduction between host and co-host — we're not a party to any agreement that results from it. Full terms are on the ",
    link: { href: "/cohost/terms", label: "co-host Terms of Service" },
    aSuffix: " page.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is only visible to DFM admin and, scoped to their assigned jobs, the artisan working on your property. We don't sell or share it with third parties beyond the services that make the platform run. Full details in our ",
    link: { href: "/privacy", label: "privacy notice" },
    aSuffix: ".",
  },
  {
    q: "How do I get started?",
    a: "Send us a message with your property details from the contact form on the homepage, or message us directly on WhatsApp — we'll take it from there.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-navy-black">Frequently asked questions</h1>
        <p className="mt-3 text-navy-black/70">
          Don&apos;t see your question here? Reach out through the{" "}
          <Link href="/#contact" className="text-charcoal underline underline-offset-2">
            contact form
          </Link>{" "}
          and we&apos;ll answer directly.
        </p>

        <div className="mt-10 space-y-8">
          {FAQS.map((item) => (
            <div key={item.q} className="border-b border-charcoal/10 pb-8">
              <h2 className="text-lg font-semibold text-navy-black">{item.q}</h2>
              <p className="mt-2 text-navy-black/70">
                {item.a}
                {item.link && (
                  <Link href={item.link.href} className="text-charcoal underline underline-offset-2">
                    {item.link.label}
                  </Link>
                )}
                {item.aSuffix}
              </p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
