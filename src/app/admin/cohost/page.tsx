import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-blue-50 text-blue-700",
  open: "bg-amber/20 text-amber-900",
  matched: "bg-green-50 text-green-700",
  closed: "bg-charcoal/10 text-navy-black/60",
};

export default async function AdminCohostPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("cohost_requests")
    .select("*, cohost_applications(id)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-navy-black">Co-host marketplace</h1>
        <span className="rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Beta
        </span>
      </div>
      <p className="mt-2 text-sm text-navy-black/60">
        Requesters and applicants now agree to the{" "}
        <Link href="/cohost/terms" className="text-charcoal underline underline-offset-2">
          Terms of Service
        </Link>{" "}
        before submitting. Still worth keeping this out of heavy promotion
        until you&apos;ve run a few real matches through it.
      </p>

      {!requests || requests.length === 0 ? (
        <p className="mt-6 text-sm text-navy-black/60">No requests yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/cohost/${r.id}`}
                className="flex flex-col gap-2 px-5 py-4 hover:bg-off-white sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="font-medium text-navy-black">{r.host_name}</p>
                  <p className="text-sm text-navy-black/60">{r.property_description}</p>
                  <p className="mt-1 text-xs text-navy-black/40">
                    {formatDate(r.created_at)} &middot; {r.cohost_applications?.length ?? 0}{" "}
                    application{(r.cohost_applications?.length ?? 0) === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status] ?? "bg-charcoal/10 text-navy-black"}`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
