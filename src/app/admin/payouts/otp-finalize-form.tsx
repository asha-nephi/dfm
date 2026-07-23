"use client";

import { useState } from "react";
import { finalizePayoutOtp } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export function OtpFinalizeForm({ payoutId }: { payoutId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-amber/60 bg-amber/10 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber/20"
      >
        Enter code to confirm
      </button>
    );
  }

  return (
    <form action={finalizePayoutOtp} className="flex items-center gap-2">
      <input type="hidden" name="payoutId" value={payoutId} />
      <input
        name="otp"
        placeholder="OTP"
        required
        autoFocus
        className="w-24 rounded-md border border-charcoal/15 bg-white px-2 py-1 text-xs text-navy-black placeholder:text-navy-black/40 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      />
      <SubmitButton className="rounded-md bg-charcoal px-3 py-1 text-xs font-medium text-off-white hover:bg-navy-black">
        Confirm
      </SubmitButton>
    </form>
  );
}
