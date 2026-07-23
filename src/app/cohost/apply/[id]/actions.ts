"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSpamSubmission } from "@/lib/spam-protection";

const applySchema = z.object({
  requestId: z.string().uuid(),
  applicant_name: z.string().trim().min(1).max(200),
  applicant_contact: z.string().trim().min(1).max(200),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  agree_terms: z.literal("on"),
});

export async function submitApplication(formData: FormData) {
  const parsed = applySchema.safeParse({
    requestId: formData.get("requestId"),
    applicant_name: formData.get("applicant_name"),
    applicant_contact: formData.get("applicant_contact"),
    message: formData.get("message"),
    agree_terms: formData.get("agree_terms"),
  });

  if (!parsed.success) {
    redirect(`/cohost/apply/${formData.get("requestId")}?error=1`);
  }

  const supabase = await createClient();

  if (await isSpamSubmission(formData, supabase, "cohost_application")) {
    redirect(`/cohost/apply/${parsed.data.requestId}?applied=1`);
  }

  const { error } = await supabase.rpc("submit_cohost_application", {
    p_request_id: parsed.data.requestId,
    p_applicant_name: parsed.data.applicant_name,
    p_applicant_contact: parsed.data.applicant_contact,
    p_message: parsed.data.message || "",
  });

  if (error) {
    redirect(`/cohost/apply/${parsed.data.requestId}?error=1`);
  }

  redirect(`/cohost/apply/${parsed.data.requestId}?applied=1`);
}
