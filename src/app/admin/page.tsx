import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: clients },
    { count: properties },
    { count: openWorkOrders },
    { count: flagged },
    { count: leads },
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
  ]);

  const stats = [
    { label: "Clients", value: clients ?? 0, href: "/admin/clients" },
    { label: "Properties", value: properties ?? 0, href: "/admin/clients" },
    { label: "Open work orders", value: openWorkOrders ?? 0, href: "/admin/work-orders" },
    { label: "Flagged for review", value: flagged ?? 0, href: "/admin/work-orders?filter=flagged" },
    { label: "New leads", value: leads ?? 0, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-charcoal/10 bg-white p-5 hover:border-amber/60"
          >
            <p className="text-2xl font-semibold text-navy-black">{s.value}</p>
            <p className="mt-1 text-sm text-navy-black/60">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
