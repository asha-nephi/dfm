"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initializePaystackTransaction } from "@/lib/paystack";

export async function payNow(formData: FormData) {
  const paymentId = String(formData.get("paymentId") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS scopes this to the caller's own payment — returns null if it's not
  // theirs or not pending.
  const { data: payment } = await supabase
    .from("payments")
    .select("*, clients(email)")
    .eq("id", paymentId)
    .eq("status", "pending")
    .maybeSingle();

  if (!payment) {
    redirect("/client/payments?error=1");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const reference = `dfm_${payment.id}_${Date.now()}`;

  let authorizationUrl: string;
  try {
    const init = await initializePaystackTransaction({
      email: payment.clients?.email ?? user.email!,
      amountNaira: Number(payment.amount),
      reference,
      callbackUrl: `${siteUrl}/api/paystack/callback?payment_id=${payment.id}`,
    });
    authorizationUrl = init.authorization_url;
  } catch {
    redirect("/client/payments?error=1");
  }

  redirect(authorizationUrl);
}
