import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { CostBreakdownEditor } from "./cost-breakdown-editor";
import { TurnoverChecklistEditor } from "./turnover-checklist-editor";
import { updateWorkOrder, uploadWorkOrderPhoto, deleteWorkOrderPhoto } from "./actions";

type CostLineItem = { label: string; amount: number };
type ChecklistItem = { item: string; done: boolean };

export default async function AdminWorkOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; updated?: string; photo_error?: string }>;
}) {
  const { id } = await params;
  const { error, updated, photo_error } = await searchParams;
  const supabase = await createClient();

  const { data: workOrder } = await supabase
    .from("work_orders")
    .select("*, properties(id, address, property_type, clients(id, name)), work_order_photos(*)")
    .eq("id", id)
    .maybeSingle();

  if (!workOrder) notFound();

  const { data: artisans } = await supabase
    .from("artisans")
    .select("id, name")
    .order("name");

  const photos = workOrder.work_order_photos ?? [];
  const paths = photos.map((p) => p.photo_url);
  const signedUrlByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("work-order-photos")
      .createSignedUrls(paths, 60 * 60);
    signed?.forEach((s) => {
      if (s.signedUrl) signedUrlByPath.set(s.path ?? "", s.signedUrl);
    });
  }

  const breakdown = Array.isArray(workOrder.cost_breakdown)
    ? (workOrder.cost_breakdown as CostLineItem[])
    : [];
  const checklist = Array.isArray(workOrder.turnover_checklist)
    ? (workOrder.turnover_checklist as ChecklistItem[])
    : [];
  const isShortTermRental = workOrder.properties?.property_type === "short_term_rental";

  return (
    <div>
      <Link
        href={`/admin/properties/${workOrder.properties?.id}`}
        className="text-sm text-charcoal underline underline-offset-2"
      >
        &larr; {workOrder.properties?.address}
      </Link>
      <p className="mt-1 text-sm text-navy-black/50">
        {workOrder.properties?.clients?.name}
      </p>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please check the form and try again.
        </p>
      )}
      {updated && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Work order updated.
        </p>
      )}

      <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-6">
        <form action={updateWorkOrder} className="space-y-5">
          <input type="hidden" name="workOrderId" value={workOrder.id} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy-black">Date</label>
              <input
                type="date"
                name="date"
                defaultValue={workOrder.date}
                required
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-black">Status</label>
              <select
                name="status"
                defaultValue={workOrder.status}
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              >
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-black">Description</label>
            <textarea
              name="description"
              defaultValue={workOrder.description}
              required
              rows={3}
              className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-black">Assigned artisan</label>
            <select
              name="assignedArtisanId"
              defaultValue={workOrder.assigned_artisan_id ?? ""}
              className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            >
              <option value="">Unassigned</option>
              {artisans?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-black">Itemized costs</label>
            <div className="mt-1">
              <CostBreakdownEditor initial={breakdown} />
            </div>
          </div>

          {isShortTermRental && (
            <div>
              <label className="block text-sm font-medium text-navy-black">
                Turnover checklist
              </label>
              <p className="mt-1 text-xs text-navy-black/50">
                Short-term rental property — set the checklist here; the
                assigned artisan checks items off as they complete them.
              </p>
              <div className="mt-2">
                <TurnoverChecklistEditor initial={checklist} />
              </div>
            </div>
          )}

          <div className="rounded-md bg-off-white p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-navy-black">
              <input
                type="checkbox"
                name="flagged"
                defaultChecked={workOrder.flagged_for_review}
              />
              Flag for review
            </label>
            <textarea
              name="flagReason"
              defaultValue={workOrder.flag_reason ?? ""}
              placeholder="Reason (e.g. quote looks high for the scope of work)"
              rows={2}
              className="mt-2 w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-charcoal px-5 py-2.5 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Save
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="font-semibold text-navy-black">Photos</h2>
        {photo_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Photo upload failed — please try again.
          </p>
        )}
        <form action={uploadWorkOrderPhoto} className="mt-4 flex items-center gap-3">
          <input type="hidden" name="workOrderId" value={workOrder.id} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Upload
          </button>
        </form>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((photo) => {
              const url = signedUrlByPath.get(photo.photo_url);
              return (
                <div key={photo.id} className="relative">
                  {url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={photo.caption ?? "Work order photo"}
                      className="h-28 w-28 rounded-md object-cover"
                    />
                  )}
                  <form action={deleteWorkOrderPhoto} className="mt-1">
                    <input type="hidden" name="workOrderId" value={workOrder.id} />
                    <input type="hidden" name="photoId" value={photo.id} />
                    <input type="hidden" name="photoPath" value={photo.photo_url} />
                    <button
                      type="submit"
                      className="text-xs text-navy-black/50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-navy-black/40">
        Logged {formatDate(workOrder.created_at)}
      </p>
    </div>
  );
}
