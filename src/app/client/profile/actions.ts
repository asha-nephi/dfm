"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
});

export async function updateOwnProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    redirect("/client/profile?error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_own_client_profile", {
    p_name: parsed.data.name,
    p_phone: parsed.data.phone || "",
  });

  if (error) {
    redirect("/client/profile?error=1");
  }

  revalidatePath("/client/profile");
  redirect("/client/profile?updated=1");
}
