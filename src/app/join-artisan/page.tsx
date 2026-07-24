import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HoneypotField } from "@/components/honeypot-field";
import { SubmitButton } from "@/components/submit-button";
import { submitArtisanApplication } from "./actions";

export const metadata: Metadata = { title: "Join our artisan network" };

export default async function JoinArtisanPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { submitted, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-navy-black">Join our artisan network</h1>
        <p className="mt-3 text-navy-black/70">
          DFM works with a vetted roster of plumbers, electricians, carpenters,
          painters, and other trades across Lagos. Tell us about your trade
          and where you work, and we&apos;ll reach out when there&apos;s a job
          that fits — this isn&apos;t open signup, every applicant is
          reviewed before being added.
        </p>

        <div className="mt-8 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-navy-black">
                Thanks — application received.
              </p>
              <p className="mt-2 text-sm text-navy-black/70">
                We&apos;ll review it and reach out if it&apos;s a fit.
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
                <label htmlFor="name" className="block text-sm font-medium text-navy-black">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-navy-black">
                  Email or WhatsApp number
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                />
              </div>
              <div>
                <label htmlFor="trade" className="block text-sm font-medium text-navy-black">
                  Trade / skill
                </label>
                <input
                  id="trade"
                  name="trade"
                  type="text"
                  required
                  placeholder="e.g. Plumber, Electrician, AC technician"
                  className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                />
              </div>
              <div>
                <label htmlFor="service_area" className="block text-sm font-medium text-navy-black">
                  Areas you work in
                </label>
                <input
                  id="service_area"
                  name="service_area"
                  type="text"
                  placeholder="e.g. Ikeja, Ogba, Maryland"
                  className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-navy-black">
                  Experience (optional)
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  placeholder="How long you've worked in the trade, past jobs, anything worth knowing"
                  className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                />
              </div>
              <SubmitButton className="w-full rounded-lg bg-charcoal shadow-sm px-4 py-2.5 text-sm font-semibold text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Submit application
</SubmitButton>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
