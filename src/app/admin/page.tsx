import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Icon } from "@/components/ui/icons";
import { serviceLabel } from "@/lib/services";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000).toISOString();

  const [
    { count: clients },
    { count: openWorkOrders },
    { count: requests },
    { count: flagged },
    { count: newLeads },
    { count: newApplications },
    { data: monthPayments },
    { data: overdue },
    { data: upcoming },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("work_orders")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(complete,cancelled)"),
    supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("flagged_for_review", true),
    supabase.from("contact_leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("artisan_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("payments").select("amount").eq("status", "success").gte("date", monthStart),
    supabase
      .from("payments")
      .select("id, amount, date, description, clients(name)")
      .eq("status", "pending")
      .lt("date", weekAgo)
      .order("date", { ascending: true })
      .limit(5),
    supabase
      .from("work_orders")
      .select("id, date, description, status, service_type, properties(address)")
      .in("status", ["accepted", "in_progress"])
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(6),
  ]);

  const monthRevenue = (monthPayments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  const attention = [
    { label: "New service requests", count: requests ?? 0, href: "/admin/requests", icon: "inbox" },
    { label: "Jobs flagged for review", count: flagged ?? 0, href: "/admin/work-orders?filter=flagged", icon: "shield" },
    { label: "Artisan applications to review", count: newApplications ?? 0, href: "/admin/artisan-applications", icon: "user" },
    { label: "New leads to contact", count: newLeads ?? 0, href: "/admin/leads", icon: "tag" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
        title="Overview"
        description="What needs you today, and how the business is doing."
        actions={
          <Link href="/admin/requests" className="btn-primary">
            <Icon name="inbox" className="h-4 w-4" /> Service requests
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Revenue this month" value={formatNaira(monthRevenue)} href="/admin/analytics" />
        <StatCard label="Open work orders" value={openWorkOrders ?? 0} href="/admin/work-orders" />
        <StatCard label="Clients" value={clients ?? 0} href="/admin/clients" />
        <StatCard label="Overdue payments" value={overdue?.length ?? 0} hint="Pending over 7 days" href="/admin/payments" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <h2 className="font-display text-2xl text-navy-black">Needs attention</h2>
          <ul className="card mt-4 divide-y divide-line">
            {attention.map((a) => (
              <li key={a.label}>
                <Link href={a.href} className="flex items-center gap-3 p-4 transition hover:bg-off-white/60">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                    <Icon name={a.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm text-navy-black">{a.label}</span>
                  <span
                    className={`min-w-8 rounded-full px-2.5 py-0.5 text-center font-mono text-sm font-semibold ${
                      a.count > 0 ? "bg-amber text-navy-black" : "bg-off-white text-navy-black/40"
                    }`}
                  >
                    {a.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {overdue && overdue.length > 0 && (
            <>
              <h3 className="mt-8 font-semibold text-navy-black">Oldest unpaid</h3>
              <ul className="card mt-3 divide-y divide-line">
                {overdue.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-navy-black">{p.clients?.name}</span>
                      <span className="text-xs text-navy-black/55">{formatDate(p.date)}</span>
                    </span>
                    <span className="font-mono text-navy-black">{formatNaira(Number(p.amount))}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-navy-black">Coming up</h2>
            <Link href="/admin/work-orders" className="text-sm font-semibold text-charcoal">
              All work orders &rarr;
            </Link>
          </div>
          {!upcoming || upcoming.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Nothing scheduled" body="Accepted and in-progress jobs from today onward show here." />
            </div>
          ) : (
            <ul className="card mt-4 divide-y divide-line">
              {upcoming.map((wo) => (
                <li key={wo.id}>
                  <Link
                    href={`/admin/work-orders/${wo.id}`}
                    className="flex items-center justify-between gap-3 p-4 transition hover:bg-off-white/60"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs text-navy-black/55">
                        {formatDate(wo.date)} &middot; {serviceLabel(wo.service_type)}
                      </span>
                      <span className="block truncate text-sm text-navy-black">{wo.properties?.address}</span>
                    </span>
                    <StatusBadge status={wo.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
