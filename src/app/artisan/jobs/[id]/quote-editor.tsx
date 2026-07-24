"use client";

import { useState } from "react";
import { submitQuote } from "./actions";
import { SubmitButton } from "@/components/submit-button";

type Row = { label: string; amount: number };

export function QuoteEditor({
  jobId,
  initial,
  initialNote,
}: {
  jobId: string;
  initial: Row[];
  initialNote: string;
}) {
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
    <form action={submitQuote} className="mt-3 space-y-3">
      <input type="hidden" name="jobId" value={jobId} />
      <input
        type="hidden"
        name="quote"
        value={JSON.stringify(rows.filter((r) => r.label.trim() !== ""))}
      />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              placeholder="e.g. Labor + materials"
              className="flex-1 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <input
              type="number"
              min={0}
              step="1"
              value={row.amount}
              onChange={(e) => updateRow(i, { amount: Number(e.target.value) })}
              placeholder="Amount (₦)"
              className="w-36 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
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
        className="text-sm font-medium text-charcoal underline underline-offset-2"
      >
        + Add line item
      </button>
      <textarea
        name="note"
        defaultValue={initialNote}
        rows={2}
        placeholder="Note for DFM (optional) — e.g. what's included, materials needed"
        className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-navy-black">
          Total: ₦{total.toLocaleString("en-NG")}
        </p>
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Submit quote
</SubmitButton>
      </div>
    </form>
  );
}
