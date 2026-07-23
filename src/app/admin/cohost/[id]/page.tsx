import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { approveCohostRequest, closeCohostRequest } from "../actions";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export default async function AdminCohostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: request } = await supabase
    .from("cohost_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!request) notFound();

  const { data: applications } = await supabase
    .from("cohost_applications")
    .select("*")
    .eq("cohost_request_id", id)
    .order("created_at", { ascending: false });

  const { data: agreement } = await supabase
    .from("cohost_agreements")
    .select("*, cohost_applications(applicant_name, applicant_contact)")
    .eq("cohost_request_id", id)
    .maybeSingle();

  const hostLink = `${siteUrl}/cohost/host/${request.host_token}`;
  const applyLink = `${siteUrl}/cohost/apply/${request.id}`;

  return (
    <div>
      <Link href="/admin/cohost" className="text-sm text-charcoal underline underline-offset-2">
        &larr; Co-host marketplace
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-black">{request.host_name}</h1>
          <p className="mt-1 text-sm text-navy-black/60">{request.host_contact}</p>
        </div>
        <span className="rounded-full bg-charcoal/10 px-2.5 py-0.5 text-xs font-medium text-navy-black">
          {request.status.replace("_", " ")}
        </span>
      </div>

      <p className="mt-4 text-navy-black">{request.property_description}</p>

      <section className="mt-6 flex flex-wrap gap-3">
        {request.status === "pending_review" && (
          <form action={approveCohostRequest}>
            <input type="hidden" name="id" value={request.id} />
            <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Approve — open for applications
</SubmitButton>
          </form>
        )}
        {(request.status === "open" || request.status === "pending_review") && (
          <form action={closeCohostRequest}>
            <input type="hidden" name="id" value={request.id} />
            <ConfirmSubmitButton
              confirmMessage="Close this request? It won't accept new applications after this."
              className="rounded-md border border-charcoal/20 px-4 py-2 text-sm font-medium text-navy-black hover:border-charcoal/40"
            >
              Close request
            </ConfirmSubmitButton>
          </form>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Shareable links</h2>
        <p className="mt-1 text-sm text-navy-black/60">
          These aren&apos;t listed anywhere publicly — share them directly
          with the host or a specific prospective co-host (e.g. via
          WhatsApp).
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="text-navy-black/50">Host status link: </span>
            <span className="break-all font-mono text-navy-black">{hostLink}</span>
          </p>
          {request.status === "open" && (
            <p>
              <span className="text-navy-black/50">Apply link: </span>
              <span className="break-all font-mono text-navy-black">{applyLink}</span>
            </p>
          )}
        </div>
      </section>

      {agreement && (
        <section className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="font-semibold text-green-900">Matched</h2>
          <p className="mt-1 text-sm text-green-800">
            {agreement.cohost_applications?.applicant_name} (
            {agreement.cohost_applications?.applicant_contact}) on{" "}
            {formatDate(agreement.date_matched)}
          </p>
          {agreement.terms_note && (
            <p className="mt-2 text-sm text-green-800">Note: {agreement.terms_note}</p>
          )}
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-semibold text-navy-black">
          Applications {applications && applications.length > 0 ? `(${applications.length})` : ""}
        </h2>
        {!applications || applications.length === 0 ? (
          <p className="mt-3 text-sm text-navy-black/60">No applications yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {applications.map((app) => (
              <li key={app.id} className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-navy-black">{app.applicant_name}</p>
                    <p className="text-sm text-navy-black/60">{app.applicant_contact}</p>
                    {app.message && (
                      <p className="mt-2 text-sm text-navy-black/70">{app.message}</p>
                    )}
                    <p className="mt-2 text-xs text-navy-black/40">
                      Applied {formatDate(app.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-charcoal/10 px-2.5 py-0.5 text-xs font-medium text-navy-black/60">
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-navy-black/50">
          Matching an applicant is done by the host from their private status
          link above, not from this admin view.
        </p>
      </section>
    </div>
  );
}
