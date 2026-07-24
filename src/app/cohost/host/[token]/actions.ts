"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyApplicantCohostSelected, notifyApplicantCohostNotSelected } from "@/lib/email";
import { looksLikeEmail } from "@/lib/format";

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

  // The host-facing client has no read access to applicant contact details
  // beyond what the get_cohost_applications_by_host_token RPC already
  // exposed on the page — but that RPC doesn't include host_name, and this
  // action needs to email every applicant on the request, not just the
  // caller. The admin client fetches exactly that, never surfaced to the host.
  const admin = createAdminClient();
  const { data: request } = await admin
    .from("cohost_requests")
    .select("id, host_name")
    .eq("host_token", parsed.data.hostToken)
    .maybeSingle();

  if (request) {
    const { data: applications } = await admin
      .from("cohost_applications")
      .select("applicant_name, applicant_contact, status")
      .eq("cohost_request_id", request.id);

    for (const app of applications ?? []) {
      if (!looksLikeEmail(app.applicant_contact)) continue;
      if (app.status === "selected") {
        await notifyApplicantCohostSelected({
          applicantEmail: app.applicant_contact,
          applicantName: app.applicant_name,
          hostName: request.host_name,
        });
      } else if (app.status === "not_selected") {
        await notifyApplicantCohostNotSelected({
          applicantEmail: app.applicant_contact,
          applicantName: app.applicant_name,
        });
      }
    }
  }

  revalidatePath(`/cohost/host/${parsed.data.hostToken}`);
  redirect(`/cohost/host/${parsed.data.hostToken}?matched=1`);
}
