"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendClientMessage(formData: FormData) {
  const body = String(formData.get("body") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.rpc("send_message", { p_body: body });

  if (error) {
    redirect("/client/messages?error=1");
  }

  revalidatePath("/client/messages");
  redirect("/client/messages");
}
