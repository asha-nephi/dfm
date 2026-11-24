import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { serviceLabel } from "@/lib/services";
import { StatusBadge } from "@/components/status-badge";
import { TurnoverChecklist } from "./turnover-checklist";
import { WorkOrderComments } from "@/components/work-order-comments";
import { CompressedFileInput } from "@/components/compressed-file-input";
import { QuoteEditor } from "./quote-editor";
import { updateJobStatus, uploadJobPhoto, addComment } from "./actions";
import { SubmitButton } from "@/components/submit-button";

type ChecklistItem = { item: string; done: boolean };
type QuoteLineItem = { label: string; amount: number };

export default async function ArtisanJobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    updated?: string;
    photo_error?: string;
    quoted?: string;
    quote_error?: string;
  }>;
}) {
  const { id } = await params;
  const { error, updated, photo_error, quoted, quote_error } = await searchParams;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("work_orders")
    .select("*, properties(address, notes, property_type), work_order_photos(*)")
    .eq("id", id)
    .maybeSingle();

  if (!job) notFound();

  const { data: comments } = await supabase
    .from("work_order_comments")
    .select("*")
    .eq("work_order_id", id)
    .order("created_at", { ascending: true });

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
  const pendingQuote = Array.isArray(job.artisan_quote)
    ? (job.artisan_quote as QuoteLineItem[])
    : [];

  return (
    <div>
      <Link href="/artisan" className="text-sm font-medium text-charcoal hover:underline">
        &larr; My jobs
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow">{serviceLabel(job.service_type)} &middot; {formatDate(job.date)}</p>
          <h1 className="font-display mt-1 text-3xl text-navy-black sm:text-4xl">{job.properties?.address}</h1>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="card mt-6 space-y-3 p-6">
        <p className="eyebrow">The job</p>
        <p className="text-navy-black">{job.description}</p>
        {job.preferred_timing && (
          <p className="text-sm text-navy-black/70">
            <span className="font-semibold">Client&apos;s preferred timing:</span> {job.preferred_timing}
          </p>
        )}
        {job.properties?.notes && (
          <p className="rounded-lg bg-amber/10 px-3 py-2 text-sm text-navy-black">
            <span className="font-semibold">Access notes:</span> {job.properties.notes}
          </p>
        )}
      </div>

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
      {quoted && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Quote sent to DFM.
        </p>
      )}
      {quote_error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Add at least one priced line item before submitting.
        </p>
      )}

      <section className="mt-6 card p-6">
        <h2 className="font-display text-2xl text-navy-black">Price quote</h2>
        <p className="mt-1 text-sm text-navy-black/60">
          {pendingQuote.length > 0
            ? "Sent to DFM — awaiting review. You can revise and resubmit below."
            : "Propose itemized pricing for this job. DFM reviews it and, once accepted, it becomes the job's official cost."}
        </p>
        <QuoteEditor
          jobId={job.id}
          initial={pendingQuote}
          initialNote={job.artisan_quote_note ?? ""}
        />
      </section>

      <section className="mt-6 card p-6">
        <h2 className="font-display text-2xl text-navy-black">Update status</h2>

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
              className="input"
            >
              <option value="accepted">Accepted</option>
              <option value="in_progress">In progress</option>
              <option value="complete">Complete</option>
            </select>
            <SubmitButton className="btn-primary">
  Save status
</SubmitButton>
          </div>
        </form>
      </section>

      <section className="mt-6 card p-6">
        <h2 className="font-display text-2xl text-navy-black">Photos</h2>
        <p className="mt-1 text-sm text-navy-black/60">
          Take a &ldquo;before&rdquo; photo when you arrive and an &ldquo;after&rdquo; photo when you finish. The client sees these.
        </p>
        {photo_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Photo upload failed — please try again.
          </p>
        )}
        <form action={uploadJobPhoto} className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <input type="hidden" name="jobId" value={job.id} />
          <select name="stage" defaultValue={photos.some((p) => p.caption === "Before") ? "after" : "before"} className="input sm:!w-36" aria-label="Photo type">
            <option value="before">Before</option>
            <option value="after">After</option>
            <option value="">Other</option>
          </select>
          <CompressedFileInput name="file" className="w-full text-sm sm:w-auto" />
          <SubmitButton className="btn-primary">
  Upload
</SubmitButton>
        </form>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {photos.map((photo) => {
              const url = signedUrlByPath.get(photo.photo_url);
              if (!url) return null;
              return (
                <figure key={photo.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={photo.caption ?? "Job photo"}
                    className="h-32 w-32 rounded-lg border border-line object-cover"
                  />
                  <figcaption className="mt-1 font-mono text-[10px] text-navy-black/55">
                    {photo.caption ?? "Photo"} &middot; {formatDate(photo.timestamp)}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>

      <WorkOrderComments
        comments={comments ?? []}
        action={addComment}
        workOrderId={job.id}
      />
    </div>
  );
}
