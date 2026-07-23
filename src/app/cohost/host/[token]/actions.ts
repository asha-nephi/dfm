"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const selectSchema = z.object({
  hostToken: z.string().uuid(),
  applicationId: z.string().uuid(),
  termsNote: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function selectApplicant(formData: FormData) {
  const parsed = selectSchema.safeParse({
    hostToken: formData.get("hostToken"),
    applicationId: formData.get("applicationId"),
    termsNote: formData.get("termsNote"),
  });

  if (!parsed.success) {
    redirect(`/cohost/host/${formData.get("hostToken")}?error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("select_cohost_applicant", {
    p_host_token: parsed.data.hostToken,
    p_application_id: parsed.data.applicationId,
    p_terms_note: parsed.data.termsNote || "",
  });

  if (error) {
    redirect(`/cohost/host/${parsed.data.hostToken}?error=1`);
  }

  revalidatePath(`/cohost/host/${parsed.data.hostToken}`);
  redirect(`/cohost/host/${parsed.data.hostToken}?matched=1`);
}
