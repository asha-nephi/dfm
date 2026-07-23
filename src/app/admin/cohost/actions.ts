"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function approveCohostRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("cohost_requests").update({ status: "open" }).eq("id", id);
  revalidatePath(`/admin/cohost/${id}`);
  revalidatePath("/admin/cohost");
  redirect(`/admin/cohost/${id}`);
}

export async function closeCohostRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("cohost_requests").update({ status: "closed" }).eq("id", id);
  revalidatePath(`/admin/cohost/${id}`);
  revalidatePath("/admin/cohost");
  redirect(`/admin/cohost/${id}`);
}
