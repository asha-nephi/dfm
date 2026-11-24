import Link from "next/link";
import { submitLead } from "@/app/contact-actions";
import { HoneypotField } from "@/components/honeypot-field";
import { SubmitButton } from "@/components/submit-button";
import { AreaPicker } from "@/components/marketing/area-picker";
import { Icon } from "@/components/ui/icons";
import { SERVICES } from "@/lib/services";

export function ContactSection({
  sent,
  error,
  defaultService,
}: {
  sent?: boolean;
  error?: boolean;
  defaultService?: string;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <section id="contact" className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Get started</p>
            <h2 className="font-display mt-2 text-4xl text-navy-black sm:text-5xl">
              Book a service or ask a question.
            </h2>
            <p className="mt-4 leading-relaxed text-navy-black/70">
              Tell us what you need and where. We reply within 24 hours by email or WhatsApp,
              whatever time zone you&apos;re in.
            </p>

            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-8"
              >
                <Icon name="chat" className="h-4 w-4" />
                Message us on WhatsApp
              </a>
            ) : null}

            <ul className="mt-10 space-y-3 text-sm text-navy-black/75">
              {[
                "No lock-in contract — month to month",
                "You approve every repair price first",
                "Photo proof on every job",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-charcoal/10 text-charcoal">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-10 text-xs leading-relaxed text-navy-black/50">
              We only use what you share here to reply to you and, if you become a client, to
              look after your property. We don&apos;t sell your data. See our{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                privacy notice
              </Link>
              .
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-off-white p-6 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-gold-light">
                    <Icon name="check" />
                  </span>
                  <p className="font-display mt-4 text-2xl text-navy-black">Thank you — we got it.</p>
                  <p className="mt-2 text-sm text-navy-black/70">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form action={submitLead} className="space-y-5">
                  <HoneypotField />
                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      Something didn&apos;t go through. Please check the form and try again.
                    </p>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="label">Full name</label>
                      <input id="name" name="name" type="text" required placeholder="e.g. Tunde Adebayo" className="input" />
                    </div>
                    <div>
                      <label htmlFor="contact" className="label">Email or WhatsApp number</label>
                      <input id="contact" name="contact" type="text" required placeholder="+1, +44 or +234 / email" className="input" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service_interest" className="label">Service</label>
                    <select
                      id="service_interest"
                      name="service_interest"
                      defaultValue={defaultService ?? ""}
                      className="input"
                    >
                      <option value="">Not sure yet / general question</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                      <option value="management">Monthly property management</option>
                    </select>
                  </div>
                  <AreaPicker />
                  <div>
                    <label htmlFor="message" className="label">What do you need?</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Property type (flat, duplex, short-let), size, and what needs doing..."
                      className="input"
                    />
                  </div>
                  <SubmitButton className="btn-primary w-full !py-3.5">Send request</SubmitButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
