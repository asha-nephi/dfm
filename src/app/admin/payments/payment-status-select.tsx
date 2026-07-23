"use client";

import { setPaymentStatus } from "./actions";

export function PaymentStatusSelect({
  paymentId,
  status,
}: {
  paymentId: string;
  status: string;
}) {
  return (
    <form action={setPaymentStatus}>
      <input type="hidden" name="paymentId" value={paymentId} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-charcoal/20 px-2 py-1 text-xs focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
      >
        <option value="pending">Pending</option>
        <option value="success">Paid</option>
        <option value="failed">Failed</option>
      </select>
    </form>
  );
}
