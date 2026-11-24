import { workOrderStatusLabel } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  requested: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  accepted: "bg-amber/15 text-[#7a5a26] ring-1 ring-amber/30",
  in_progress: "bg-amber/15 text-[#7a5a26] ring-1 ring-amber/30",
  complete: "bg-charcoal/10 text-charcoal ring-1 ring-charcoal/20",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-charcoal/10 text-navy-black"}`}
    >
      {workOrderStatusLabel(status)}
    </span>
  );
}
