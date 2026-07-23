import { notFound } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { createClient } from "@/lib/supabase/server";
import { submitApplication } from "./actions";

export default async function CohostApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ applied?: string; error?: string }>;
}) {
  const { id } = await params;
  const { applied, error } = await searchParams;
  const supabase = await createClient();

  const { data: requests } = await supabase.rpc("get_cohost_request_public", {
    p_request_id: id,
  });
  const request = requests?.[0];
  if (!request) notFound();

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
          Beta &middot; Co-host application
        </span>
        <h1 className="mt-3 text-2xl font-semibold text-navy-black">
          Apply to co-host this property
        </h1>
        <p className="mt-2 text-navy-black/70">{request.property_description}</p>
        <p className="mt-3 text-xs text-navy-black/50">
          This is an early beta. Terms of service for host/co-host
          arrangements are still being finalized — DFM facilitates the
          introduction only, and isn&apos;t yet a party to any agreement
          between you and the host.
        </p>

        {request.status !== "open" ? (
          <p className="mt-6 rounded-md bg-white p-4 text-sm text-navy-black/70">
            This request isn&apos;t currently accepting applications.
          </p>
        ) : applied ? (
          <p className="mt-6 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Application submitted. The host will review it and reach out if
            they&apos;re interested.
          </p>
        ) : (
          <>
            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                Something went wrong — please try again.
              </p>
            )}
            <form action={submitApplication} className="mt-6 grid gap-3">
              <input type="hidden" name="requestId" value={request.id} />
              <input
                name="applicant_name"
                placeholder="Your name"
                required
                className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
              <input
                name="applicant_contact"
                placeholder="Email or WhatsApp number"
                required
                className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
              <textarea
                name="message"
                placeholder="Why you'd be a good fit (optional)"
                rows={3}
                className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
              <button
                type="submit"
                className="w-fit rounded-lg bg-charcoal shadow-sm px-6 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90"
              >
                Submit application
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
