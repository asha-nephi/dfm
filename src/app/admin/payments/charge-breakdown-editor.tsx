"use client";

type Row = { label: string; amount: number };

const PRESET_CHARGES = ["Flat management fee", "Coordination fee", "Repair / job cost"];

export function ChargeBreakdownEditor({
  rows,
  onChange,
}: {
  rows: Row[];
  onChange: (rows: Row[]) => void;
}) {
  function updateRow(i: number, patch: Partial<Row>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRow(label = "") {
    onChange([...rows, { label, amount: 0 }]);
  }

  function removeRow(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }

  const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESET_CHARGES.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => addRow(label)}
            className="rounded-md border border-charcoal/20 px-3 py-1.5 text-xs font-medium text-navy-black hover:border-charcoal/40"
          >
            + {label}
          </button>
        ))}
      </div>

      <input
        type="hidden"
        name="chargeBreakdown"
        value={JSON.stringify(rows.filter((r) => r.label.trim() !== ""))}
      />

      {rows.length > 0 && (
        <div className="mt-3 space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.label}
                onChange={(e) => updateRow(i, { label: e.target.value })}
                placeholder="Charge label"
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
                aria-label="Remove charge"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 && (
        <p className="mt-3 text-sm text-navy-black/50">
          Click a charge type above, or add a custom one.
        </p>
      )}

      <button
        type="button"
        onClick={() => addRow()}
        className="mt-2 text-sm font-medium text-charcoal underline underline-offset-2"
      >
        + Add custom charge
      </button>

      <p className="mt-3 text-sm font-medium text-navy-black">
        Total: ₦{total.toLocaleString("en-NG")}
      </p>
    </div>
  );
}
