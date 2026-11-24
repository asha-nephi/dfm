import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icons";
import { SERVICES, getService } from "@/lib/services";
import { bookService } from "./actions";

export default async function BookServicePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; property?: string; error?: string }>;
}) {
  const { service, property, error } = await searchParams;
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("id, address")
    .order("created_at", { ascending: false });

  const preselected = getService(service)?.slug ?? SERVICES[0].slug;

  return (
    <div>
      <PageHeader
        eyebrow="New request"
        title="Book a service"
        description="Tell us what you need. We'll confirm the artisan and timing, and for repairs we send an itemized quote before any work starts."
      />

      {!properties || properties.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No property on your account yet"
            body="DFM adds your property after your first call with us. Message us and we'll set it up."
            action={
              <Link href="/client/messages" className="btn-primary">
                Message DFM
              </Link>
            }
          />
        </div>
      ) : (
        <form action={bookService} className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Something didn&apos;t go through. Please check the form and try again.
              </p>
            )}

            <fieldset>
              <legend className="label">1. Which service?</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <label
                    key={s.slug}
                    className="card flex cursor-pointer items-start gap-3 p-4 transition hover:border-charcoal/40 has-[:checked]:border-charcoal has-[:checked]:ring-2 has-[:checked]:ring-charcoal/15"
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={s.slug}
                      defaultChecked={s.slug === preselected}
                      className="mt-1 accent-charcoal"
                    />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-semibold text-navy-black">
                        <Icon name={s.icon} className="h-4 w-4 text-charcoal" />
                        {s.name}
                      </span>
                      <span className="mt-1 block text-xs text-navy-black/60">{s.short}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="propertyId" className="label">2. Which property?</label>
              <select id="propertyId" name="propertyId" defaultValue={property ?? properties[0].id} className="input">
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.address}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="label">3. What needs doing?</label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="e.g. Master bedroom AC is leaking water and not cooling. Or: 3-bedroom flat needs a deep clean before new tenants move in."
                className="input"
              />
            </div>

            <div>
              <label htmlFor="preferredTiming" className="label">4. When suits you? (optional)</label>
              <input
                id="preferredTiming"
                name="preferredTiming"
                type="text"
                placeholder="e.g. Any weekday next week, or before 30 Nov"
                className="input"
              />
              <p className="mt-1.5 text-xs text-navy-black/55">
                Times are in Lagos time (WAT). If a tenant needs to let us in, tell us here.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="card sticky top-8 p-6">
              <p className="eyebrow">What happens next</p>
              <ol className="mt-4 space-y-4 text-sm text-navy-black/75">
                {[
                  "We confirm your request and timing, usually within 24 hours.",
                  "For repairs, we inspect and send an itemized quote for your OK.",
                  "A vetted artisan does the job.",
                  "You get dated before-and-after photos and the final cost.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal font-mono text-xs text-gold-light">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
              <SubmitButton className="btn-primary mt-6 w-full !py-3">Send request</SubmitButton>
              <p className="mt-3 text-center text-xs text-navy-black/50">
                You won&apos;t be charged until you approve a price.
              </p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
