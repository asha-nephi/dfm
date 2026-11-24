import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { Icon } from "@/components/ui/icons";
import { getService, serviceLabel } from "@/lib/services";

// New client bookings waiting to be scheduled, oldest first.
export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("work_orders")
    .select("*, properties(address, clients(name))")
    .eq("status", "requested")
    .order("created_at", { ascending: true });

  const now = new Date();
  const waitingDays = (iso: string) =>
    Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);

  return (
    <div>
      <RealtimeRefresh tables={["work_orders"]} />
      <PageHeader
        eyebrow="Operations"
        title="Service requests"
        description="New bookings from clients. Open one to assign an artisan, then set it to Accepted."
      />

      <div className="mt-8">
        {!requests || requests.length === 0 ? (
          <EmptyState title="All caught up" body="No new requests waiting. New bookings appear here straight away." />
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => {
              const days = waitingDays(r.created_at);
              const unassigned = !r.assigned_artisan_id;
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/work-orders/${r.id}`}
                    className="card flex flex-col gap-4 p-5 transition hover:border-charcoal/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                        <Icon name={getService(r.service_type)?.icon ?? "inbox"} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-navy-black">
                          {serviceLabel(r.service_type)} &middot; {r.properties?.clients?.name}
                        </p>
                        <p className="text-xs text-navy-black/55">{r.properties?.address}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-navy-black/75">{r.description}</p>
                        {r.preferred_timing && (
                          <p className="mt-1 text-xs text-navy-black/55">Preferred: {r.preferred_timing}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          days >= 2 ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-off-white text-navy-black/60 ring-1 ring-line"
                        }`}
                      >
                        {days === 0 ? "Today" : `Waiting ${days} day${days === 1 ? "" : "s"}`}
                      </span>
                      <span className="text-xs text-navy-black/50">
                        {unassigned ? "No artisan yet" : "Artisan assigned"} &middot; {formatDate(r.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
