import { workOrderStatusLabel } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  requested: "bg-blue-50 text-blue-700",
  accepted: "bg-amber/20 text-amber-900",
  in_progress: "bg-amber/20 text-amber-900",
  complete: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-charcoal/10 text-navy-black"}`}
    >
      {workOrderStatusLabel(status)}
    </span>
  );
}
