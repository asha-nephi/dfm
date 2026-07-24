"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  notifyClientWorkOrderComplete,
  notifyArtisanJobAssigned,
  notifyArtisanQuoteAccepted,
  notifyArtisanQuoteDeclined,
} from "@/lib/email";
import { formatNaira } from "@/lib/format";

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
  artisanRating: z.string().optional().or(z.literal("")),
  artisanRatingNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateWorkOrder(formData: FormData) {
  // Unchecked checkboxes are omitted from FormData entirely, so
  // formData.get("flagged") is `null`, not `undefined` — zod's
  // `.optional()` only accepts the latter, so this is handled outside the
  // schema rather than tripping validation on every unflagged save.
  const flagged = formData.get("flagged") === "on";

  // Same issue for turnoverChecklist: that field only renders in the form
  // for short-term-rental properties, so on a long-term-let work order
  // formData.get() returns `null` (absent), not `undefined` — coerce to ""
  // so it doesn't trip .optional() validation on every LTL save.
  const parsed = updateSchema.safeParse({
    workOrderId: formData.get("workOrderId"),
    date: formData.get("date"),
    description: formData.get("description"),
    status: formData.get("status"),
    assignedArtisanId: formData.get("assignedArtisanId"),
    flagReason: formData.get("flagReason"),
    costBreakdown: formData.get("costBreakdown"),
    turnoverChecklist: formData.get("turnoverChecklist") ?? "",
    artisanRating: formData.get("artisanRating"),
    artisanRatingNote: formData.get("artisanRatingNote"),
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

  const { data: before } = await supabase
    .from("work_orders")
    .select("status, assigned_artisan_id, property_id, properties(address, clients(email))")
    .eq("id", parsed.data.workOrderId)
    .maybeSingle();

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
      artisan_rating: parsed.data.artisanRating ? Number(parsed.data.artisanRating) : null,
      artisan_rating_note: parsed.data.artisanRatingNote || null,
    })
    .eq("id", parsed.data.workOrderId);

  if (error) {
    redirect(`/admin/work-orders/${parsed.data.workOrderId}?error=1`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (before && before.status !== "complete" && parsed.data.status === "complete" && before.properties) {
    const clientEmail = before.properties.clients?.email;
    if (clientEmail) {
      await notifyClientWorkOrderComplete({
        clientEmail,
        propertyAddress: before.properties.address,
        description: parsed.data.description,
        siteUrl,
      });
    }
  }

  const newArtisanId = parsed.data.assignedArtisanId || null;
  if (before && before.properties && newArtisanId && newArtisanId !== before.assigned_artisan_id) {
    const { data: artisan } = await supabase
      .from("artisans")
      .select("email")
      .eq("id", newArtisanId)
      .maybeSingle();
    if (artisan?.email) {
      await notifyArtisanJobAssigned({
        artisanEmail: artisan.email,
        propertyAddress: before.properties.address,
        description: parsed.data.description,
        siteUrl,
      });
    }
  }

  revalidatePath(`/admin/work-orders/${parsed.data.workOrderId}`);
  redirect(`/admin/work-orders/${parsed.data.workOrderId}?updated=1`);
}

export async function acceptArtisanQuote(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const supabase = await createClient();

  const { data: before } = await supabase
    .from("work_orders")
    .select("artisan_quote, properties(address), artisans(email, name)")
    .eq("id", workOrderId)
    .maybeSingle();

  const breakdown = Array.isArray(before?.artisan_quote)
    ? (before.artisan_quote as { label: string; amount: number }[])
    : [];

  if (breakdown.length === 0) {
    redirect(`/admin/work-orders/${workOrderId}?error=1`);
  }

  const costAmount = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const { error } = await supabase
    .from("work_orders")
    .update({
      cost_breakdown: breakdown,
      cost_amount: costAmount,
      artisan_quote: null,
      artisan_quote_note: null,
    })
    .eq("id", workOrderId);

  if (error) {
    redirect(`/admin/work-orders/${workOrderId}?error=1`);
  }

  const artisanEmail = before?.artisans?.email;
  if (artisanEmail && before?.properties) {
    await notifyArtisanQuoteAccepted({
      artisanEmail,
      artisanName: before.artisans?.name ?? "there",
      propertyAddress: before.properties.address,
      amount: formatNaira(costAmount),
    });
  }

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}?updated=1`);
}

export async function declineArtisanQuote(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const supabase = await createClient();

  const { data: before } = await supabase
    .from("work_orders")
    .select("properties(address), artisans(email, name)")
    .eq("id", workOrderId)
    .maybeSingle();

  const { error } = await supabase
    .from("work_orders")
    .update({ artisan_quote: null, artisan_quote_note: null })
    .eq("id", workOrderId);

  if (error) {
    redirect(`/admin/work-orders/${workOrderId}?error=1`);
  }

  const artisanEmail = before?.artisans?.email;
  if (artisanEmail && before?.properties) {
    await notifyArtisanQuoteDeclined({
      artisanEmail,
      artisanName: before.artisans?.name ?? "there",
      propertyAddress: before.properties.address,
    });
  }

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}?updated=1`);
}

export async function uploadWorkOrderPhoto(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const files = formData.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);

  if (!workOrderId || files.length === 0) {
    redirect(`/admin/work-orders/${workOrderId}?photo_error=1`);
  }

  const supabase = await createClient();
  let hadError = false;

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${workOrderId}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("work-order-photos")
      .upload(path, buffer, { contentType: file.type || "image/jpeg" });

    if (uploadError) {
      hadError = true;
      continue;
    }

    const { error: insertError } = await supabase.from("work_order_photos").insert({
      work_order_id: workOrderId,
      uploaded_by: "admin",
      photo_url: path,
    });

    if (insertError) hadError = true;
  }

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}${hadError ? "?photo_error=1" : ""}`);
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

export async function addComment(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const body = String(formData.get("body") ?? "");

  const supabase = await createClient();
  await supabase.rpc("add_work_order_comment", {
    p_work_order_id: workOrderId,
    p_body: body,
  });

  revalidatePath(`/admin/work-orders/${workOrderId}`);
  redirect(`/admin/work-orders/${workOrderId}`);
}
