"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const convertSchema = z.object({
  leadId: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
});

export async function convertLeadToClient(formData: FormData) {
  const parsed = convertSchema.safeParse({
    leadId: formData.get("leadId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    redirect(
      `/admin/leads?error=${encodeURIComponent(parsed.error.issues[0].message)}`,
    );
  }

  const supabase = await createClient();

  const { data: newClient, error } = await supabase
    .from("clients")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
    })
    .select("id")
    .single();

  if (error || !newClient) {
    redirect(`/admin/leads?error=${encodeURIComponent(error?.message ?? "Could not create client")}`);
  }

  await supabase
    .from("contact_leads")
    .update({ status: "converted" })
    .eq("id", parsed.data.leadId);

  revalidatePath("/admin/leads");
  redirect(`/admin/clients/${newClient.id}?added=1`);
}

export async function archiveLead(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const supabase = await createClient();
  await supabase.from("contact_leads").update({ status: "archived" }).eq("id", leadId);
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
