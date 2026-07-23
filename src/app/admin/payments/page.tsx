import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { createPaymentRequest } from "./actions";
import { PaymentStatusSelect } from "./payment-status-select";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; updated?: string; error?: string }>;
}) {
  const { added, updated, error } = await searchParams;
  const supabase = await createClient();

  const [{ data: payments }, { data: properties }] = await Promise.all([
    supabase
      .from("payments")
      .select("*, clients(name), properties(address)")
      .order("date", { ascending: false }),
    supabase
      .from("properties")
      .select("id, address, clients(name)")
      .order("address"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Payments</h1>

      <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-6">
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
        <form
          action={createPaymentRequest}
          className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_2fr_auto]"
        >
          <select
            name="propertyId"
            required
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="">Select property...</option>
            {properties?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.clients?.name} — {p.address}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount (₦)"
            min={1}
            step="1"
            required
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <input
            name="description"
            placeholder="e.g. July 2026 management fee"
            required
            className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <button
            type="submit"
            className="rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-off-white hover:bg-navy-black"
          >
            Create
          </button>
        </form>
      </section>

      <section className="mt-8">
        {!payments || payments.length === 0 ? (
          <p className="text-sm text-navy-black/60">No payments yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-charcoal/10 bg-white p-4"
              >
                <div>
                  <p className="text-sm text-navy-black/60">
                    {formatDate(p.date)} &middot; {p.clients?.name}
                    {p.properties?.address ? ` · ${p.properties.address}` : ""}
                  </p>
                  <p className="mt-0.5 text-navy-black">{p.description ?? "Payment"}</p>
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
