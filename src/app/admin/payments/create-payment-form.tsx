"use client";

import { useMemo, useState } from "react";
import { createPaymentRequest } from "./actions";
import { ChargeBreakdownEditor } from "./charge-breakdown-editor";
import { SubmitButton } from "@/components/submit-button";

type WorkOrderOption = {
  id: string;
  propertyId: string;
  description: string;
  costAmount: number;
  status: string;
};

type PropertyOption = {
  id: string;
  address: string;
  clientName: string | null;
};

type ChargeRow = { label: string; amount: number };

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  in_progress: "In progress",
  complete: "Complete",
  cancelled: "Cancelled",
};

export function CreatePaymentForm({
  properties,
  workOrders,
}: {
  properties: PropertyOption[];
  workOrders: WorkOrderOption[];
}) {
  const [propertyId, setPropertyId] = useState("");
  const [workOrderId, setWorkOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [chargeRows, setChargeRows] = useState<ChargeRow[]>([]);

  const workOrdersForProperty = useMemo(
    () => workOrders.filter((wo) => wo.propertyId === propertyId),
    [workOrders, propertyId],
  );

  function handlePropertyChange(value: string) {
    setPropertyId(value);
    setWorkOrderId("");
  }

  function handleWorkOrderChange(value: string) {
    setWorkOrderId(value);
    const wo = workOrdersForProperty.find((w) => w.id === value);
    if (wo) {
      setDescription(wo.description);
      setChargeRows((prev) => {
        const withoutJobCost = prev.filter((r) => r.label !== "Repair / job cost");
        return [...withoutJobCost, { label: "Repair / job cost", amount: wo.costAmount }];
      });
    }
  }

  return (
    <form action={createPaymentRequest} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="propertyId"
          required
          value={propertyId}
          onChange={(e) => handlePropertyChange(e.target.value)}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        >
          <option value="">Select property...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.clientName} — {p.address}
            </option>
          ))}
        </select>

        <select
          name="workOrderId"
          value={workOrderId}
          onChange={(e) => handleWorkOrderChange(e.target.value)}
          disabled={!propertyId}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30 disabled:bg-off-white disabled:text-navy-black/40"
        >
          <option value="">
            {propertyId ? "No work order (general payment)" : "Select a property first"}
          </option>
          {workOrdersForProperty.map((wo) => (
            <option key={wo.id} value={wo.id}>
              {wo.description.slice(0, 40)} — ₦{wo.costAmount.toLocaleString("en-NG")} (
              {STATUS_LABEL[wo.status] ?? wo.status})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-black">Charges</label>
        <div className="mt-1">
          <ChargeBreakdownEditor rows={chargeRows} onChange={setChargeRows} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-black">Payment method</label>
        <select
          name="provider"
          defaultValue="paystack"
          className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        >
          <option value="paystack">Paystack (Nigerian bank cards only)</option>
          <option value="manual_bank_transfer">Bank transfer (diaspora / international clients)</option>
        </select>
        <p className="mt-1 text-xs text-navy-black/50">
          Bank transfer shows the client our account details instead of a &quot;Pay now&quot;
          button — Paystack can&apos;t process international payments for this business.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          name="description"
          placeholder="Note (optional, e.g. July 2026 management fee)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Create
</SubmitButton>
      </div>
      {workOrderId && (
        <p className="text-xs text-navy-black/50">
          A &quot;Repair / job cost&quot; charge was pre-filled from the selected work order —
          edit the amount, or add more charges (like a coordination fee), before creating.
        </p>
      )}
    </form>
  );
}
