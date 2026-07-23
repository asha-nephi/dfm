import { NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("payment_id");
  const reference = url.searchParams.get("reference");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  if (!paymentId || !reference) {
    return NextResponse.redirect(`${siteUrl}/client/payments?error=1`);
  }

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .maybeSingle();

  if (!payment) {
    return NextResponse.redirect(`${siteUrl}/client/payments?error=1`);
  }

  // Already processed (e.g. user refreshed the callback page) — don't
  // re-verify or re-write.
  if (payment.status !== "pending") {
    return NextResponse.redirect(
      `${siteUrl}/client/payments?${payment.status === "success" ? "paid=1" : "failed=1"}`,
    );
  }

  let verified;
  try {
    verified = await verifyPaystackTransaction(reference);
  } catch {
    return NextResponse.redirect(`${siteUrl}/client/payments?error=1`);
  }

  const amountMatches = Math.round(Number(payment.amount) * 100) === verified.amount;
  const newStatus = verified.status === "success" && amountMatches ? "success" : "failed";

  await admin
    .from("payments")
    .update({ status: newStatus, paystack_reference: reference })
    .eq("id", paymentId)
    .eq("status", "pending");

  return NextResponse.redirect(
    `${siteUrl}/client/payments?${newStatus === "success" ? "paid=1" : "failed=1"}`,
  );
}
