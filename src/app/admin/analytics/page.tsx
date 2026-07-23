import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/format";

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-NG", {
    month: "short",
    year: "2-digit",
  });
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: workOrders }] = await Promise.all([
    supabase.from("payments").select("amount, date, status").eq("status", "success"),
    supabase
      .from("work_orders")
      .select(
        "cost_amount, status, assigned_artisan_id, artisan_rating, properties(address), artisans(name)",
      ),
  ]);

  // Monthly revenue — last 6 calendar months, oldest first.
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const revenueByMonth = new Map<string, number>(months.map((m) => [m, 0]));
  for (const p of payments ?? []) {
    const key = p.date.slice(0, 7);
    if (revenueByMonth.has(key)) {
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + Number(p.amount));
    }
  }
  const maxRevenue = Math.max(1, ...Array.from(revenueByMonth.values()));

  // Cost per property.
  const costByProperty = new Map<string, number>();
  for (const wo of workOrders ?? []) {
    const address = wo.properties?.address ?? "Unknown property";
    costByProperty.set(address, (costByProperty.get(address) ?? 0) + wo.cost_amount);
  }
  const costRows = Array.from(costByProperty.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Artisan completed-job counts + average rating.
  const completedByArtisan = new Map<string, { count: number; ratingSum: number; ratingCount: number }>();
  for (const wo of workOrders ?? []) {
    if (wo.status !== "complete" || !wo.assigned_artisan_id) continue;
    const name = wo.artisans?.name ?? "Unknown artisan";
    const entry = completedByArtisan.get(name) ?? { count: 0, ratingSum: 0, ratingCount: 0 };
    entry.count += 1;
    if (wo.artisan_rating) {
      entry.ratingSum += wo.artisan_rating;
      entry.ratingCount += 1;
    }
    completedByArtisan.set(name, entry);
  }
  const artisanRows = Array.from(completedByArtisan.entries()).sort((a, b) => b[1].count - a[1].count);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Analytics</h1>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Revenue — last 6 months</h2>
        <div className="mt-4 flex items-end gap-3" style={{ height: 160 }}>
          {months.map((m) => {
            const value = revenueByMonth.get(m) ?? 0;
            const heightPct = Math.max(4, (value / maxRevenue) * 100);
            return (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-amber"
                    style={{ height: `${heightPct}%` }}
                    title={formatNaira(value)}
                  />
                </div>
                <span className="text-xs text-navy-black/50">{monthLabel(m)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-navy-black/70">
          Total: {formatNaira(Array.from(revenueByMonth.values()).reduce((a, b) => a + b, 0))}
        </p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-semibold text-navy-black">Cost by property</h2>
          {costRows.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No work order costs recorded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
              {costRows.map(([address, total]) => (
                <li key={address} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-navy-black">{address}</span>
                  <span className="font-medium text-navy-black">{formatNaira(total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-navy-black">Jobs completed by artisan</h2>
          {artisanRows.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No completed jobs yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
              {artisanRows.map(([name, stats]) => (
                <li key={name} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-navy-black">{name}</span>
                  <span className="flex items-center gap-2">
                    {stats.ratingCount > 0 && (
                      <span className="text-amber">
                        &#9733; {(stats.ratingSum / stats.ratingCount).toFixed(1)}
                      </span>
                    )}
                    <span className="font-medium text-navy-black">{stats.count}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
