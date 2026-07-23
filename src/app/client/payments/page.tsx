import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { payNow } from "./actions";

export default async function ClientPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; failed?: string; error?: string }>;
}) {
  const { paid, failed, error } = await searchParams;
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("*, properties(address)")
    .order("date", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Payments</h1>

      {paid && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Payment successful — thank you.
        </p>
      )}
      {failed && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Payment was not successful. Please try again or contact DFM.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong starting checkout — please try again.
        </p>
      )}

      {!payments || payments.length === 0 ? (
        <p className="mt-6 text-sm text-navy-black/60">No payments on file yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {payments.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-navy-black/60">
                  {formatDate(p.date)}
                  {p.properties?.address ? ` · ${p.properties.address}` : ""}
                </p>
                <p className="mt-0.5 text-navy-black">{p.description ?? "Payment"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-navy-black">
                  {formatNaira(p.amount)}
                </span>
                <PaymentStatusBadge status={p.status} />
                {p.status === "pending" && (
                  <form action={payNow}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-amber px-3 py-1.5 text-sm font-semibold text-charcoal hover:bg-amber/90"
                    >
                      Pay now
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
