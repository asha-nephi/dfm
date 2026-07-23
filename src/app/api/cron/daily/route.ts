import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/format";
import { notifyClientPaymentDue, sendEmail } from "@/lib/email";

const ADMIN_NOTIFY_EMAIL = "nephi.asha@deseretfacilities.com";

// Runs daily via Vercel Cron (see vercel.json). Two independent jobs:
//  1. On the 1st of the month, generate a pending payment for every
//     property with a monthly_fee configured — idempotent via the
//     (property_id, recurring_period) unique index, so re-running the same
//     day is harmless.
//  2. Any day: create a work order for any preventive maintenance schedule
//     whose next_due_date has arrived, then advance that date.
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

  return NextResponse.json({ ok: true, feesCreated, schedulesProcessed });
}
