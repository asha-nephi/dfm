import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { PaymentStatusSelect } from "./payment-status-select";
import { CreatePaymentForm } from "./create-payment-form";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; updated?: string; error?: string }>;
}) {
  const { added, updated, error } = await searchParams;
  const supabase = await createClient();

  const [{ data: payments }, { data: properties }, { data: workOrders }] = await Promise.all([
    supabase
      .from("payments")
      .select("*, clients(name), properties(address), work_orders(description)")
      .order("date", { ascending: false }),
    supabase
      .from("properties")
      .select("id, address, clients(name)")
      .order("address"),
    supabase
      .from("work_orders")
      .select("id, property_id, description, cost_amount, status")
      .order("date", { ascending: false }),
  ]);

  const propertyOptions = (properties ?? []).map((p) => ({
    id: p.id,
    address: p.address,
    clientName: p.clients?.name ?? null,
  }));

  const workOrderOptions = (workOrders ?? []).map((wo) => ({
    id: wo.id,
    propertyId: wo.property_id,
    description: wo.description,
    costAmount: wo.cost_amount,
    status: wo.status,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Payments</h1>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Create a payment request</h2>
        {added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Payment request created.
          </p>
        )}
        {updated && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Payment updated.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please check the form and try again.
          </p>
        )}
        <CreatePaymentForm properties={propertyOptions} workOrders={workOrderOptions} />
      </section>

      <section className="mt-8">
        {!payments || payments.length === 0 ? (
          <p className="text-sm text-navy-black/60">No payments yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-navy-black/60">
                    {formatDate(p.date)} &middot; {p.clients?.name}
                    {p.properties?.address ? ` · ${p.properties.address}` : ""}
                  </p>
                  <p className="mt-0.5 text-navy-black">{p.description ?? "Payment"}</p>
                  {p.work_orders?.description && (
                    <p className="mt-0.5 text-xs text-navy-black/40">
                      Work order: {p.work_orders.description}
                    </p>
                  )}
                  {p.paystack_reference && (
                    <p className="mt-0.5 text-xs text-navy-black/40">
                      Ref: {p.paystack_reference}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-navy-black">
                    {formatNaira(p.amount)}
                  </span>
                  <PaymentStatusBadge status={p.status} />
                  <PaymentStatusSelect paymentId={p.id} status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
