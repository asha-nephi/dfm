import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatNaira, workOrderStatusLabel } from "@/lib/format";

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-NG", {
    month: "short",
    year: "2-digit",
  });
}

const WORK_ORDER_STATUSES = ["requested", "accepted", "in_progress", "complete", "cancelled"];

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: workOrders }, { data: leads }, { data: payouts }, { data: expenses }] =
    await Promise.all([
      supabase.from("payments").select("amount, date, status, client_id, clients(name)"),
      supabase
        .from("work_orders")
        .select(
          "cost_amount, status, date, assigned_artisan_id, artisan_rating, flagged_for_review, properties(address), artisans(name)",
        ),
      supabase.from("contact_leads").select("status"),
      supabase.from("payouts").select("amount, status, created_at"),
      supabase.from("expenses").select("amount, category, date"),
    ]);

  const successPayments = (payments ?? []).filter((p) => p.status === "success");
  const pendingPayments = (payments ?? []).filter((p) => p.status === "pending");
  const successPayouts = (payouts ?? []).filter((p) => p.status === "success");

  // The money that actually matters: what came in, what went out to
  // artisans, what went out as overhead, and what's left. Deliberately
  // separate from "cost_amount" on work orders, which is just the admin's
  // itemized price estimate for a job — not money that has left the
  // business.
  const totalRevenue = successPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaidToArtisans = successPayouts.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalRevenue - totalPaidToArtisans - totalExpenses;

  // KPIs
  const outstandingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const outstandingCount = pendingPayments.length;

  const activeWorkOrders = (workOrders ?? []).filter(
    (wo) => wo.status !== "complete" && wo.status !== "cancelled",
  ).length;
  const flaggedCount = (workOrders ?? []).filter((wo) => wo.flagged_for_review).length;

  const completedJobs = (workOrders ?? []).filter((wo) => wo.status === "complete");
  const avgJobCost =
    completedJobs.length > 0
      ? completedJobs.reduce((sum, wo) => sum + wo.cost_amount, 0) / completedJobs.length
      : 0;

  const convertedLeads = (leads ?? []).filter((l) => l.status === "converted").length;
  const nonArchivedLeads = (leads ?? []).filter((l) => l.status !== "archived").length;
  const conversionRate = nonArchivedLeads > 0 ? (convertedLeads / nonArchivedLeads) * 100 : 0;

  const kpis = [
    {
      label: "Outstanding payments",
      value: formatNaira(outstandingAmount),
      sub: `${outstandingCount} pending`,
      href: "/admin/payments",
    },
    {
      label: "Active work orders",
      value: String(activeWorkOrders),
      sub: "not yet complete",
      href: "/admin/work-orders",
    },
    {
      label: "Flagged for review",
      value: String(flaggedCount),
      sub: "needs attention",
      href: "/admin/work-orders?filter=flagged",
    },
    {
      label: "Avg cost per completed job",
      value: formatNaira(avgJobCost),
      sub: `${completedJobs.length} jobs`,
      href: "/admin/benchmarks",
    },
    {
      label: "Lead conversion",
      value: `${conversionRate.toFixed(0)}%`,
      sub: `${convertedLeads} of ${nonArchivedLeads} leads`,
      href: "/admin/leads",
    },
  ];

  // Revenue vs. actual money out — last 6 calendar months, oldest first.
  // "Money out" here is real payouts + expenses, not the job cost_amount
  // estimate (that's a separate, clearly-labeled section below) — this is
  // the chart that actually answers "am I making money."
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const revenueByMonth = new Map<string, number>(months.map((m) => [m, 0]));
  for (const p of successPayments) {
    const key = p.date.slice(0, 7);
    if (revenueByMonth.has(key)) {
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + Number(p.amount));
    }
  }
  const moneyOutByMonth = new Map<string, number>(months.map((m) => [m, 0]));
  for (const p of successPayouts) {
    const key = p.created_at.slice(0, 7);
    if (moneyOutByMonth.has(key)) {
      moneyOutByMonth.set(key, (moneyOutByMonth.get(key) ?? 0) + Number(p.amount));
    }
  }
  for (const e of expenses ?? []) {
    const key = e.date.slice(0, 7);
    if (moneyOutByMonth.has(key)) {
      moneyOutByMonth.set(key, (moneyOutByMonth.get(key) ?? 0) + Number(e.amount));
    }
  }
  const maxMonthly = Math.max(
    1,
    ...Array.from(revenueByMonth.values()),
    ...Array.from(moneyOutByMonth.values()),
  );

  // Expenses by category.
  const expensesByCategory = new Map<string, number>();
  for (const e of expenses ?? []) {
    expensesByCategory.set(e.category, (expensesByCategory.get(e.category) ?? 0) + Number(e.amount));
  }
  const expenseRows = Array.from(expensesByCategory.entries()).sort((a, b) => b[1] - a[1]);

  // Work order status breakdown.
  const statusCounts = new Map<string, number>(WORK_ORDER_STATUSES.map((s) => [s, 0]));
  for (const wo of workOrders ?? []) {
    statusCounts.set(wo.status, (statusCounts.get(wo.status) ?? 0) + 1);
  }
  const totalWorkOrders = workOrders?.length ?? 0;

  // Cost by property.
  const costByProperty = new Map<string, number>();
  for (const wo of workOrders ?? []) {
    const address = wo.properties?.address ?? "Unknown property";
    costByProperty.set(address, (costByProperty.get(address) ?? 0) + wo.cost_amount);
  }
  const costRows = Array.from(costByProperty.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Artisan performance: completed-job count, avg rating, total value handled.
  const artisanStats = new Map<
    string,
    { count: number; ratingSum: number; ratingCount: number; totalValue: number }
  >();
  for (const wo of workOrders ?? []) {
    if (wo.status !== "complete" || !wo.assigned_artisan_id) continue;
    const name = wo.artisans?.name ?? "Unknown artisan";
    const entry = artisanStats.get(name) ?? { count: 0, ratingSum: 0, ratingCount: 0, totalValue: 0 };
    entry.count += 1;
    entry.totalValue += wo.cost_amount;
    if (wo.artisan_rating) {
      entry.ratingSum += wo.artisan_rating;
      entry.ratingCount += 1;
    }
    artisanStats.set(name, entry);
  }
  const artisanRows = Array.from(artisanStats.entries()).sort((a, b) => b[1].count - a[1].count);

  // Top clients by revenue.
  const revenueByClient = new Map<string, number>();
  for (const p of successPayments) {
    const name = p.clients?.name ?? "Unknown client";
    revenueByClient.set(name, (revenueByClient.get(name) ?? 0) + Number(p.amount));
  }
  const topClientRows = Array.from(revenueByClient.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Analytics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5">
          <p className="text-xl font-semibold text-navy-black">{formatNaira(totalRevenue)}</p>
          <p className="mt-1 text-sm text-navy-black/60">Revenue (all time)</p>
        </div>
        <Link
          href="/admin/payouts"
          className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
        >
          <p className="text-xl font-semibold text-navy-black">{formatNaira(totalPaidToArtisans)}</p>
          <p className="mt-1 text-sm text-navy-black/60">Paid to artisans</p>
        </Link>
        <Link
          href="/admin/expenses"
          className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
        >
          <p className="text-xl font-semibold text-navy-black">{formatNaira(totalExpenses)}</p>
          <p className="mt-1 text-sm text-navy-black/60">Operating expenses</p>
        </Link>
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5">
          <p className={`text-xl font-semibold ${netProfit >= 0 ? "text-navy-black" : "text-red-700"}`}>
            {formatNaira(netProfit)}
          </p>
          <p className="mt-1 text-sm text-navy-black/60">Net profit</p>
          <p className="mt-0.5 text-xs text-navy-black/40">revenue − payouts − expenses</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
          >
            <p className="text-xl font-semibold text-navy-black">{k.value}</p>
            <p className="mt-1 text-sm text-navy-black/60">{k.label}</p>
            <p className="mt-0.5 text-xs text-navy-black/40">{k.sub}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy-black">Revenue vs. money out — last 6 months</h2>
          <div className="flex items-center gap-4 text-xs text-navy-black/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-charcoal/30" /> Payouts + expenses
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-4" style={{ height: 180 }}>
          {months.map((m) => {
            const revenue = revenueByMonth.get(m) ?? 0;
            const moneyOut = moneyOutByMonth.get(m) ?? 0;
            return (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center gap-1">
                  <div
                    className="w-1/2 rounded-t-md bg-amber"
                    style={{ height: `${Math.max(4, (revenue / maxMonthly) * 100)}%` }}
                    title={`Revenue: ${formatNaira(revenue)}`}
                  />
                  <div
                    className="w-1/2 rounded-t-md bg-charcoal/30"
                    style={{ height: `${Math.max(4, (moneyOut / maxMonthly) * 100)}%` }}
                    title={`Payouts + expenses: ${formatNaira(moneyOut)}`}
                  />
                </div>
                <span className="text-xs text-navy-black/50">{monthLabel(m)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-navy-black/70">
          Revenue: {formatNaira(Array.from(revenueByMonth.values()).reduce((a, b) => a + b, 0))}
          {" · "}
          Payouts + expenses:{" "}
          {formatNaira(Array.from(moneyOutByMonth.values()).reduce((a, b) => a + b, 0))}
        </p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-semibold text-navy-black">Work orders by status</h2>
          <ul className="mt-3 space-y-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4">
            {WORK_ORDER_STATUSES.map((status) => {
              const count = statusCounts.get(status) ?? 0;
              const pct = totalWorkOrders > 0 ? (count / totalWorkOrders) * 100 : 0;
              return (
                <li key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-black">{workOrderStatusLabel(status)}</span>
                    <span className="text-navy-black/60">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-off-white">
                    <div
                      className="h-1.5 rounded-full bg-amber"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-navy-black">Top clients by revenue</h2>
          {topClientRows.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No successful payments yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
              {topClientRows.map(([name, total]) => (
                <li key={name} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-navy-black">{name}</span>
                  <span className="font-medium text-navy-black">{formatNaira(total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-semibold text-navy-black">Estimated job cost by property</h2>
          <p className="mt-1 text-xs text-navy-black/50">
            From itemized cost breakdowns — a pricing estimate, not actual money spent.
          </p>
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
          <h2 className="font-semibold text-navy-black">Artisan performance</h2>
          {artisanRows.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No completed jobs yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
              {artisanRows.map(([name, stats]) => (
                <li key={name} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <span className="text-navy-black">{name}</span>
                    <p className="text-xs text-navy-black/50">
                      {stats.count} job{stats.count === 1 ? "" : "s"} &middot;{" "}
                      {formatNaira(stats.totalValue)} handled
                    </p>
                  </div>
                  {stats.ratingCount > 0 && (
                    <span className="text-amber">
                      &#9733; {(stats.ratingSum / stats.ratingCount).toFixed(1)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-semibold text-navy-black">Expenses by category</h2>
          {expenseRows.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">
              No expenses logged yet.{" "}
              <Link href="/admin/expenses" className="text-charcoal underline underline-offset-2">
                Log one
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
              {expenseRows.map(([category, total]) => (
                <li key={category} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-navy-black">{category}</span>
                  <span className="font-medium text-navy-black">{formatNaira(total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
