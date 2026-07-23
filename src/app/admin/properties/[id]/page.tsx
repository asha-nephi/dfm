import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { createWorkOrder, updateProperty } from "./actions";

export default async function AdminPropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { id } = await params;
  const { error, updated } = await searchParams;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*, clients(id, name, email)")
    .eq("id", id)
    .maybeSingle();

  if (!property) notFound();

  const { data: workOrders } = await supabase
    .from("work_orders")
    .select("*")
    .eq("property_id", id)
    .order("date", { ascending: false });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <Link
        href={`/admin/clients/${property.clients?.id}`}
        className="text-sm text-charcoal underline underline-offset-2"
      >
        &larr; {property.clients?.name ?? "Client"}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-navy-black">{property.address}</h1>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please try again.
        </p>
      )}
      {updated && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Property updated.
        </p>
      )}

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Property details</h2>
        <form action={updateProperty} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="propertyId" value={property.id} />
          <input
            name="address"
            defaultValue={property.address}
            required
            className="sm:col-span-2 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <select
            name="propertyType"
            defaultValue={property.property_type}
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          >
            <option value="long_term_let">Long-term let</option>
            <option value="short_term_rental">Short-term rental</option>
          </select>
          <input
            name="notes"
            defaultValue={property.notes ?? ""}
            placeholder="Notes"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <button
            type="submit"
            className="sm:col-span-2 w-fit rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Save changes
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Log a work order</h2>
        <form action={createWorkOrder} className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <input type="hidden" name="propertyId" value={property.id} />
          <input
            type="date"
            name="date"
            defaultValue={today}
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            name="description"
            placeholder="What was done or needs doing"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Create
          </button>
        </form>
        <p className="mt-2 text-xs text-navy-black/50">
          Creates the record — add costs, photos, and assign an artisan on the next screen.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-navy-black">Work orders</h2>
        {!workOrders || workOrders.length === 0 ? (
          <p className="mt-3 text-sm text-navy-black/60">No work orders logged yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {workOrders.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={`/admin/work-orders/${wo.id}`}
                  className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 hover:border-amber/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-navy-black/60">{formatDate(wo.date)}</p>
                    <p className="mt-0.5 text-navy-black">{wo.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {wo.flagged_for_review && (
                      <span className="text-xs font-medium text-amber-900">Flagged</span>
                    )}
                    <span className="text-sm text-navy-black/70">
                      {formatNaira(wo.cost_amount)}
                    </span>
                    <StatusBadge status={wo.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
