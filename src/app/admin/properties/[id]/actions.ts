"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const workOrderSchema = z.object({
  propertyId: z.string().uuid(),
  date: z.string().min(1),
  description: z.string().trim().min(1).max(2000),
});

export async function createWorkOrder(formData: FormData) {
  const parsed = workOrderSchema.safeParse({
    propertyId: formData.get("propertyId"),
    date: formData.get("date"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(`/admin/properties/${formData.get("propertyId")}?error=1`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_orders")
    .insert({
      property_id: parsed.data.propertyId,
      date: parsed.data.date,
      description: parsed.data.description,
      created_by: "admin",
      status: "accepted",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/admin/properties/${parsed.data.propertyId}?error=1`);
  }

  revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
  redirect(`/admin/work-orders/${data.id}`);
}

const propertyUpdateSchema = z.object({
  propertyId: z.string().uuid(),
  address: z.string().trim().min(1).max(300),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  propertyType: z.enum(["long_term_let", "short_term_rental"]),
});

export async function updateProperty(formData: FormData) {
  const parsed = propertyUpdateSchema.safeParse({
    propertyId: formData.get("propertyId"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    propertyType: formData.get("propertyType"),
  });

  if (!parsed.success) {
    redirect(`/admin/properties/${formData.get("propertyId")}?error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .update({
      address: parsed.data.address,
      notes: parsed.data.notes || null,
      property_type: parsed.data.propertyType,
    })
    .eq("id", parsed.data.propertyId);

  if (error) {
    redirect(`/admin/properties/${parsed.data.propertyId}?error=1`);
  }

  revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
  redirect(`/admin/properties/${parsed.data.propertyId}?updated=1`);
}
