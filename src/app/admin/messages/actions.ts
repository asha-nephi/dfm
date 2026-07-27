"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendAdminMessage(formData: FormData) {
  const body = String(formData.get("body") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const artisanId = String(formData.get("artisanId") ?? "");
  const redirectPath = clientId
    ? `/admin/messages/client/${clientId}`
    : `/admin/messages/artisan/${artisanId}`;

  const supabase = await createClient();
  const { error } = await supabase.rpc("send_message", {
    p_body: body,
    p_client_id: clientId || undefined,
    p_artisan_id: artisanId || undefined,
  });

  if (error) {
    redirect(`${redirectPath}?error=1`);
  }

  revalidatePath(redirectPath);
  redirect(redirectPath);
}
