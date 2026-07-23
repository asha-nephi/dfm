import Link from "next/link";
import { submitCohostRequest } from "@/app/cohost-actions";
import { HoneypotField } from "@/components/honeypot-field";
import { SubmitButton } from "@/components/submit-button";

export function CohostSection({ error }: { error: boolean }) {
  return (
    <section id="cohost" className="bg-off-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6 sm:p-8">
          <span className="inline-block rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
            Beta &middot; Request access
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-navy-black">
            Host/co-host marketplace
          </h2>
          <p className="mt-3 max-w-2xl text-navy-black/70">
            If you host a short-term rental and want a co-host to help manage
            it, tell us about the property and we&apos;ll help match you with
            someone. DFM facilitates the introduction only — we&apos;re not a
            party to any agreement between you and a co-host. Full details in
            the{" "}
            <Link href="/cohost/terms" className="text-charcoal underline underline-offset-2">
              Terms of Service
            </Link>
            .
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Something went wrong submitting your request — please try again.
            </p>
          )}

          <form action={submitCohostRequest} className="mt-6 grid gap-3 sm:grid-cols-2">
            <HoneypotField />
            <input
              name="host_name"
              placeholder="Your name"
              required
              className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <input
              name="host_contact"
              placeholder="Email or WhatsApp number"
              required
              className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <textarea
              name="property_description"
              placeholder="Tell us about the property (location, type, what you need help with)"
              required
              rows={3}
              className="sm:col-span-2 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <label className="sm:col-span-2 flex items-start gap-2 text-sm text-navy-black/70">
              <input type="checkbox" name="agree_terms" required className="mt-0.5" />
              <span>
                I agree to the{" "}
                <Link href="/cohost/terms" className="text-charcoal underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                for the co-host marketplace.
              </span>
            </label>
            <SubmitButton className="sm:col-span-2 w-fit rounded-lg bg-charcoal shadow-sm px-6 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Request access
</SubmitButton>
          </form>
          <p className="mt-4 text-xs text-navy-black/50">
            After submitting, we&apos;ll show you a private link to check on
            your request — save it, as we don&apos;t currently email it to
            you automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
