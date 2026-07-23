import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira, propertyTypeLabel } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { WorkOrderComments } from "@/components/work-order-comments";
import { submitMaintenanceRequest, addComment } from "./actions";
import { RatingForm } from "./rating-form";

type CostLineItem = { label?: string; amount?: number };
type ChecklistItem = { item?: string; done?: boolean };

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

  const [{ data: workOrders }, { data: schedules }] = await Promise.all([
    supabase
      .from("work_orders")
      .select("*, work_order_photos(*)")
      .eq("property_id", id)
      .order("date", { ascending: false }),
    supabase
      .from("maintenance_schedules")
      .select("*")
      .eq("property_id", id)
      .eq("active", true)
      .order("next_due_date", { ascending: true }),
  ]);

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

  const workOrderIds = (workOrders ?? []).map((wo) => wo.id);
  const commentsByWorkOrder = new Map<
    string,
    { id: string; author_role: string; author_name: string; body: string; created_at: string }[]
  >();
  if (workOrderIds.length > 0) {
    const { data: comments } = await supabase
      .from("work_order_comments")
      .select("*")
      .in("work_order_id", workOrderIds)
      .order("created_at", { ascending: true });
    comments?.forEach((c) => {
      const list = commentsByWorkOrder.get(c.work_order_id) ?? [];
      list.push(c);
      commentsByWorkOrder.set(c.work_order_id, list);
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
        <Link
          href={`/client/properties/${property.id}/statement`}
          className="shrink-0 rounded-lg border border-charcoal/20 px-3 py-1.5 text-sm font-medium text-navy-black hover:border-charcoal/40"
        >
          Statement
        </Link>
      </div>

      <section className="mt-10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
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
            className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Submit request
          </button>
        </form>
      </section>

      {schedules && schedules.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold text-navy-black">Upcoming preventive maintenance</h2>
          <ul className="mt-3 space-y-2">
            {schedules.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 text-sm shadow-sm shadow-charcoal/5"
              >
                <span className="text-navy-black">{s.title}</span>
                <span className="text-navy-black/60">{formatDate(s.next_due_date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
              const checklist = Array.isArray(wo.turnover_checklist)
                ? (wo.turnover_checklist as ChecklistItem[])
                : [];
              return (
                <li key={wo.id} className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5">
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

                  {checklist.length > 0 && (
                    <div className="mt-4 border-t border-charcoal/10 pt-3">
                      <p className="text-xs font-medium text-navy-black/60">Turnover checklist</p>
                      <ul className="mt-1 space-y-0.5">
                        {checklist.map((item, i) => (
                          <li
                            key={i}
                            className={`text-sm ${item.done ? "text-navy-black/50 line-through" : "text-navy-black"}`}
                          >
                            {item.item}
                          </li>
                        ))}
                      </ul>
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

                  {wo.status === "complete" && (
                    <div className="mt-4 border-t border-charcoal/10 pt-3">
                      {wo.artisan_rating ? (
                        <div>
                          <p className="text-xs font-medium text-navy-black/60">Your rating</p>
                          <p className="mt-1 text-amber">
                            {"★".repeat(wo.artisan_rating)}
                            <span className="text-charcoal/20">
                              {"★".repeat(5 - wo.artisan_rating)}
                            </span>
                          </p>
                          {wo.artisan_rating_note && (
                            <p className="mt-1 text-sm text-navy-black/70">
                              {wo.artisan_rating_note}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-navy-black/60">
                            How was this job?
                          </p>
                          <RatingForm workOrderId={wo.id} propertyId={property.id} />
                        </div>
                      )}
                    </div>
                  )}

                  <WorkOrderComments
                    comments={commentsByWorkOrder.get(wo.id) ?? []}
                    action={addComment}
                    workOrderId={wo.id}
                    extraFields={{ propertyId: property.id }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
