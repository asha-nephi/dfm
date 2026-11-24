import { createClient } from "@/lib/supabase/server";
import { createArtisan } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { TradeSelect } from "@/components/trade-select";

const PRIORITY_TRADES = ["Cleaner", "AC Technician", "Electrician", "Plumber", "Generator Technician"];

export default async function AdminArtisansPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const { added, error } = await searchParams;
  const supabase = await createClient();
  const { data: artisans } = await supabase
    .from("artisans")
    .select("*")
    .order("created_at", { ascending: false });

  const roster = artisans ?? [];
  const countByTrade = new Map<string, number>();
  let otherCount = 0;
  for (const a of roster) {
    if (a.trade && PRIORITY_TRADES.includes(a.trade)) {
      countByTrade.set(a.trade, (countByTrade.get(a.trade) ?? 0) + 1);
    } else {
      otherCount++;
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-black sm:text-4xl">Artisans</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        DFM&apos;s own vetted roster — not open signup. Add someone here, and
        they set their password at /signup using this email.
      </p>

      {roster.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {PRIORITY_TRADES.map((trade) => (
            <span
              key={trade}
              className="rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-sm text-navy-black"
            >
              {trade}: <span className="font-semibold">{countByTrade.get(trade) ?? 0}</span>
            </span>
          ))}
          <span className="rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-sm text-navy-black/60">
            Other: <span className="font-semibold">{otherCount}</span>
          </span>
        </div>
      )}

      <section className="mt-6 card p-6">
        <h2 className="font-semibold text-navy-black">Add an artisan</h2>
        {added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Artisan added.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <form action={createArtisan} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            placeholder="Full name"
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="input"
          />
          <input
            name="phone"
            placeholder="Phone / WhatsApp"
            className="input"
          />
          <input
            name="service_area"
            placeholder="Areas they work in (optional)"
            className="input"
          />
          <div className="sm:col-span-2">
            <TradeSelect />
          </div>
          <SubmitButton className="sm:col-span-2 w-fit btn-primary">
  Add artisan
</SubmitButton>
        </form>
      </section>

      <section className="mt-8">
        {roster.length === 0 ? (
          <p className="text-sm text-navy-black/60">No artisans yet.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 card">
            {roster.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <p className="font-medium text-navy-black">
                    {a.name}
                    {a.trade && (
                      <span className="ml-2 font-normal text-navy-black/60">&middot; {a.trade}</span>
                    )}
                  </p>
                  <p className="text-sm text-navy-black/60">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
                    {a.service_area ? ` · ${a.service_area}` : ""}
                  </p>
                </div>
                <span className="text-sm text-navy-black/50">
                  {a.auth_user_id ? "Account active" : "Not yet activated"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
