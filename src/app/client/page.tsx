import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Icon } from "@/components/ui/icons";
import { SERVICES, serviceLabel } from "@/lib/services";

export default async function ClientOverviewPage() {
  const supabase = await createClient();

  const [{ data: properties }, { data: jobs }, { data: pending }] = await Promise.all([
    supabase.from("properties").select("id, address"),
    supabase
      .from("work_orders")
      .select("id, date, description, status, cost_amount, service_type, property_id, properties(address)")
      .order("date", { ascending: false })
      .limit(50),
    supabase.from("payments").select("amount").eq("status", "pending"),
  ]);

  const open = (jobs ?? []).filter((j) => !["complete", "cancelled"].includes(j.status));
  const requested = open.filter((j) => j.status === "requested").length;
  const due = (pending ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  const recent = (jobs ?? []).slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Welcome back"
        description="Everything happening at your properties, in one place."
        actions={
          <Link href="/client/book" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Book a service
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Properties" value={properties?.length ?? 0} href="/client/properties" />
        <StatCard label="Open jobs" value={open.length} hint={`${requested} waiting to be scheduled`} href="/client/jobs" />
        <StatCard
          label="Completed jobs"
          value={(jobs ?? []).filter((j) => j.status === "complete").length}
          href="/client/jobs?status=complete"
        />
        <StatCard label="Amount due" value={formatNaira(due)} hint="Unpaid invoices" href="/client/payments" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-navy-black">Recent jobs</h2>
            <Link href="/client/jobs" className="text-sm font-semibold text-charcoal">
              All jobs &rarr;
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No jobs yet"
                body="Book your first service and it will show up here with photos and costs."
                action={<Link href="/client/book" className="btn-primary">Book a service</Link>}
              />
            </div>
          ) : (
            <ul className="card mt-4 divide-y divide-line">
              {recent.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/client/properties/${j.property_id}#wo-${j.id}`}
                    className="flex flex-col gap-2 p-4 transition hover:bg-off-white/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-navy-black/55">
                        {formatDate(j.date)} &middot; {serviceLabel(j.service_type)} &middot;{" "}
                        {j.properties?.address}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-navy-black">{j.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {Number(j.cost_amount) > 0 && (
                        <span className="font-mono text-sm text-navy-black/70">{formatNaira(j.cost_amount)}</span>
                      )}
                      <StatusBadge status={j.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl text-navy-black">Quick book</h2>
          <div className="mt-4 grid gap-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/client/book?service=${s.slug}`}
                className="card flex items-center gap-3 p-3.5 transition hover:border-charcoal/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal/10 text-charcoal">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium text-navy-black">{s.name}</span>
                <Icon name="arrow" className="h-4 w-4 text-navy-black/40" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
