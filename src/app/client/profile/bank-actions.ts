"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { verifyAndTokenizeBankAccount } from "@/lib/bank-payout";

const schema = z.object({
  bankCode: z.string().trim().min(1),
  bankName: z.string().trim().min(1),
  accountNumber: z.string().trim().regex(/^\d{10}$/, "Account number must be 10 digits"),
});

export async function saveClientBankDetails(formData: FormData) {
  const rawBank = String(formData.get("bankCode") ?? "");
  const [bankCode, bankName] = rawBank.split("|");

  const parsed = schema.safeParse({
    bankCode,
    bankName,
    accountNumber: formData.get("accountNumber"),
  });

  if (!parsed.success) {
    redirect("/client/profile?bank_error=1");
  }

  let tokenized;
  try {
    tokenized = await verifyAndTokenizeBankAccount({
      bankCode: parsed.data.bankCode,
      bankName: parsed.data.bankName,
      accountNumber: parsed.data.accountNumber,
    });
  } catch {
    redirect("/client/profile?bank_error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_own_client_bank_details", {
    p_bank_name: parsed.data.bankName,
    p_bank_code: parsed.data.bankCode,
    p_account_number: parsed.data.accountNumber,
    p_account_name: tokenized.accountName,
    p_paystack_recipient_code: tokenized.recipientCode,
  });

  if (error) {
    redirect("/client/profile?bank_error=1");
  }

  revalidatePath("/client/profile");
  redirect("/client/profile?bank_updated=1");
}
