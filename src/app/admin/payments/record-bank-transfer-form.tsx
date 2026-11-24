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
          className="input"
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
          className="input"
        />
        <input
          name="date"
          type="date"
          required
          defaultValue={today}
          className="input"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="reference"
          required
          placeholder="Reference / note (e.g. sender name, transfer ref)"
          className="input"
        />
        <input
          name="description"
          placeholder="What's it for (optional, e.g. July 2026 management fee)"
          className="input"
        />
      </div>
      <SubmitButton className="btn-primary">
  Record payment received
</SubmitButton>
    </form>
  );
}
