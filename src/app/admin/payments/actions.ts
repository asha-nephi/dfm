"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createPaymentSchema = z.object({
  propertyId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  description: z.string().trim().min(1).max(300),
});

export async function createPaymentRequest(formData: FormData) {
  const parsed = createPaymentSchema.safeParse({
    propertyId: formData.get("propertyId"),
    amount: formData.get("amount"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect("/admin/payments?error=1");
  }

  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("client_id")
    .eq("id", parsed.data.propertyId)
    .maybeSingle();

  if (!property) {
    redirect("/admin/payments?error=1");
  }

  const { error } = await supabase.from("payments").insert({
    client_id: property.client_id,
    property_id: parsed.data.propertyId,
    amount: parsed.data.amount,
    description: parsed.data.description,
    status: "pending",
  });

  if (error) {
    redirect("/admin/payments?error=1");
  }

  revalidatePath("/admin/payments");
  redirect("/admin/payments?added=1");
}

const statusUpdateSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(["pending", "success", "failed"]),
});

export async function setPaymentStatus(formData: FormData) {
  const parsed = statusUpdateSchema.safeParse({
    paymentId: formData.get("paymentId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/admin/payments?error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.paymentId);

  if (error) {
    redirect("/admin/payments?error=1");
  }

  revalidatePath("/admin/payments");
  redirect("/admin/payments?updated=1");
}
