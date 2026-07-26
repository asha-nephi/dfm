import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import {
  approveArtisanApplication,
  declineArtisanApplication,
  updateVettingChecklist,
} from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  approved: "bg-green-50 text-green-700",
  declined: "bg-charcoal/10 text-navy-black/50",
};

export default async function AdminArtisanApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; error?: string }>;
}) {
  const { approved, error } = await searchParams;
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("artisan_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const documentPaths = (applications ?? [])
    .map((a) => a.id_document_url)
    .filter((p): p is string => Boolean(p));
  const signedUrlByPath = new Map<string, string>();
  if (documentPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("artisan-application-documents")
      .createSignedUrls(documentPaths, 60 * 60);
    signed?.forEach((s) => {
      if (s.signedUrl) signedUrlByPath.set(s.path ?? "", s.signedUrl);
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const applyLink = `${siteUrl}/join-artisan`;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Artisan applications</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        People applying to join DFM&apos;s vetted artisan roster.
      </p>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Recruit artisans</h2>
        <p className="mt-1 text-sm text-navy-black/60">
          Share this link anywhere you&apos;d find tradespeople — WhatsApp
          groups, referrals from existing artisans, local trade contacts.
          Applications land here for you to review.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-lg border border-charcoal/15 bg-off-white px-3.5 py-2.5 text-sm text-navy-black">
            {applyLink}
          </code>
        </div>
      </section>

      {approved && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Applicant added to the artisan roster.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <section className="mt-8">
        {!applications || applications.length === 0 ? (
          <p className="text-sm text-navy-black/60">No applications yet.</p>
        ) : (
          <ul className="space-y-3">
            {applications.map((application) => {
              const documentUrl = application.id_document_url
                ? signedUrlByPath.get(application.id_document_url)
                : null;
              const vettingComplete =
                application.vetting_id_verified &&
                application.vetting_call_completed &&
                application.vetting_reference_checked;

              return (
                <li
                  key={application.id}
                  className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-navy-black">
                      {application.name}
                      <span className="ml-2 font-normal text-navy-black/60">
                        &middot; {application.trade}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[application.status] ?? "bg-charcoal/10 text-navy-black"}`}
                      >
                        {application.status}
                      </span>
                      <p className="text-xs text-navy-black/50">
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-navy-black/70">{application.contact}</p>
                  {application.service_area && (
                    <p className="mt-1 text-sm text-navy-black/60">
                      Works in: {application.service_area}
                    </p>
                  )}
                  {application.experience && (
                    <p className="mt-2 text-navy-black">{application.experience}</p>
                  )}
                  {(application.reference_name || documentUrl) && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-navy-black/70">
                      {application.reference_name && (
                        <span>
                          Reference: {application.reference_name}
                          {application.reference_contact ? ` · ${application.reference_contact}` : ""}
                        </span>
                      )}
                      {documentUrl && (
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-charcoal underline underline-offset-2"
                        >
                          View ID document &rarr;
                        </a>
                      )}
                    </div>
                  )}

                  {application.status === "new" && (
                    <div className="mt-4 border-t border-charcoal/10 pt-4">
                      <form action={updateVettingChecklist} className="space-y-2">
                        <input type="hidden" name="applicationId" value={application.id} />
                        <p className="text-sm font-medium text-navy-black">Vetting checklist</p>
                        <label className="flex items-center gap-2 text-sm text-navy-black/80">
                          <input
                            type="checkbox"
                            name="vetting_id_verified"
                            defaultChecked={application.vetting_id_verified}
                            className="rounded border-charcoal/30"
                          />
                          ID document reviewed
                        </label>
                        <label className="flex items-center gap-2 text-sm text-navy-black/80">
                          <input
                            type="checkbox"
                            name="vetting_call_completed"
                            defaultChecked={application.vetting_call_completed}
                            className="rounded border-charcoal/30"
                          />
                          Phone/WhatsApp call completed
                        </label>
                        <label className="flex items-center gap-2 text-sm text-navy-black/80">
                          <input
                            type="checkbox"
                            name="vetting_reference_checked"
                            defaultChecked={application.vetting_reference_checked}
                            className="rounded border-charcoal/30"
                          />
                          Reference checked
                        </label>
                        <SubmitButton className="rounded-lg border border-charcoal/20 px-3.5 py-1.5 text-xs font-medium text-navy-black hover:border-charcoal/40">
  Save checklist
</SubmitButton>
                      </form>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {vettingComplete ? (
                          <form action={approveArtisanApplication}>
                            <input type="hidden" name="applicationId" value={application.id} />
                            <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Approve — add to roster
</SubmitButton>
                          </form>
                        ) : (
                          <p className="text-xs text-navy-black/50">
                            Complete the vetting checklist above before approving.
                          </p>
                        )}
                        <form action={declineArtisanApplication}>
                          <input type="hidden" name="applicationId" value={application.id} />
                          <ConfirmSubmitButton
                            confirmMessage="Decline this application?"
                            className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium text-navy-black hover:border-charcoal/40"
                          >
                            Decline
                          </ConfirmSubmitButton>
                        </form>
                      </div>
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
