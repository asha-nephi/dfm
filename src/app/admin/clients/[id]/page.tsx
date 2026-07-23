import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { propertyTypeLabel } from "@/lib/format";
import { createProperty } from "../actions";
import { SubmitButton } from "@/components/submit-button";

export default async function AdminClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ property_added?: string; error?: string }>;
}) {
  const { id } = await params;
  const { property_added, error } = await searchParams;
  const supabase = await createClient();

  const { data: clientRecord } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!clientRecord) notFound();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/admin/clients" className="text-sm text-charcoal underline underline-offset-2">
        &larr; All clients
      </Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-black">{clientRecord.name}</h1>
          <p className="mt-1 text-sm text-navy-black/60">{clientRecord.email}</p>
          {clientRecord.phone && (
            <p className="text-sm text-navy-black/60">{clientRecord.phone}</p>
          )}
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-black/70">
          {clientRecord.auth_user_id ? "Account active" : "Not yet activated"}
        </span>
      </div>

      <section className="mt-8 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Add a property</h2>
        {property_added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Property added.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please try again.
          </p>
        )}
        <form action={createProperty} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="clientId" value={clientRecord.id} />
          <input
            name="address"
            placeholder="Property address"
            required
            className="sm:col-span-2 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <select
            name="propertyType"
            defaultValue="long_term_let"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          >
            <option value="long_term_let">Long-term let</option>
            <option value="short_term_rental">Short-term rental</option>
          </select>
          <input
            name="notes"
            placeholder="Notes (gate code, access instructions, etc.)"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <SubmitButton className="sm:col-span-2 w-fit rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Add property
</SubmitButton>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-navy-black">Properties</h2>
        {!properties || properties.length === 0 ? (
          <p className="mt-3 text-sm text-navy-black/60">No properties yet.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {properties.map((p) => (
              <Link
                key={p.id}
                href={`/admin/properties/${p.id}`}
                className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
              >
                <span className="inline-block rounded-full bg-off-white px-2.5 py-0.5 text-xs font-medium text-navy-black/70">
                  {propertyTypeLabel(p.property_type)}
                </span>
                <h3 className="mt-3 font-semibold text-navy-black">{p.address}</h3>
                {p.notes && <p className="mt-1 text-sm text-navy-black/60">{p.notes}</p>}
              </Link>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
