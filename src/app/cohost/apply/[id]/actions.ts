"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSpamSubmission } from "@/lib/spam-protection";
import { notifyHostNewCohostApplication } from "@/lib/email";
import { looksLikeEmail } from "@/lib/format";

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

  // The applicant-facing client has no read access to host_contact (admin-
  // only RLS on cohost_requests) — the admin client is used here purely to
  // fetch what's needed for this one notification, never surfaced to the
  // applicant, same pattern as the artisan job-assignment notification.
  const admin = createAdminClient();
  const { data: request } = await admin
    .from("cohost_requests")
    .select("host_name, host_contact, host_token")
    .eq("id", parsed.data.requestId)
    .maybeSingle();

  if (request && looksLikeEmail(request.host_contact)) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await notifyHostNewCohostApplication({
      hostEmail: request.host_contact,
      hostName: request.host_name,
      applicantName: parsed.data.applicant_name,
      hostLink: `${siteUrl}/cohost/host/${request.host_token}`,
    });
  }

  redirect(`/cohost/apply/${parsed.data.requestId}?applied=1`);
}
