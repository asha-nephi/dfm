import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { payNow } from "./actions";
import { SubmitButton } from "@/components/submit-button";

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

  const bankName = process.env.DFM_BANK_NAME;
  const bankAccountName = process.env.DFM_BANK_ACCOUNT_NAME;
  const bankAccountNumber = process.env.DFM_BANK_ACCOUNT_NUMBER;
  const hasBankDetails = Boolean(bankName && bankAccountName && bankAccountNumber);

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
              className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                  {p.status === "pending" && p.provider !== "manual_bank_transfer" && (
                    <form action={payNow}>
                      <input type="hidden" name="paymentId" value={p.id} />
                      <SubmitButton className="rounded-md bg-amber px-3 py-1.5 text-sm font-semibold text-charcoal hover:bg-amber/90">
  Pay now
</SubmitButton>
                    </form>
                  )}
                </div>
              </div>
              {p.status === "pending" && p.provider === "manual_bank_transfer" && (
                <div className="rounded-lg border border-amber/30 bg-amber/5 p-3 text-sm text-navy-black/80">
                  <p className="font-medium text-navy-black">Pay by bank transfer</p>
                  {hasBankDetails ? (
                    <>
                      <p className="mt-1">
                        {bankAccountName} &middot; {bankName} &middot; {bankAccountNumber}
                      </p>
                      <p className="mt-1 text-xs text-navy-black/60">
                        Paystack can&apos;t process payments from outside Nigeria for this
                        business, so please wire this amount directly. Include your name or
                        property address as the transfer note, and let us know once it&apos;s
                        sent — we&apos;ll confirm receipt on your account here.
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-navy-black/60">
                      Paystack can&apos;t process payments from outside Nigeria for this
                      business. Contact DFM directly for our bank transfer details, and
                      we&apos;ll confirm receipt on your account once it&apos;s sent.
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
