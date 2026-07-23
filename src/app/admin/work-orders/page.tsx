import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { RealtimeRefresh } from "@/components/realtime-refresh";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "flagged", label: "Flagged" },
  { key: "complete", label: "Complete" },
] as const;

export default async function AdminWorkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter = "all", q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("work_orders")
    .select("*, properties(address, clients(name))")
    .order("date", { ascending: false });

  if (filter === "requested") query = query.eq("status", "requested");
  if (filter === "complete") query = query.eq("status", "complete");
  if (filter === "flagged") query = query.eq("flagged_for_review", true);
  if (q) query = query.ilike("description", `%${q}%`);

  const { data: workOrders } = await query;

  const filterHref = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("filter", key);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/admin/work-orders?${qs}` : "/admin/work-orders";
  };

  return (
    <div>
      <RealtimeRefresh tables={["work_orders"]} />
      <h1 className="text-2xl font-semibold text-navy-black">Work orders</h1>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={filterHref(f.key)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === f.key
                  ? "bg-charcoal text-off-white"
                  : "bg-white text-navy-black/70 hover:bg-off-white"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search description..."
            className="w-full max-w-xs rounded-lg border border-charcoal/15 bg-white px-3.5 py-2 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          {q && (
            <Link
              href={filterHref(filter)}
              className="rounded-lg border border-charcoal/20 px-3 py-2 text-sm text-navy-black hover:border-charcoal/40"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="mt-6">
        {!workOrders || workOrders.length === 0 ? (
          <p className="text-sm text-navy-black/60">
            {q ? "No work orders match that search." : "No work orders found."}
          </p>
        ) : (
          <ul className="space-y-3">
            {workOrders.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={`/admin/work-orders/${wo.id}`}
                  className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 hover:border-amber/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-navy-black/60">
                      {formatDate(wo.date)} &middot; {wo.properties?.clients?.name} &middot;{" "}
                      {wo.properties?.address}
                    </p>
                    <p className="mt-0.5 text-navy-black">{wo.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {wo.flagged_for_review && (
                      <span className="text-xs font-medium text-amber-900">Flagged</span>
                    )}
                    <span className="text-sm text-navy-black/70">
                      {formatNaira(wo.cost_amount)}
                    </span>
                    <StatusBadge status={wo.status} />
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
