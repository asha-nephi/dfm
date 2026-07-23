"use client";

import { useState } from "react";

type ChecklistItem = { item: string; done: boolean };

const DEFAULT_STR_CHECKLIST = [
  "Linens changed",
  "Towels replaced",
  "Trash removed",
  "Kitchen and dishes cleaned",
  "Bathroom cleaned and restocked",
  "Fridge cleaned / emptied of prior guest items",
  "Floors swept and mopped",
  "Toiletries and welcome supplies restocked",
  "Appliances checked (AC, water heater, etc.)",
  "Door/window locks checked",
];

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

  function loadDefaultChecklist() {
    setRows((prev) => {
      const existingLabels = new Set(prev.map((r) => r.item.trim().toLowerCase()));
      const withoutBlank = prev.filter((r) => r.item.trim() !== "");
      const toAdd = DEFAULT_STR_CHECKLIST.filter(
        (item) => !existingLabels.has(item.toLowerCase()),
      ).map((item) => ({ item, done: false }));
      return [...withoutBlank, ...toAdd];
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={loadDefaultChecklist}
        className="mb-2 rounded-md border border-charcoal/20 px-3 py-1.5 text-xs font-medium text-navy-black hover:border-charcoal/40"
      >
        Load default checklist
      </button>
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
              className="flex-1 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
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
