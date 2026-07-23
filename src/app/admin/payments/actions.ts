"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/format";
import { notifyClientPaymentDue, notifyClientPaymentReceived } from "@/lib/email";

const createPaymentSchema = z.object({
  propertyId: z.string().uuid(),
  workOrderId: z.string().uuid().optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
  description: z.string().trim().min(1).max(300),
});

export async function createPaymentRequest(formData: FormData) {
  const parsed = createPaymentSchema.safeParse({
    propertyId: formData.get("propertyId"),
    workOrderId: formData.get("workOrderId"),
    amount: formData.get("amount"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect("/admin/payments?error=1");
  }

  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("client_id, clients(email)")
    .eq("id", parsed.data.propertyId)
    .maybeSingle();

  if (!property) {
    redirect("/admin/payments?error=1");
  }

  if (parsed.data.workOrderId) {
    const { data: workOrder } = await supabase
      .from("work_orders")
      .select("property_id")
      .eq("id", parsed.data.workOrderId)
      .maybeSingle();

    if (!workOrder || workOrder.property_id !== parsed.data.propertyId) {
      redirect("/admin/payments?error=1");
    }
  }

  const { error } = await supabase.from("payments").insert({
    client_id: property.client_id,
    property_id: parsed.data.propertyId,
    work_order_id: parsed.data.workOrderId || null,
    amount: parsed.data.amount,
    description: parsed.data.description,
    status: "pending",
  });

  if (error) {
    redirect("/admin/payments?error=1");
  }

  const clientEmail = property.clients?.email;
  if (clientEmail) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await notifyClientPaymentDue({
      clientEmail,
      amount: formatNaira(parsed.data.amount),
      description: parsed.data.description,
      siteUrl,
    });
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

  const { data: before } = await supabase
    .from("payments")
    .select("status, amount, description, clients(email)")
    .eq("id", parsed.data.paymentId)
    .maybeSingle();

  const { error } = await supabase
    .from("payments")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.paymentId);

  if (error) {
    redirect("/admin/payments?error=1");
  }

  const clientEmail = before?.clients?.email;
  if (before && before.status !== "success" && parsed.data.status === "success" && clientEmail) {
    await notifyClientPaymentReceived({
      clientEmail,
      amount: formatNaira(before.amount),
      description: before.description ?? "your payment",
    });
  }

  revalidatePath("/admin/payments");
  redirect("/admin/payments?updated=1");
}
