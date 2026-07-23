import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/format";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    { count: clients },
    { count: properties },
    { count: openWorkOrders },
    { count: flagged },
    { count: leads },
    { data: monthPayments },
    { data: allPayments },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("work_orders")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(complete,cancelled)"),
    supabase
      .from("work_orders")
      .select("*", { count: "exact", head: true })
      .eq("flagged_for_review", true),
    supabase.from("contact_leads").select("*", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("amount")
      .eq("status", "success")
      .gte("date", monthStart),
    supabase.from("payments").select("amount").eq("status", "success"),
  ]);

  const monthRevenue = (monthPayments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalRevenue = (allPayments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  const revenueStats = [
    {
      label: "Revenue this month",
      value: formatNaira(monthRevenue),
      href: "/admin/analytics",
    },
    { label: "Total revenue (all time)", value: formatNaira(totalRevenue), href: "/admin/payments" },
  ];

  const stats = [
    { label: "Clients", value: String(clients ?? 0), href: "/admin/clients" },
    { label: "Properties", value: String(properties ?? 0), href: "/admin/clients" },
    { label: "Open work orders", value: String(openWorkOrders ?? 0), href: "/admin/work-orders" },
    {
      label: "Flagged for review",
      value: String(flagged ?? 0),
      href: "/admin/work-orders?filter=flagged",
    },
    { label: "New leads", value: String(leads ?? 0), href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {revenueStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
          >
            <p className="text-2xl font-semibold text-navy-black">{s.value}</p>
            <p className="mt-1 text-sm text-navy-black/60">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 hover:border-amber/60"
          >
            <p className="text-2xl font-semibold text-navy-black">{s.value}</p>
            <p className="mt-1 text-sm text-navy-black/60">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
