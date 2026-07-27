import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/format";
import { notifyClientPaymentDue, notifyClientPaymentOverdue, sendEmail } from "@/lib/email";

const ADMIN_NOTIFY_EMAIL = "nephi.asha@deseretfacilities.com";

// Runs daily via Vercel Cron (see vercel.json). Three independent jobs:
//  1. On the 1st of the month, generate a pending payment for every
//     property with a monthly_fee configured — idempotent via the
//     (property_id, recurring_period) unique index, so re-running the same
//     day is harmless.
//  2. Any day: create a work order for any preventive maintenance schedule
//     whose next_due_date has arrived, then advance that date.
//  3. Any day: nudge clients with a payment still pending 3+ days after its
//     date, then again every 7 days after that (tracked via
//     last_reminder_sent_at) — a payment due once and never followed up on
//     otherwise just sits silently as "outstanding" in Analytics forever.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  let feesCreated = 0;
  let schedulesProcessed = 0;

  // --- 1. Recurring monthly management fees ---------------------------
  if (today.getUTCDate() === 1) {
    const period = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}`;
    const monthName = today.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

    const { data: properties } = await supabase
      .from("properties")
      .select("id, client_id, monthly_fee, address, clients(email)")
      .gt("monthly_fee", 0);

    for (const property of properties ?? []) {
      const { error } = await supabase.from("payments").insert({
        client_id: property.client_id,
        property_id: property.id,
        amount: property.monthly_fee,
        description: `${monthName} management fee — ${property.address}`,
        status: "pending",
        recurring_period: period,
      });

      // 23505 = unique_violation — already billed this property for this
      // period (e.g. cron ran twice today). Not an error, just skip.
      if (error) {
        if (error.code !== "23505") console.error("recurring fee insert failed", error);
        continue;
      }

      feesCreated++;
      const clientEmail = property.clients?.email;
      if (clientEmail) {
        await notifyClientPaymentDue({
          clientEmail,
          amount: formatNaira(property.monthly_fee),
          description: `${monthName} management fee — ${property.address}`,
          siteUrl,
        });
      }
    }
  }

  // --- 2. Preventive maintenance schedules -----------------------------
  const { data: dueSchedules } = await supabase
    .from("maintenance_schedules")
    .select("id, property_id, title, interval_months, next_due_date, properties(address)")
    .eq("active", true)
    .lte("next_due_date", todayIso);

  for (const schedule of dueSchedules ?? []) {
    const { error: woError } = await supabase.from("work_orders").insert({
      property_id: schedule.property_id,
      date: todayIso,
      description: `Scheduled: ${schedule.title}`,
      created_by: "system",
      status: "requested",
    });

    if (woError) {
      console.error("scheduled maintenance work order insert failed", woError);
      continue;
    }

    const next = new Date(schedule.next_due_date);
    next.setUTCMonth(next.getUTCMonth() + schedule.interval_months);
    const nextIso = next.toISOString().slice(0, 10);

    await supabase
      .from("maintenance_schedules")
      .update({ next_due_date: nextIso })
      .eq("id", schedule.id);

    schedulesProcessed++;

    await sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `Scheduled maintenance due — ${schedule.properties?.address ?? ""}`,
      html: `<p><strong>${schedule.title}</strong> came due for ${schedule.properties?.address ?? "a property"} — a work order was created automatically. Next occurrence: ${nextIso}.</p>`,
    });
  }

  // --- 3. Overdue payment reminders ------------------------------------
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setUTCDate(today.getUTCDate() - 3);
  const threeDaysAgoIso = threeDaysAgo.toISOString().slice(0, 10);
  const sevenDaysAgoMs = today.getTime() - 7 * 24 * 60 * 60 * 1000;

  const { data: overduePayments } = await supabase
    .from("payments")
    .select("id, amount, description, date, last_reminder_sent_at, client_id, clients(email)")
    .eq("status", "pending")
    .lte("date", threeDaysAgoIso);

  let remindersSent = 0;

  for (const payment of overduePayments ?? []) {
    const lastReminder = payment.last_reminder_sent_at
      ? new Date(payment.last_reminder_sent_at).getTime()
      : null;
    if (lastReminder !== null && lastReminder > sevenDaysAgoMs) continue;

    const clientEmail = payment.clients?.email;
    if (!clientEmail) continue;

    const daysOverdue = Math.max(
      1,
      Math.round((today.getTime() - new Date(payment.date).getTime()) / (24 * 60 * 60 * 1000)),
    );

    await notifyClientPaymentOverdue({
      clientEmail,
      amount: formatNaira(payment.amount),
      description: payment.description ?? "your payment",
      daysOverdue,
      siteUrl,
    });

    await supabase
      .from("payments")
      .update({ last_reminder_sent_at: today.toISOString() })
      .eq("id", payment.id);

    remindersSent++;
  }

  return NextResponse.json({ ok: true, feesCreated, schedulesProcessed, remindersSent });
}
