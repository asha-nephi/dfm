"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { initiateTransfer, finalizeTransfer } from "@/lib/paystack";
import { formatNaira } from "@/lib/format";
import { notifyArtisanPayoutSent } from "@/lib/email";

const initiateSchema = z.object({
  artisanId: z.string().uuid(),
  workOrderId: z.string().uuid().optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
  reason: z.string().trim().min(1).max(300),
});

export async function initiatePayout(formData: FormData) {
  const parsed = initiateSchema.safeParse({
    artisanId: formData.get("artisanId"),
    workOrderId: formData.get("workOrderId"),
    amount: formData.get("amount"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    redirect("/admin/payouts?error=1");
  }

  const supabase = await createClient();

  const { data: artisan } = await supabase
    .from("artisans")
    .select("paystack_recipient_code")
    .eq("id", parsed.data.artisanId)
    .maybeSingle();

  if (!artisan?.paystack_recipient_code) {
    redirect("/admin/payouts?error=no_bank");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  const payoutId = crypto.randomUUID();
  const reference = `dfm_payout_${payoutId}_${Date.now()}`;

  let transfer;
  try {
    transfer = await initiateTransfer({
      amountNaira: parsed.data.amount,
      recipientCode: artisan.paystack_recipient_code,
      reason: parsed.data.reason,
      reference,
    });
  } catch {
    redirect("/admin/payouts?error=1");
  }

  const status =
    transfer.status === "otp" ? "otp_required" : transfer.status === "success" ? "success" : "pending";

  const { error } = await supabase.from("payouts").insert({
    id: payoutId,
    artisan_id: parsed.data.artisanId,
    work_order_id: parsed.data.workOrderId || null,
    amount: parsed.data.amount,
    reason: parsed.data.reason,
    status,
    paystack_transfer_code: transfer.transfer_code,
    paystack_reference: reference,
    initiated_by: admin?.id ?? null,
  });

  if (error) {
    redirect("/admin/payouts?error=1");
  }

  revalidatePath("/admin/payouts");
  redirect("/admin/payouts?initiated=1");
}

const finalizeSchema = z.object({
  payoutId: z.string().uuid(),
  otp: z.string().trim().min(4).max(10),
});

export async function finalizePayoutOtp(formData: FormData) {
  const parsed = finalizeSchema.safeParse({
    payoutId: formData.get("payoutId"),
    otp: formData.get("otp"),
  });

  if (!parsed.success) {
    redirect("/admin/payouts?otp_error=1");
  }

  const supabase = await createClient();

  const { data: payout } = await supabase
    .from("payouts")
    .select("paystack_transfer_code, status, amount, artisans(email, name)")
    .eq("id", parsed.data.payoutId)
    .maybeSingle();

  if (!payout || payout.status !== "otp_required" || !payout.paystack_transfer_code) {
    redirect("/admin/payouts?otp_error=1");
  }

  let result;
  try {
    result = await finalizeTransfer({
      transferCode: payout.paystack_transfer_code,
      otp: parsed.data.otp,
    });
  } catch {
    redirect(`/admin/payouts?otp_error=1&payout=${parsed.data.payoutId}`);
  }

  const newStatus = result.status === "success" ? "success" : result.status === "failed" ? "failed" : "pending";

  await supabase.from("payouts").update({ status: newStatus }).eq("id", parsed.data.payoutId);

  if (newStatus === "success" && payout.artisans?.email) {
    await notifyArtisanPayoutSent({
      artisanEmail: payout.artisans.email,
      artisanName: payout.artisans.name,
      amount: formatNaira(Number(payout.amount)),
    });
  }

  revalidatePath("/admin/payouts");
  redirect("/admin/payouts?finalized=1");
}
