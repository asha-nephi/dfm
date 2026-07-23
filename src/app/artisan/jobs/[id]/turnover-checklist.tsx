"use client";

import { useState } from "react";

type ChecklistItem = { item: string; done: boolean };

export function TurnoverChecklist({ initial }: { initial: ChecklistItem[] }) {
  const [rows, setRows] = useState<ChecklistItem[]>(initial);

  function toggle(i: number) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, done: !r.done } : r)));
  }

  return (
    <div>
      <input type="hidden" name="turnoverChecklist" value={JSON.stringify(rows)} />
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={i}>
            <label className="flex items-center gap-2 text-sm text-navy-black">
              <input type="checkbox" checked={row.done} onChange={() => toggle(i)} />
              <span className={row.done ? "line-through text-navy-black/50" : ""}>
                {row.item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
