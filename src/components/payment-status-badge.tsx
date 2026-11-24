const LABELS: Record<string, string> = {
  pending: "Pending",
  success: "Paid",
  failed: "Failed",
};

const STYLES: Record<string, string> = {
  pending: "bg-amber/15 text-[#7a5a26] ring-1 ring-amber/30",
  success: "bg-charcoal/10 text-charcoal ring-1 ring-charcoal/20",
  failed: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status] ?? "bg-charcoal/10 text-navy-black"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
