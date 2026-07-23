import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "flagged", label: "Flagged" },
  { key: "complete", label: "Complete" },
] as const;

export default async function AdminWorkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("work_orders")
    .select("*, properties(address, clients(name))")
    .order("date", { ascending: false });

  if (filter === "requested") query = query.eq("status", "requested");
  if (filter === "complete") query = query.eq("status", "complete");
  if (filter === "flagged") query = query.eq("flagged_for_review", true);

  const { data: workOrders } = await query;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Work orders</h1>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin/work-orders" : `/admin/work-orders?filter=${f.key}`}
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

      <div className="mt-6">
        {!workOrders || workOrders.length === 0 ? (
          <p className="text-sm text-navy-black/60">No work orders found.</p>
        ) : (
          <ul className="space-y-3">
            {workOrders.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={`/admin/work-orders/${wo.id}`}
                  className="flex items-center justify-between rounded-lg border border-charcoal/10 bg-white p-4 hover:border-amber/60"
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
