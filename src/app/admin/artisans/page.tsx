import { createClient } from "@/lib/supabase/server";
import { createArtisan } from "./actions";

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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Artisans</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        DFM&apos;s own vetted roster — not open signup. Add someone here, and
        they set their password at /signup using this email.
      </p>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Add an artisan</h2>
        {added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Artisan added.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <form action={createArtisan} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            placeholder="Full name"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            name="phone"
            placeholder="Phone / WhatsApp"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <button
            type="submit"
            className="sm:col-span-3 w-fit rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Add artisan
          </button>
        </form>
      </section>

      <section className="mt-8">
        {!artisans || artisans.length === 0 ? (
          <p className="text-sm text-navy-black/60">No artisans yet.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
            {artisans.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <p className="font-medium text-navy-black">{a.name}</p>
                  <p className="text-sm text-navy-black/60">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
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
