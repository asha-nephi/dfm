"use client";

import { recordBankTransferPayment } from "./actions";
import { SubmitButton } from "@/components/submit-button";

type PropertyOption = {
  id: string;
  address: string;
  clientName: string | null;
};

export function RecordBankTransferForm({ properties }: { properties: PropertyOption[] }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={recordBankTransferPayment} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          name="propertyId"
          required
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        >
          <option value="">Select property...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.clientName} — {p.address}
            </option>
          ))}
        </select>
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="Amount received (₦)"
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <input
          name="date"
          type="date"
          required
          defaultValue={today}
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="reference"
          required
          placeholder="Reference / note (e.g. sender name, transfer ref)"
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <input
          name="description"
          placeholder="What's it for (optional, e.g. July 2026 management fee)"
          className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
      </div>
      <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Record payment received
</SubmitButton>
    </form>
  );
}
