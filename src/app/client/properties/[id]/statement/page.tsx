import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PrintButton } from "@/components/print-button";

type CostLineItem = { label?: string; amount?: number };

export default async function PropertyStatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*, clients(name, email)")
    .eq("id", id)
    .maybeSingle();

  if (!property) notFound();

  const [{ data: workOrders }, { data: payments }] = await Promise.all([
    supabase
      .from("work_orders")
      .select("*")
      .eq("property_id", id)
      .order("date", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("property_id", id)
      .order("date", { ascending: false }),
  ]);

  const totalMaintenanceCost = (workOrders ?? []).reduce((sum, wo) => sum + wo.cost_amount, 0);
  const totalPaid = (payments ?? [])
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/client/properties/${id}`}
          className="text-sm text-charcoal underline underline-offset-2"
        >
          &larr; {property.address}
        </Link>
        <PrintButton />
      </div>

      <div className="mt-6 border-b border-charcoal/10 pb-6 print:mt-0">
        <p className="text-sm font-semibold text-charcoal">Deseret Facility Management</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy-black">Property statement</h1>
        <p className="mt-1 text-sm text-navy-black/60">{property.address}</p>
        <p className="text-sm text-navy-black/60">
          {property.clients?.name} &middot; {property.clients?.email}
        </p>
        <p className="mt-1 text-xs text-navy-black/40">
          Generated {formatDate(new Date().toISOString())}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-charcoal/10 p-4">
          <p className="text-xs text-navy-black/50">Total maintenance cost</p>
          <p className="mt-1 text-xl font-semibold text-navy-black">
            {formatNaira(totalMaintenanceCost)}
          </p>
        </div>
        <div className="rounded-xl border border-charcoal/10 p-4">
          <p className="text-xs text-navy-black/50">Total paid</p>
          <p className="mt-1 text-xl font-semibold text-navy-black">{formatNaira(totalPaid)}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold text-navy-black">Maintenance history</h2>
        {!workOrders || workOrders.length === 0 ? (
          <p className="mt-2 text-sm text-navy-black/60">No maintenance activity recorded.</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs text-navy-black/50">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => {
                const breakdown = Array.isArray(wo.cost_breakdown)
                  ? (wo.cost_breakdown as CostLineItem[])
                  : [];
                return (
                  <tr key={wo.id} className="border-b border-charcoal/5 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-navy-black/70">
                      {formatDate(wo.date)}
                    </td>
                    <td className="py-2 pr-3 text-navy-black">
                      {wo.description}
                      {breakdown.length > 0 && (
                        <ul className="mt-1 text-xs text-navy-black/50">
                          {breakdown.map((item, i) => (
                            <li key={i}>
                              {item.label ?? "Item"} — {formatNaira(item.amount ?? 0)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="py-2 text-right whitespace-nowrap text-navy-black">
                      {formatNaira(wo.cost_amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-navy-black">Payment history</h2>
        {!payments || payments.length === 0 ? (
          <p className="mt-2 text-sm text-navy-black/60">No payments recorded.</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs text-navy-black/50">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-charcoal/5">
                  <td className="py-2 pr-3 whitespace-nowrap text-navy-black/70">
                    {formatDate(p.date)}
                  </td>
                  <td className="py-2 pr-3 text-navy-black">{p.description ?? "Payment"}</td>
                  <td className="py-2 pr-3 text-navy-black/70 capitalize">{p.status}</td>
                  <td className="py-2 text-right whitespace-nowrap text-navy-black">
                    {formatNaira(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
