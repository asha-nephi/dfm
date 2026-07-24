"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyHostCohostApproved } from "@/lib/email";
import { looksLikeEmail } from "@/lib/format";

export async function approveCohostRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: request, error } = await supabase
    .from("cohost_requests")
    .update({ status: "open" })
    .eq("id", id)
    .select("host_name, host_contact, host_token")
    .maybeSingle();

  if (error || !request) {
    redirect(`/admin/cohost/${id}?error=1`);
  }

  if (looksLikeEmail(request.host_contact)) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await notifyHostCohostApproved({
      hostEmail: request.host_contact,
      hostName: request.host_name,
      hostLink: `${siteUrl}/cohost/host/${request.host_token}`,
    });
  }

  revalidatePath(`/admin/cohost/${id}`);
  revalidatePath("/admin/cohost");
  redirect(`/admin/cohost/${id}`);
}

export async function closeCohostRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.from("cohost_requests").update({ status: "closed" }).eq("id", id);

  if (error) {
    redirect(`/admin/cohost/${id}?error=1`);
  }

  revalidatePath(`/admin/cohost/${id}`);
  revalidatePath("/admin/cohost");
  redirect(`/admin/cohost/${id}`);
}

export async function reopenCohostRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.from("cohost_requests").update({ status: "open" }).eq("id", id);

  if (error) {
    redirect(`/admin/cohost/${id}?error=1`);
  }

  revalidatePath(`/admin/cohost/${id}`);
  revalidatePath("/admin/cohost");
  redirect(`/admin/cohost/${id}`);
}
