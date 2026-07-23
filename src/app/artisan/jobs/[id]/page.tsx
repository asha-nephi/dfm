import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { TurnoverChecklist } from "./turnover-checklist";
import { updateJobStatus, uploadJobPhoto } from "./actions";

type ChecklistItem = { item: string; done: boolean };

export default async function ArtisanJobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; updated?: string; photo_error?: string }>;
}) {
  const { id } = await params;
  const { error, updated, photo_error } = await searchParams;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("work_orders")
    .select("*, properties(address, notes, property_type), work_order_photos(*)")
    .eq("id", id)
    .maybeSingle();

  if (!job) notFound();

  const photos = job.work_order_photos ?? [];
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

  const statusOptions = ["accepted", "in_progress", "complete"] as const;
  const defaultStatus = statusOptions.includes(job.status as (typeof statusOptions)[number])
    ? job.status
    : "accepted";
  const checklist = Array.isArray(job.turnover_checklist)
    ? (job.turnover_checklist as ChecklistItem[])
    : [];
  const isShortTermRental = job.properties?.property_type === "short_term_rental";

  return (
    <div>
      <Link href="/artisan" className="text-sm text-charcoal underline underline-offset-2">
        &larr; My assigned jobs
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-black">{job.properties?.address}</h1>
          <p className="mt-1 text-sm text-navy-black/60">{formatDate(job.date)}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <p className="mt-4 text-navy-black">{job.description}</p>
      {job.properties?.notes && (
        <p className="mt-2 text-sm text-navy-black/60">
          Access notes: {job.properties.notes}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please try again.
        </p>
      )}
      {updated && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Status updated.
        </p>
      )}

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Update status</h2>

        <form action={updateJobStatus} className="mt-3">
          <input type="hidden" name="jobId" value={job.id} />

          {isShortTermRental && checklist.length > 0 && (
            <div className="mb-4 rounded-md bg-off-white p-4">
              <p className="mb-2 text-sm font-medium text-navy-black">Turnover checklist</p>
              <TurnoverChecklist initial={checklist} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <select
              name="status"
              defaultValue={defaultStatus}
              className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            >
              <option value="accepted">Accepted</option>
              <option value="in_progress">In progress</option>
              <option value="complete">Complete</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
            >
              Save status
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Completion photos</h2>
        {photo_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Photo upload failed — please try again.
          </p>
        )}
        <form action={uploadJobPhoto} className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <input type="hidden" name="jobId" value={job.id} />
          <input type="file" name="file" accept="image/*" required className="w-full text-sm sm:w-auto" />
          <button
            type="submit"
            className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Upload
          </button>
        </form>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((photo) => {
              const url = signedUrlByPath.get(photo.photo_url);
              if (!url) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.id}
                  src={url}
                  alt={photo.caption ?? "Completion photo"}
                  className="h-28 w-28 rounded-md object-cover"
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
