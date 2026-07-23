"use client";

import { SubmitButton } from "@/components/submit-button";

function maskAccountNumber(accountNumber: string): string {
  return `••••${accountNumber.slice(-4)}`;
}

export function BankDetailsForm({
  action,
  banks,
  currentBankName,
  currentAccountNumber,
  currentAccountName,
  onFileLabel = "On file",
  emptyLabel = "No account on file yet.",
}: {
  action: (formData: FormData) => void;
  banks: { name: string; code: string }[];
  currentBankName: string | null;
  currentAccountNumber: string | null;
  currentAccountName: string | null;
  onFileLabel?: string;
  emptyLabel?: string;
}) {
  return (
    <div>
      {currentAccountName && currentAccountNumber ? (
        <p className="rounded-md bg-off-white px-3 py-2 text-sm text-navy-black">
          {onFileLabel}: <strong>{currentAccountName}</strong> — {currentBankName}{" "}
          {maskAccountNumber(currentAccountNumber)}
        </p>
      ) : (
        <p className="text-sm text-navy-black/60">{emptyLabel}</p>
      )}

      <form action={action} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-black">Bank</label>
          <select
            name="bankCode"
            required
            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          >
            <option value="">Select bank...</option>
            {banks.map((b) => (
              <option key={`${b.code}-${b.name}`} value={`${b.code}|${b.name}`}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-black">Account number</label>
          <input
            name="accountNumber"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            minLength={10}
            required
            placeholder="0123456789"
            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
        </div>
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-5 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
          Verify &amp; save
        </SubmitButton>
        <p className="text-xs text-navy-black/50">
          We verify the account name with your bank before saving, so a typo won&apos;t send money
          to the wrong account.
        </p>
      </form>
    </div>
  );
}
