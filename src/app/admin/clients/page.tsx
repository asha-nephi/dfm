import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClientRecord } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string; q?: string }>;
}) {
  const { added, error, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("*, properties(id)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: clients } = await query;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Clients</h1>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Add a client</h2>
        {added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Client added.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <form action={createClientRecord} className="mt-4 grid gap-3 sm:grid-cols-3">
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
          <SubmitButton className="sm:col-span-3 w-fit rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Add client
</SubmitButton>
        </form>
        <p className="mt-3 text-xs text-navy-black/50">
          Once added, the client can set their password at /signup using this
          same email.
        </p>
      </section>

      <section className="mt-8">
        <form className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name or email..."
            className="w-full max-w-xs rounded-lg border border-charcoal/15 bg-white px-3.5 py-2 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          {q && (
            <Link
              href="/admin/clients"
              className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm text-navy-black hover:border-charcoal/40"
            >
              Clear
            </Link>
          )}
        </form>

        {!clients || clients.length === 0 ? (
          <p className="mt-4 text-sm text-navy-black/60">
            {q ? "No clients match that search." : "No clients yet."}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="flex flex-col gap-1 px-5 py-4 hover:bg-off-white sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div>
                    <p className="font-medium text-navy-black">{c.name}</p>
                    <p className="text-sm text-navy-black/60">{c.email}</p>
                  </div>
                  <span className="text-sm text-navy-black/50">
                    {c.properties?.length ?? 0} propert
                    {(c.properties?.length ?? 0) === 1 ? "y" : "ies"}
                    {c.auth_user_id ? "" : " · not yet activated"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
