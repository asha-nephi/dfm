import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { updateJobStatus, uploadJobPhoto } from "./actions";

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
    .select("*, properties(address, notes), work_order_photos(*)")
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

      <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="font-semibold text-navy-black">Update status</h2>
        <form action={updateJobStatus} className="mt-3 flex flex-wrap items-center gap-3">
          <input type="hidden" name="jobId" value={job.id} />
          <select
            name="status"
            defaultValue={defaultStatus}
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="accepted">Accepted</option>
            <option value="in_progress">In progress</option>
            <option value="complete">Complete</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Save status
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="font-semibold text-navy-black">Completion photos</h2>
        {photo_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Photo upload failed — please try again.
          </p>
        )}
        <form action={uploadJobPhoto} className="mt-4 flex items-center gap-3">
          <input type="hidden" name="jobId" value={job.id} />
          <input type="file" name="file" accept="image/*" required className="text-sm" />
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
