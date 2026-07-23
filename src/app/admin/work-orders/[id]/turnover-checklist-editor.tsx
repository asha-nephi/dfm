"use client";

import { useState } from "react";

type ChecklistItem = { item: string; done: boolean };

export function TurnoverChecklistEditor({ initial }: { initial: ChecklistItem[] }) {
  const [rows, setRows] = useState<ChecklistItem[]>(
    initial.length > 0 ? initial : [{ item: "", done: false }],
  );

  function updateRow(i: number, patch: Partial<ChecklistItem>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { item: "", done: false }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input
        type="hidden"
        name="turnoverChecklist"
        value={JSON.stringify(rows.filter((r) => r.item.trim() !== ""))}
      />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={row.done}
              onChange={(e) => updateRow(i, { done: e.target.checked })}
            />
            <input
              value={row.item}
              onChange={(e) => updateRow(i, { item: e.target.value })}
              placeholder="e.g. Linens changed"
              className="flex-1 rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="px-2 text-sm text-navy-black/50 hover:text-red-600"
              aria-label="Remove checklist item"
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
        + Add checklist item
      </button>
    </div>
  );
}
