import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { CreatePayoutForm } from "./create-payout-form";
import { OtpFinalizeForm } from "./otp-finalize-form";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  otp_required: "Awaiting code",
  success: "Paid",
  failed: "Failed",
  reversed: "Reversed",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  otp_required: "bg-amber/20 text-amber-900",
  success: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  reversed: "bg-charcoal/10 text-navy-black/60",
};

export default async function AdminPayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{
    initiated?: string;
    finalized?: string;
    error?: string;
    otp_error?: string;
    reason?: string;
  }>;
}) {
  const { initiated, finalized, error, otp_error, reason } = await searchParams;
  const supabase = await createClient();

  const [{ data: artisans }, { data: workOrders }, { data: payouts }] = await Promise.all([
    supabase.from("artisans").select("id, name, paystack_recipient_code").order("name"),
    supabase
      .from("work_orders")
      .select("id, assigned_artisan_id, description, cost_amount, properties(address)")
      .eq("status", "complete")
      .not("assigned_artisan_id", "is", null)
      .order("date", { ascending: false }),
    supabase
      .from("payouts")
      .select("*, artisans(name), work_orders(description)")
      .order("created_at", { ascending: false }),
  ]);

  const payableArtisans = (artisans ?? []).filter((a) => a.paystack_recipient_code);
  const unpayableArtisans = (artisans ?? []).filter((a) => !a.paystack_recipient_code);

  const artisanOptions = payableArtisans.map((a) => ({ id: a.id, name: a.name }));
  const workOrderOptions = (workOrders ?? [])
    .filter((wo) => payableArtisans.some((a) => a.id === wo.assigned_artisan_id))
    .map((wo) => ({
      id: wo.id,
      artisanId: wo.assigned_artisan_id!,
      description: wo.description,
      costAmount: wo.cost_amount,
      propertyAddress: wo.properties?.address ?? "",
    }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Payouts</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Pay artisans by bank transfer via Paystack. Transfers draw from your Paystack account
        balance.
      </p>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Send a payout</h2>
        {initiated && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Transfer initiated — enter the confirmation code below once Paystack sends it.
          </p>
        )}
        {finalized && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Code confirmed — check the transfer status below.
          </p>
        )}
        {error === "no_bank" && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            That artisan hasn&apos;t added a payout account yet.
          </p>
        )}
        {error && error !== "no_bank" && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {reason
              ? reason
              : "Something went wrong sending that transfer — please check the details and try again."}
          </p>
        )}
        {otp_error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {reason ? reason : "That code didn't work — check the payout below and try entering it again."}
          </p>
        )}

        {artisanOptions.length === 0 ? (
          <p className="mt-4 text-sm text-navy-black/60">
            No artisans have a payout account on file yet — they can add one from their profile
            page.
          </p>
        ) : (
          <CreatePayoutForm artisans={artisanOptions} workOrders={workOrderOptions} />
        )}

        {unpayableArtisans.length > 0 && (
          <p className="mt-4 text-xs text-navy-black/50">
            No payout account on file: {unpayableArtisans.map((a) => a.name).join(", ")}
          </p>
        )}
      </section>

      <section className="mt-8">
        {!payouts || payouts.length === 0 ? (
          <p className="text-sm text-navy-black/60">No payouts yet.</p>
        ) : (
          <ul className="space-y-3">
            {payouts.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-navy-black/60">
                    {formatDate(p.created_at)} &middot; {p.artisans?.name}
                  </p>
                  <p className="mt-0.5 text-navy-black">{p.reason ?? "Payout"}</p>
                  {p.work_orders?.description && (
                    <p className="mt-0.5 text-xs text-navy-black/40">
                      Work order: {p.work_orders.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-navy-black">
                    {formatNaira(Number(p.amount))}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status] ?? "bg-charcoal/10 text-navy-black"}`}
                  >
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                  {p.status === "otp_required" && <OtpFinalizeForm payoutId={p.id} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
