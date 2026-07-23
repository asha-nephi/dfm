"use client";

import { useMemo, useState } from "react";
import { createPaymentRequest } from "./actions";
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
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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
      setAmount(String(wo.costAmount || ""));
      setDescription(wo.description);
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
          name="description"
          placeholder="e.g. July 2026 management fee"
          required
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
          Amount and description were pre-filled from the selected work order — edit either before creating.
        </p>
      )}
    </form>
  );
}
