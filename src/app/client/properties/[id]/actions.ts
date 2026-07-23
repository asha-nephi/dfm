"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notifyAdminNewMaintenanceRequest } from "@/lib/email";

const requestSchema = z.object({
  propertyId: z.string().uuid(),
  description: z.string().trim().min(1, "Please describe the issue").max(2000),
});

export async function submitMaintenanceRequest(formData: FormData) {
  const parsed = requestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(
      `/client/properties/${formData.get("propertyId")}?request_error=1`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("work_orders").insert({
    property_id: parsed.data.propertyId,
    description: parsed.data.description,
    created_by: "client",
    status: "requested",
    flagged_for_review: false,
    cost_amount: 0,
    assigned_artisan_id: null,
  });

  if (error) {
    redirect(`/client/properties/${parsed.data.propertyId}?request_error=1`);
  }

  const { data: property } = await supabase
    .from("properties")
    .select("address, clients(name)")
    .eq("id", parsed.data.propertyId)
    .maybeSingle();

  if (property) {
    await notifyAdminNewMaintenanceRequest({
      clientName: property.clients?.name ?? "A client",
      propertyAddress: property.address,
      description: parsed.data.description,
    });
  }

  revalidatePath(`/client/properties/${parsed.data.propertyId}`);
  redirect(`/client/properties/${parsed.data.propertyId}?request_sent=1`);
}

const ratingSchema = z.object({
  workOrderId: z.string().uuid(),
  propertyId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function rateWorkOrder(formData: FormData) {
  const parsed = ratingSchema.safeParse({
    workOrderId: formData.get("workOrderId"),
    propertyId: formData.get("propertyId"),
    rating: formData.get("rating"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    redirect(`/client/properties/${formData.get("propertyId")}?rating_error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("client_rate_work_order", {
    p_work_order_id: parsed.data.workOrderId,
    p_rating: parsed.data.rating,
    p_note: parsed.data.note || "",
  });

  if (error) {
    redirect(`/client/properties/${parsed.data.propertyId}?rating_error=1`);
  }

  revalidatePath(`/client/properties/${parsed.data.propertyId}`);
  redirect(`/client/properties/${parsed.data.propertyId}?rated=1`);
}

export async function addComment(formData: FormData) {
  const workOrderId = String(formData.get("workOrderId") ?? "");
  const propertyId = String(formData.get("propertyId") ?? "");
  const body = String(formData.get("body") ?? "");

  const supabase = await createClient();
  await supabase.rpc("add_work_order_comment", {
    p_work_order_id: workOrderId,
    p_body: body,
  });

  revalidatePath(`/client/properties/${propertyId}`);
  redirect(`/client/properties/${propertyId}`);
}
