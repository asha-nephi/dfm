"use client";

import { useMemo, useState } from "react";
import { initiatePayout } from "./actions";
import { SubmitButton } from "@/components/submit-button";

type WorkOrderOption = {
  id: string;
  artisanId: string;
  description: string;
  costAmount: number;
  propertyAddress: string;
};

type ArtisanOption = {
  id: string;
  name: string;
};

export function CreatePayoutForm({
  artisans,
  workOrders,
}: {
  artisans: ArtisanOption[];
  workOrders: WorkOrderOption[];
}) {
  const [artisanId, setArtisanId] = useState("");
  const [workOrderId, setWorkOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const workOrdersForArtisan = useMemo(
    () => workOrders.filter((wo) => wo.artisanId === artisanId),
    [workOrders, artisanId],
  );

  function handleArtisanChange(value: string) {
    setArtisanId(value);
    setWorkOrderId("");
  }

  function handleWorkOrderChange(value: string) {
    setWorkOrderId(value);
    const wo = workOrdersForArtisan.find((w) => w.id === value);
    if (wo) {
      setAmount(String(wo.costAmount || ""));
      setReason(`${wo.description} — ${wo.propertyAddress}`);
    }
  }

  return (
    <form action={initiatePayout} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="artisanId"
          required
          value={artisanId}
          onChange={(e) => handleArtisanChange(e.target.value)}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        >
          <option value="">Select artisan...</option>
          {artisans.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          name="workOrderId"
          value={workOrderId}
          onChange={(e) => handleWorkOrderChange(e.target.value)}
          disabled={!artisanId}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30 disabled:bg-off-white disabled:text-navy-black/40"
        >
          <option value="">
            {artisanId ? "No work order (general payout)" : "Select an artisan first"}
          </option>
          {workOrdersForArtisan.map((wo) => (
            <option key={wo.id} value={wo.id}>
              {wo.description.slice(0, 40)} — ₦{wo.costAmount.toLocaleString("en-NG")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
        <input
          type="number"
          name="amount"
          placeholder="Amount (₦)"
          min={1}
          step="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <input
          name="reason"
          placeholder="e.g. Payout for deep cleaning job"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Send payout
</SubmitButton>
      </div>
      {workOrderId && (
        <p className="text-xs text-navy-black/50">
          Amount and reason were pre-filled from the selected work order — edit either before
          sending.
        </p>
      )}
      <p className="text-xs text-navy-black/50">
        Paystack will text a one-time code to confirm this transfer — you&apos;ll enter it below
        once it&apos;s sent.
      </p>
    </form>
  );
}
