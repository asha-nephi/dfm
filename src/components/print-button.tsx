"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black active:bg-navy-black/90 print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
