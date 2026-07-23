import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira, propertyTypeLabel } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { submitMaintenanceRequest } from "./actions";

type CostLineItem = { label?: string; amount?: number };

export default async function ClientPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ request_sent?: string; request_error?: string }>;
}) {
  const { id } = await params;
  const { request_sent, request_error } = await searchParams;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!property) notFound();

  const { data: workOrders } = await supabase
    .from("work_orders")
    .select("*, work_order_photos(*)")
    .eq("property_id", id)
    .order("date", { ascending: false });

  // photo_url stores the storage object path (private bucket), not a public
  // URL — resolve every path in one batch call to a short-lived signed URL.
  const allPaths = (workOrders ?? []).flatMap((wo) =>
    (wo.work_order_photos ?? []).map((p) => p.photo_url),
  );
  const signedUrlByPath = new Map<string, string>();
  if (allPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("work-order-photos")
      .createSignedUrls(allPaths, 60 * 60);
    signed?.forEach((s) => {
      if (s.signedUrl) signedUrlByPath.set(s.path ?? "", s.signedUrl);
    });
  }

  return (
    <div>
      <Link href="/client" className="text-sm text-charcoal underline underline-offset-2">
        &larr; All properties
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-navy-black/70">
            {propertyTypeLabel(property.property_type)}
          </span>
          <h1 className="mt-2 text-2xl font-semibold text-navy-black">
            {property.address}
          </h1>
          {property.notes && (
            <p className="mt-1 text-sm text-navy-black/60">{property.notes}</p>
          )}
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="font-semibold text-navy-black">Submit a maintenance request</h2>
        {request_sent && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Request submitted — DFM will review and follow up.
          </p>
        )}
        {request_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please try again.
          </p>
        )}
        <form action={submitMaintenanceRequest} className="mt-4 space-y-3">
          <input type="hidden" name="propertyId" value={property.id} />
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Describe what needs attention..."
            className="w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <button
            type="submit"
            className="rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Submit request
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold text-navy-black">Maintenance history</h2>

        {!workOrders || workOrders.length === 0 ? (
          <p className="mt-3 text-sm text-navy-black/60">
            No maintenance activity recorded yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {workOrders.map((wo) => {
              const breakdown = Array.isArray(wo.cost_breakdown)
                ? (wo.cost_breakdown as CostLineItem[])
                : [];
              return (
                <li key={wo.id} className="rounded-lg border border-charcoal/10 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-navy-black/60">
                      {formatDate(wo.date)}
                    </span>
                    <StatusBadge status={wo.status} />
                  </div>
                  <p className="mt-2 text-navy-black">{wo.description}</p>

                  {wo.flagged_for_review && (
                    <p className="mt-2 text-xs font-medium text-amber-900">
                      Flagged for review{wo.flag_reason ? `: ${wo.flag_reason}` : ""}
                    </p>
                  )}

                  {breakdown.length > 0 && (
                    <div className="mt-4 border-t border-charcoal/10 pt-3">
                      <table className="w-full text-sm">
                        <tbody>
                          {breakdown.map((item, i) => (
                            <tr key={i} className="text-navy-black/70">
                              <td className="py-0.5">{item.label ?? "Item"}</td>
                              <td className="py-0.5 text-right">
                                {formatNaira(item.amount ?? 0)}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium text-navy-black">
                            <td className="pt-1">Total</td>
                            <td className="pt-1 text-right">
                              {formatNaira(wo.cost_amount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {wo.work_order_photos && wo.work_order_photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {wo.work_order_photos.map((photo) => {
                        const url = signedUrlByPath.get(photo.photo_url);
                        if (!url) return null;
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={photo.id}
                            src={url}
                            alt={photo.caption ?? "Maintenance photo"}
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
