import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

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
      <h1 className="text-2xl font-semibold text-navy-black">My assigned jobs</h1>

      {!jobs || jobs.length === 0 ? (
        <p className="mt-4 text-sm text-navy-black/60">No jobs assigned to you yet.</p>
      ) : (
        <>
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-black/50">
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
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-black/50">
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
    properties: { address: string } | null;
  };
}) {
  return (
    <li>
      <Link
        href={`/artisan/jobs/${job.id}`}
        className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 hover:border-amber/60 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-sm text-navy-black/60">
            {formatDate(job.date)} &middot; {job.properties?.address}
          </p>
          <p className="mt-0.5 text-navy-black">{job.description}</p>
        </div>
        <StatusBadge status={job.status} />
      </Link>
    </li>
  );
}
