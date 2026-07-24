"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/format";
import { notifyClientPaymentDue, notifyClientPaymentReceived } from "@/lib/email";

const chargeLineItemSchema = z.object({
  label: z.string().trim().min(1),
  amount: z.coerce.number().min(0),
});

const createPaymentSchema = z.object({
  propertyId: z.string().uuid(),
  workOrderId: z.string().uuid().optional().or(z.literal("")),
  chargeBreakdown: z.string(),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  provider: z.enum(["paystack", "manual_bank_transfer"]).default("paystack"),
});

export async function createPaymentRequest(formData: FormData) {
  const parsed = createPaymentSchema.safeParse({
    propertyId: formData.get("propertyId"),
    workOrderId: formData.get("workOrderId"),
    chargeBreakdown: formData.get("chargeBreakdown"),
    description: formData.get("description"),
    provider: formData.get("provider") || undefined,
  });

  if (!parsed.success) {
    redirect("/admin/payments?error=1");
  }

  let breakdown: { label: string; amount: number }[] = [];
  try {
    const rawItems = JSON.parse(parsed.data.chargeBreakdown);
    breakdown = z.array(chargeLineItemSchema).parse(rawItems);
  } catch {
    redirect("/admin/payments?error=1");
  }

  const amount = breakdown.reduce((sum, item) => sum + item.amount, 0);
  if (breakdown.length === 0 || amount <= 0) {
    redirect("/admin/payments?error=1");
  }

  const description = parsed.data.description || breakdown.map((b) => b.label).join(", ");

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
    amount,
    charge_breakdown: breakdown,
    description,
    status: "pending",
    provider: parsed.data.provider,
  });

  if (error) {
    redirect("/admin/payments?error=1");
  }

  const clientEmail = property.clients?.email;
  if (clientEmail) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await notifyClientPaymentDue({
      clientEmail,
      amount: formatNaira(amount),
      description,
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

const recordBankTransferSchema = z.object({
  propertyId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  date: z.string().min(1),
  reference: z.string().trim().min(1).max(300),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export async function recordBankTransferPayment(formData: FormData) {
  const parsed = recordBankTransferSchema.safeParse({
    propertyId: formData.get("propertyId"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    reference: formData.get("reference"),
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
    description: parsed.data.description || "Bank transfer payment",
    date: parsed.data.date,
    status: "success",
    provider: "manual_bank_transfer",
    bank_transfer_reference: parsed.data.reference,
  });

  if (error) {
    redirect("/admin/payments?error=1");
  }

  revalidatePath("/admin/payments");
  redirect("/admin/payments?added=1");
}
