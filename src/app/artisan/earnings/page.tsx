import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { PageHeader, StatCard, EmptyState } from "@/components/ui/page-header";

const STATUS: Record<string, { label: string; cls: string }> = {
  success: { label: "Paid", cls: "bg-charcoal/10 text-charcoal ring-charcoal/20" },
  pending: { label: "Processing", cls: "bg-amber/15 text-[#7a5a26] ring-amber/30" },
  otp_required: { label: "Processing", cls: "bg-amber/15 text-[#7a5a26] ring-amber/30" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-700 ring-red-200" },
  reversed: { label: "Reversed", cls: "bg-red-50 text-red-700 ring-red-200" },
};

export default async function ArtisanEarningsPage() {
  const supabase = await createClient();
  const { data: payouts } = await supabase
    .from("payouts")
    .select("id, amount, status, reason, created_at, work_orders(description, properties(address))")
    .order("created_at", { ascending: false });

  const list = payouts ?? [];
  const paid = list.filter((p) => p.status === "success").reduce((s, p) => s + Number(p.amount), 0);
  const processing = list
    .filter((p) => p.status === "pending" || p.status === "otp_required")
    .reduce((s, p) => s + Number(p.amount), 0);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const thisMonth = list
    .filter((p) => p.status === "success" && new Date(p.created_at).getTime() >= monthStart)
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Your money"
        title="Earnings"
        description="Payments DFM has sent to your bank account. Make sure your bank details on your profile are correct."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Paid this month" value={formatNaira(thisMonth)} />
        <StatCard label="Paid in total" value={formatNaira(paid)} />
        <StatCard label="Being processed" value={formatNaira(processing)} />
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <EmptyState title="No payments yet" body="Once a job is checked and paid out, it shows up here." />
        ) : (
          <ul className="card divide-y divide-line">
            {list.map((p) => {
              const st = STATUS[p.status] ?? { label: p.status, cls: "bg-off-white text-navy-black ring-line" };
              return (
                <li key={p.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-black">
                      {p.work_orders?.description ?? p.reason ?? "Payment"}
                    </p>
                    <p className="text-xs text-navy-black/55">
                      {formatDate(p.created_at)}
                      {p.work_orders?.properties?.address ? ` · ${p.work_orders.properties.address}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-sm font-semibold text-navy-black">{formatNaira(Number(p.amount))}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${st.cls}`}>{st.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
