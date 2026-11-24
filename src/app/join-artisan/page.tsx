import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HoneypotField } from "@/components/honeypot-field";
import { SubmitButton } from "@/components/submit-button";
import { submitArtisanApplication } from "./actions";
import { TradeSelect } from "@/components/trade-select";

export const metadata: Metadata = { title: "Join our artisan network" };

export default async function JoinArtisanPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string; duplicate?: string }>;
}) {
  const { submitted, error, duplicate } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
        <p className="eyebrow">Work with us</p>
        <h1 className="font-display mt-2 text-5xl text-navy-black">Join our artisan network</h1>
        <p className="mt-4 leading-relaxed text-navy-black/70">
          We send steady, paid jobs to skilled cleaners, AC technicians, electricians, plumbers
          and generator technicians across Lagos. Clients pay DFM, and we pay you promptly
          after each job is checked.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-navy-black/75">
          {[
            "Jobs near where you already work",
            "Clear job details and agreed prices before you go",
            "Payment straight to your bank account",
            "Every applicant is checked: ID, a call and a reference",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal/10 text-xs font-bold text-charcoal">&#10003;</span>
              {t}
            </li>
          ))}
        </ul>
        </div>

        <div className="lg:col-span-7">
        <div className="card p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-navy-black">
                Thanks — application received.
              </p>
              <p className="mt-2 text-sm text-navy-black/70">
                We&apos;ll review it and reach out if it&apos;s a fit.
              </p>
            </div>
          ) : duplicate ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-navy-black">
                You already have an application under review.
              </p>
              <p className="mt-2 text-sm text-navy-black/70">
                No need to submit again — we&apos;ll reach out once it&apos;s been reviewed.
              </p>
            </div>
          ) : (
            <form action={submitArtisanApplication} className="space-y-4">
              <HoneypotField />
              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  Something didn&apos;t go through — please check the form and try again.
                </p>
              )}
              <div>
                <label htmlFor="name" className="label">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 input"
                />
              </div>
              <div>
                <label htmlFor="contact" className="label">
                  Email or WhatsApp number
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  className="mt-1 input"
                />
              </div>
              <div>
                <label htmlFor="trade" className="label">
                  Trade / skill
                </label>
                <TradeSelect />
              </div>
              <div>
                <label htmlFor="service_area" className="label">
                  Areas you work in
                </label>
                <input
                  id="service_area"
                  name="service_area"
                  type="text"
                  placeholder="e.g. Ikeja, Ogba, Maryland"
                  className="mt-1 input"
                />
              </div>
              <div>
                <label htmlFor="experience" className="label">
                  Experience (optional)
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  placeholder="How long you've worked in the trade, past jobs, anything worth knowing"
                  className="mt-1 input"
                />
              </div>

              <div className="border-t border-charcoal/10 pt-4">
                <p className="text-sm font-medium text-navy-black">Vetting details</p>
                <p className="mt-1 text-xs text-navy-black/50">
                  We ask for these so every artisan on the roster is a real,
                  checkable person before they ever go into a client&apos;s
                  property — not extra bureaucracy for its own sake.
                </p>
              </div>
              <div>
                <label htmlFor="id_document" className="label">
                  Photo of a valid ID
                </label>
                <input
                  id="id_document"
                  name="id_document"
                  type="file"
                  accept="image/*,.pdf"
                  required
                  className="mt-1 w-full text-sm text-navy-black file:mr-3 file:rounded-lg file:border-0 file:bg-charcoal file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-off-white"
                />
                <p className="mt-1 text-xs text-navy-black/50">
                  NIN slip, voter&apos;s card, or driver&apos;s license — a clear photo is fine.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="reference_name" className="label">
                    Reference name
                  </label>
                  <input
                    id="reference_name"
                    name="reference_name"
                    type="text"
                    required
                    placeholder="A past client or employer"
                    className="mt-1 input"
                  />
                </div>
                <div>
                  <label htmlFor="reference_contact" className="label">
                    Reference phone / WhatsApp
                  </label>
                  <input
                    id="reference_contact"
                    name="reference_contact"
                    type="text"
                    required
                    className="mt-1 input"
                  />
                </div>
              </div>

              <SubmitButton className="w-full btn-primary">
  Submit application
</SubmitButton>
            </form>
          )}
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
