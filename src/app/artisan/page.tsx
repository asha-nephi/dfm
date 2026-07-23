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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">My assigned jobs</h1>

      {!jobs || jobs.length === 0 ? (
        <p className="mt-4 text-sm text-navy-black/60">
          No jobs assigned to you yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/artisan/jobs/${job.id}`}
                className="flex items-center justify-between rounded-lg border border-charcoal/10 bg-white p-4 hover:border-amber/60"
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
          ))}
        </ul>
      )}
    </div>
  );
}
