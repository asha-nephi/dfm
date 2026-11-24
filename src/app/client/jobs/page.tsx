import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Icon } from "@/components/ui/icons";
import { getService, serviceLabel } from "@/lib/services";

const TABS = [
  { key: "open", label: "Open" },
  { key: "complete", label: "Completed" },
  { key: "all", label: "All" },
];

export default async function ClientJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; booked?: string }>;
}) {
  const { status = "open", booked } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("work_orders")
    .select("id, date, description, status, cost_amount, service_type, property_id, preferred_timing, properties(address)")
    .order("date", { ascending: false });
  if (status === "open") query = query.not("status", "in", "(complete,cancelled)");
  if (status === "complete") query = query.eq("status", "complete");
  const { data: jobs } = await query;

  return (
    <div>
      <PageHeader
        eyebrow="Your jobs"
        title="Jobs"
        description="Every request and job across your properties. Open one to see photos, costs and comments."
        actions={
          <Link href="/client/book" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Book a service
          </Link>
        }
      />

      {booked && (
        <p className="mt-6 flex items-center gap-2 rounded-lg bg-charcoal/10 px-4 py-3 text-sm font-medium text-charcoal">
          <Icon name="check" className="h-4 w-4" />
          Request sent. We&apos;ll confirm the details within 24 hours.
        </p>
      )}

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "open" ? "/client/jobs" : `/client/jobs?status=${t.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === t.key ? "bg-charcoal text-off-white" : "bg-white text-navy-black/70 ring-1 ring-line hover:text-navy-black"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {!jobs || jobs.length === 0 ? (
          <EmptyState
            title={status === "open" ? "No open jobs" : "Nothing here yet"}
            body="When you book a service, it shows up here."
            action={<Link href="/client/book" className="btn-primary">Book a service</Link>}
          />
        ) : (
          <ul className="space-y-3">
            {jobs.map((j) => (
              <li key={j.id}>
                <Link
                  href={`/client/properties/${j.property_id}#wo-${j.id}`}
                  className="card flex flex-col gap-3 p-5 transition hover:border-charcoal/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                      <Icon name={getService(j.service_type)?.icon ?? "clipboard"} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-black">{serviceLabel(j.service_type)}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-navy-black/70">{j.description}</p>
                      <p className="mt-1 text-xs text-navy-black/50">
                        {formatDate(j.date)} &middot; {j.properties?.address}
                        {j.preferred_timing ? ` · Preferred: ${j.preferred_timing}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <StatusBadge status={j.status} />
                    {Number(j.cost_amount) > 0 && (
                      <span className="font-mono text-sm text-navy-black/70">{formatNaira(j.cost_amount)}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
