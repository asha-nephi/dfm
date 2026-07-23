"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    redirect("/reset-password?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("That reset link has expired — request a new one."));
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/reset-password?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard?password_updated=1");
}
