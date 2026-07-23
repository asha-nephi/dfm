"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const clientSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
});

export async function createClientRecord(formData: FormData) {
  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    redirect(`/admin/clients?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
  });

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?added=1");
}

const propertySchema = z.object({
  clientId: z.string().uuid(),
  address: z.string().trim().min(1).max(300),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  propertyType: z.enum(["long_term_let", "short_term_rental"]),
});

export async function createProperty(formData: FormData) {
  const parsed = propertySchema.safeParse({
    clientId: formData.get("clientId"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    propertyType: formData.get("propertyType"),
  });

  if (!parsed.success) {
    redirect(`/admin/clients/${formData.get("clientId")}?error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("properties").insert({
    client_id: parsed.data.clientId,
    address: parsed.data.address,
    notes: parsed.data.notes || null,
    property_type: parsed.data.propertyType,
  });

  if (error) {
    redirect(`/admin/clients/${parsed.data.clientId}?error=1`);
  }

  revalidatePath(`/admin/clients/${parsed.data.clientId}`);
  redirect(`/admin/clients/${parsed.data.clientId}?property_added=1`);
}
