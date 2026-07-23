export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function propertyTypeLabel(type: string): string {
  return type === "short_term_rental" ? "Short-term rental" : "Long-term let";
}

export function workOrderStatusLabel(status: string): string {
  switch (status) {
    case "requested":
      return "Requested";
    case "accepted":
      return "Accepted";
    case "in_progress":
      return "In progress";
    case "complete":
      return "Complete";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}
