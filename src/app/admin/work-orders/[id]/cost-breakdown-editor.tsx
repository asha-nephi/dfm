"use client";

import { useState } from "react";

type Row = { label: string; amount: number };

export function CostBreakdownEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial.length > 0 ? initial : [{ label: "", amount: 0 }]);

  const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", amount: 0 }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input
        type="hidden"
        name="costBreakdown"
        value={JSON.stringify(rows.filter((r) => r.label.trim() !== ""))}
      />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              placeholder="e.g. Plumber labor"
              className="flex-1 rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
            <input
              type="number"
              min={0}
              step="1"
              value={row.amount}
              onChange={(e) => updateRow(i, { amount: Number(e.target.value) })}
              placeholder="Amount (₦)"
              className="w-36 rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="px-2 text-sm text-navy-black/50 hover:text-red-600"
              aria-label="Remove line item"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 text-sm font-medium text-charcoal underline underline-offset-2"
      >
        + Add line item
      </button>
      <p className="mt-3 text-sm font-medium text-navy-black">
        Total: ₦{total.toLocaleString("en-NG")}
      </p>
    </div>
  );
}
