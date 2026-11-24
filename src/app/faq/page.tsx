import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Who is DFM for?",
    a: "Anyone with a property in Lagos who wants it looked after properly — especially owners who live abroad or can't be there in person. That includes tenanted homes, short-let apartments and owner-occupied homes.",
  },
  {
    q: "What services do you offer?",
    a: "Five core services: cleaning, AC servicing, electrical work, plumbing and generator servicing. You can book any of them one-off, or put your property on our monthly management plan and we coordinate everything.",
  },
  {
    q: "Who actually does the work?",
    a: "Vetted artisans from our own roster. We check their skills, ID and references before they join, and we check their work on every job with photos. You deal with DFM — one company — instead of finding and chasing different people yourself.",
  },
  {
    q: "What if I'm not happy with a job?",
    a: "Tell us within 7 days. If the work doesn't meet our standard, we send someone back to put it right at no extra labour cost.",
  },
  {
    q: "How do I know the work was actually done?",
    a: "Every work order gets timestamped photos tied to that specific job, an itemized cost breakdown, and a status you can track from request through completion. It's not a text message saying \"done\" — it's a verifiable record.",
  },
  {
    q: "How does pricing work?",
    a: "One-off services have starting prices on our pricing page (for example, cleaning from ₦25,000 per visit and AC servicing from ₦15,000 per unit). Monthly management is ₦40,000 per property. For repairs, artisan and materials costs are passed to you at the actual price, plus a 10% coordination fee that never goes above ₦20,000 per job.",
  },
  {
    q: "Is there a contract, and can I cancel?",
    a: "No lock-in contract — service runs month-to-month. Either of us can end it with 30 days' written notice, and there's no early-termination fee.",
  },
  {
    q: "What areas do you serve?",
    a: "Right now, Ikeja and its immediate surroundings in Lagos (Ikeja GRA, Opebi, Allen Avenue, Maryland, Ogba). We're expanding from there — if you're elsewhere in Lagos or beyond, reach out and we'll let you know when we can help.",
  },
  {
    q: "How do I pay?",
    a: "If you have a Nigerian bank card, online through Paystack — you'll see payment status and history on your dashboard. If you're paying from outside Nigeria, Paystack can't process that yet, so we'll arrange a direct bank transfer instead and confirm it on your account once received. Ask us about this when you reach out.",
  },
  {
    q: "What's different about short-term-rental properties?",
    a: "STR properties get a turnover checklist that the assigned artisan works through and checks off between guest stays, so you have a record of exactly what was checked before the next guest arrives.",
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <p className="eyebrow">FAQ</p>
        <h1 className="font-display mt-2 text-5xl text-navy-black">Questions owners ask us</h1>
        <p className="mt-4 text-navy-black/70">
          Don&apos;t see yours? Ask us through the{" "}
          <Link href="/#contact" className="font-medium text-charcoal underline underline-offset-2">
            contact form
          </Link>{" "}
          and we&apos;ll answer directly.
        </p>

        <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {FAQS.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-navy-black hover:bg-off-white/60">
                {item.q}
                <span className="text-xl text-charcoal transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-navy-black/70">
                {item.a}
                {item.link && (
                  <Link href={item.link.href} className="text-charcoal underline underline-offset-2">
                    {item.link.label}
                  </Link>
                )}
                {item.aSuffix}
              </p>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
