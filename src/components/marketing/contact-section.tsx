import Link from "next/link";
import { submitLead } from "@/app/contact-actions";
import { HoneypotField } from "@/components/honeypot-field";
import { SubmitButton } from "@/components/submit-button";

export function ContactSection({
  sent,
  error,
}: {
  sent?: boolean;
  error?: boolean;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <section id="contact" className="bg-charcoal">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-off-white sm:text-3xl">
              Tell us about your property
            </h2>
            <p className="mt-4 text-off-white/70">
              Send a few details and we&apos;ll get back to you — or message
              us directly on WhatsApp if that&apos;s easier.
            </p>

            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-amber/90"
              >
                Message us on WhatsApp
              </a>
            ) : null}

            <p className="mt-10 text-xs leading-relaxed text-off-white/50">
              We only use what you share here to respond to your enquiry and,
              if you become a client, to manage your property. We don&apos;t
              sell or share your data with third parties. Full details in our{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                privacy notice
              </Link>
              .
            </p>
          </div>

          <div className="rounded-lg bg-off-white p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <p className="text-lg font-semibold text-navy-black">
                  Thanks — message received.
                </p>
                <p className="mt-2 text-sm text-navy-black/70">
                  We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form action={submitLead} className="space-y-4">
                <HoneypotField />
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    Something didn&apos;t go through — please check the form
                    and try again.
                  </p>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-navy-black">
                    Name
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
                  <label htmlFor="property_location" className="block text-sm font-medium text-navy-black">
                    Property location
                  </label>
                  <input
                    id="property_location"
                    name="property_location"
                    type="text"
                    placeholder="e.g. Opebi, Ikeja"
                    className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-navy-black">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                  />
                </div>
                <SubmitButton className="w-full rounded-lg bg-charcoal shadow-sm px-4 py-2.5 text-sm font-semibold text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Send
</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
