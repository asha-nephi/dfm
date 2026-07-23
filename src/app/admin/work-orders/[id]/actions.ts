"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const lineItemSchema = z.object({
  label: z.string().trim().min(1),
  amount: z.coerce.number().min(0),
});

const checklistItemSchema = z.object({
  item: z.string().trim().min(1),
  done: z.boolean(),
});

const updateSchema = z.object({
  workOrderId: z.string().uuid(),
  date: z.string().min(1),
  description: z.string().trim().min(1).max(2000),
  status: z.enum(["requested", "accepted", "in_progress", "complete", "cancelled"]),
  assignedArtisanId: z.string().uuid().optional().or(z.literal("")),
  flagReason: z.string().trim().max(1000).optional().or(z.literal("")),
  costBreakdown: z.string(),
  turnoverChecklist: z.string().optional().or(z.literal("")),
});

export async function updateWorkOrder(formData: FormData) {
  // Unchecked checkboxes are omitted from FormData entirely, so
  // formData.get("flagged") is `null`, not `undefined` — zod's
  // `.optional()` only accepts the latter, so this is handled outside the
  // schema rather than tripping validation on every unflagged save.
  const flagged = formData.get("flagged") === "on";

  const parsed = updateSchema.safeParse({
    workOrderId: formData.get("workOrderId"),
    date: formData.get("date"),
    description: formData.get("description"),
    status: formData.get("status"),
    assignedArtisanId: formData.get("assignedArtisanId"),
    flagReason: formData.get("flagReason"),
    costBreakdown: formData.get("costBreakdown"),
    turnoverChecklist: formData.get("turnoverChecklist"),
  });

  if (!parsed.success) {
    redirect(`/admin/work-orders/${formData.get("workOrderId")}?error=1`);
  }

  let breakdown: { label: string; amount: number }[] = [];
  try {
    const rawItems = JSON.parse(parsed.data.costBreakdown);
    breakdown = z.array(lineItemSchema).parse(rawItems);
  } catch {
    redirect(`/admin/work-orders/${parsed.data.workOrderId}?error=1`);
  }

  // Only present on the form for short-term-rental properties (Section
  // 3.7) — absent entirely for long-term-let, which keeps it null.
  let checklist: { item: string; done: boolean }[] | null = null;
  if (parsed.data.turnoverChecklist) {
    try {
      const rawItems = JSON.parse(parsed.data.turnoverChecklist);
      checklist = z.array(checklistItemSchema).parse(rawItems);
    } catch {
      redirect(`/admin/work-orders/${parsed.data.workOrderId}?error=1`);
    }
  }

  const costAmount = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const supabase = await createClient();
  const { error } = await supabase
    .from("work_orders")
    .update({
      date: parsed.data.date,
      description: parsed.data.description,
      status: parsed.data.status,
      assigned_artisan_id: parsed.data.assignedArtisanId || null,
      flagged_for_review: flagged,
      flag_reason: flagged ? parsed.data.flagReason || null : null,
      cost_breakdown: breakdown,
      cost_amount: costAmount,
      turnover_checklist: checklist,
    })
    .eq("id", parsed.data.workOrderId);

  if (error) {
    redirect(`/admin/work-orders/${parsed.data.workOrderId}?error=1`);
  }

  revalidatePath(`/admin/work-orders/${parsed.data.workOrderId}`);
  redirect(`/admin/work-orders/${parsed.data.workOrderId}?updated=1`);
}

export async function uploadWorkOrderPhoto(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const file = formData.get("file") as File | null;

  if (!workOrderId || !file || file.size === 0) {
    redirect(`/admin/work-orders/${workOrderId}?photo_error=1`);
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${workOrderId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("work-order-photos")
    .upload(path, buffer, { contentType: file.type || "image/jpeg" });

  if (uploadError) {
    redirect(`/admin/work-orders/${workOrderId}?photo_error=1`);
  }

  const { error: insertError } = await supabase.from("work_order_photos").insert({
    work_order_id: workOrderId,
    uploaded_by: "admin",
    photo_url: path,
  });

  if (insertError) {
    redirect(`/admin/work-orders/${workOrderId}?photo_error=1`);
  }

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}`);
}

export async function deleteWorkOrderPhoto(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const photoId = String(formData.get("photoId") ?? "");
  const photoPath = String(formData.get("photoPath") ?? "");

  const supabase = await createClient();
  await supabase.storage.from("work-order-photos").remove([photoPath]);
  await supabase.from("work_order_photos").delete().eq("id", photoId);

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}`);
}
