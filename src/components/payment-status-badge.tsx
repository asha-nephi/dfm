const LABELS: Record<string, string> = {
  pending: "Pending",
  success: "Paid",
  failed: "Failed",
};

const STYLES: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  success: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status] ?? "bg-charcoal/10 text-navy-black"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
