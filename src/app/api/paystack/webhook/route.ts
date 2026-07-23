import { NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/format";
import { notifyArtisanPayoutSent } from "@/lib/email";

// Paystack transfers are asynchronous: finalize_transfer can return
// "success" immediately, but often settles a moment later — this webhook
// is the authoritative source of truth for that final status. Only
// transfer.* events are handled; payments still use the redirect-based
// callback in /api/paystack/callback.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (!event.event?.startsWith("transfer.")) {
    return NextResponse.json({ received: true });
  }

  const reference: string | undefined = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  const newStatus =
    event.event === "transfer.success"
      ? "success"
      : event.event === "transfer.failed"
        ? "failed"
        : event.event === "transfer.reversed"
          ? "reversed"
          : null;

  if (!newStatus) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();

  const { data: payout } = await admin
    .from("payouts")
    .select("id, status, amount, artisans(email, name)")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (!payout) {
    return NextResponse.json({ received: true });
  }

  const wasAlreadySuccess = payout.status === "success";

  await admin.from("payouts").update({ status: newStatus }).eq("id", payout.id);

  if (newStatus === "success" && !wasAlreadySuccess && payout.artisans?.email) {
    await notifyArtisanPayoutSent({
      artisanEmail: payout.artisans.email,
      artisanName: payout.artisans.name,
      amount: formatNaira(Number(payout.amount)),
    });
  }

  return NextResponse.json({ received: true });
}
