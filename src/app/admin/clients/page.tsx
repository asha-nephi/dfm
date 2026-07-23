import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClientRecord } from "./actions";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const { added, error } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*, properties(id)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Clients</h1>

      <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-6">
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
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <input
            name="phone"
            placeholder="Phone / WhatsApp"
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <button
            type="submit"
            className="sm:col-span-3 w-fit rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Add client
          </button>
        </form>
        <p className="mt-3 text-xs text-navy-black/50">
          Once added, the client can set their password at /signup using this
          same email.
        </p>
      </section>

      <section className="mt-8">
        {!clients || clients.length === 0 ? (
          <p className="text-sm text-navy-black/60">No clients yet.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 rounded-lg border border-charcoal/10 bg-white">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-off-white"
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
