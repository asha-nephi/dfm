import { resolveBankAccount, createTransferRecipient } from "@/lib/paystack";

// Shared by the artisan and client bank-details actions: verifies the
// account number actually belongs to a real account (catches typos before
// they cost a failed transfer) and tokenizes it as a Paystack transfer
// recipient so we never need to re-send the raw account number again.
export async function verifyAndTokenizeBankAccount(params: {
  bankCode: string;
  bankName: string;
  accountNumber: string;
}): Promise<{ accountName: string; recipientCode: string }> {
  const resolved = await resolveBankAccount({
    accountNumber: params.accountNumber,
    bankCode: params.bankCode,
  });

  const recipient = await createTransferRecipient({
    name: resolved.account_name,
    accountNumber: params.accountNumber,
    bankCode: params.bankCode,
  });

  return { accountName: resolved.account_name, recipientCode: recipient.recipient_code };
}
