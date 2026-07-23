"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const artisanSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
});

export async function createArtisan(formData: FormData) {
  const parsed = artisanSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    redirect(`/admin/artisans?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  const { error } = await supabase.from("artisans").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    added_by_admin: admin?.id ?? null,
  });

  if (error) {
    redirect(`/admin/artisans?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/artisans");
  redirect("/admin/artisans?added=1");
}
