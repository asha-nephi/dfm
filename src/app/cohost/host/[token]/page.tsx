import { notFound } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { selectApplicant } from "./actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

const STATUS_COPY: Record<string, string> = {
  pending_review: "Under review by DFM — we'll be in touch soon.",
  open: "Open for applications.",
  matched: "Matched with a co-host.",
  closed: "This request is closed.",
};

export default async function CohostHostStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string; matched?: string; error?: string }>;
}) {
  const { token } = await params;
  const { submitted, matched, error } = await searchParams;
  const supabase = await createClient();

  const { data: requests } = await supabase.rpc("get_cohost_request_by_host_token", {
    p_token: token,
  });
  const request = requests?.[0];
  if (!request) notFound();

  const { data: applications } = await supabase.rpc(
    "get_cohost_applications_by_host_token",
    { p_token: token },
  );

  return (
    <div className="min-h-screen bg-off-white px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="text-sm font-semibold text-charcoal">
            Deseret Facility Management
          </span>
        </div>

        <span className="mt-6 inline-block rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Beta &middot; Co-host request
        </span>
        <h1 className="mt-3 text-2xl font-semibold text-navy-black">
          {request.host_name}&apos;s request
        </h1>
        <p className="mt-2 text-navy-black/70">{request.property_description}</p>
        <p className="mt-3 text-sm font-medium text-navy-black/60">
          Status: {STATUS_COPY[request.status] ?? request.status}
        </p>
        <Link
          href="/cohost/terms"
          className="mt-1 inline-block text-xs text-charcoal underline underline-offset-2"
        >
          View Terms of Service
        </Link>

        {submitted && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Request submitted. Bookmark this page — it&apos;s the only way to
            check on your request and review applicants.
          </p>
        )}
        {matched && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Match recorded.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please try again.
          </p>
        )}

        {request.status === "pending_review" && (
          <p className="mt-6 text-sm text-navy-black/60">
            DFM reviews new requests before opening them up for co-host
            applications. No action needed from you right now.
          </p>
        )}

        {request.status === "closed" && (
          <p className="mt-6 text-sm text-navy-black/60">
            This request was closed. Reach out to DFM if you&apos;d like to
            reopen it.
          </p>
        )}

        {(request.status === "open" || request.status === "matched") && (
          <section className="mt-8">
            <h2 className="font-semibold text-navy-black">
              Applicants {applications && applications.length > 0 ? `(${applications.length})` : ""}
            </h2>
            {!applications || applications.length === 0 ? (
              <p className="mt-3 text-sm text-navy-black/60">
                No applications yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {applications.map((app) => (
                  <li
                    key={app.id}
                    className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4"
                  >
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
                      {app.status === "selected" && (
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Selected
                        </span>
                      )}
                      {app.status === "not_selected" && (
                        <span className="rounded-full bg-charcoal/10 px-2.5 py-0.5 text-xs font-medium text-navy-black/60">
                          Not selected
                        </span>
                      )}
                    </div>

                    {request.status === "open" && app.status === "submitted" && (
                      <form action={selectApplicant} className="mt-3 flex flex-wrap items-center gap-2">
                        <input type="hidden" name="hostToken" value={token} />
                        <input type="hidden" name="applicationId" value={app.id} />
                        <input
                          name="termsNote"
                          placeholder="Note for this arrangement (optional)"
                          className="min-w-[200px] flex-1 rounded-md border border-charcoal/20 px-2.5 py-1.5 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                        />
                        <ConfirmSubmitButton
                          confirmMessage={`Select ${app.applicant_name} as your co-host? This closes the request to other applicants and can't be undone from here.`}
                          className="rounded-lg bg-charcoal shadow-sm px-3 py-1.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
                        >
                          Select this co-host
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
