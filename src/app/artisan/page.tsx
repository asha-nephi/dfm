import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/page-header";
import { Icon } from "@/components/ui/icons";
import { getService, serviceLabel } from "@/lib/services";

export default async function ArtisanHomePage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("work_orders")
    .select("*, properties(address)")
    .order("date", { ascending: false });

  const active = (jobs ?? []).filter((j) => j.status !== "complete" && j.status !== "cancelled");
  const done = (jobs ?? []).filter((j) => j.status === "complete" || j.status === "cancelled");

  return (
    <div>
      <PageHeader
        eyebrow="Your work"
        title="My jobs"
        description="Open a job to see the details, upload before and after photos, send a quote and mark it done."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Active" value={active.length} />
        <StatCard label="Done" value={(jobs ?? []).filter((j) => j.status === "complete").length} />
        <StatCard label="Earnings" value="View" href="/artisan/earnings" />
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No jobs yet" body="When DFM assigns you a job, it appears here and you get an email." />
        </div>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="eyebrow">
              Active {active.length > 0 ? `(${active.length})` : ""}
            </h2>
            {active.length === 0 ? (
              <p className="mt-3 text-sm text-navy-black/60">Nothing active right now.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {active.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </ul>
            )}
          </section>

          {done.length > 0 && (
            <section className="mt-8">
              <h2 className="eyebrow">
                Past jobs ({done.length})
              </h2>
              <ul className="mt-3 space-y-3">
                {done.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function JobRow({
  job,
}: {
  job: {
    id: string;
    date: string;
    description: string;
    status: string;
    service_type: string | null;
    preferred_timing: string | null;
    properties: { address: string } | null;
  };
}) {
  return (
    <li>
      <Link
        href={`/artisan/jobs/${job.id}`}
        className="card flex items-start gap-4 p-4 transition hover:border-charcoal/40 active:bg-off-white sm:items-center"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-charcoal text-gold-light">
          <Icon name={getService(job.service_type)?.icon ?? "clipboard"} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-black">{serviceLabel(job.service_type)}</p>
          <p className="truncate text-sm text-navy-black/70">{job.properties?.address}</p>
          <p className="mt-0.5 line-clamp-1 text-sm text-navy-black/60">{job.description}</p>
          <p className="mt-1 text-xs text-navy-black/50">
            {formatDate(job.date)}
            {job.preferred_timing ? ` · ${job.preferred_timing}` : ""}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </Link>
    </li>
  );
}
