"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyArtisanInvited, notifyArtisanApplicationDeclined } from "@/lib/email";
import { looksLikeEmail } from "@/lib/format";

// Approving pulls the applicant straight onto the vetted roster — same
// invite email path as adding an artisan by hand from /admin/artisans, so
// there's exactly one way an artisan ever gets an account, not two
// diverging code paths to keep in sync.
export async function approveArtisanApplication(formData: FormData) {
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationId) {
    redirect("/admin/artisan-applications?error=1");
  }

  const supabase = await createClient();

  const { data: application } = await supabase
    .from("artisan_applications")
    .select("*")
    .eq("id", applicationId)
    .eq("status", "new")
    .maybeSingle();

  if (!application) {
    redirect("/admin/artisan-applications?error=1");
  }

  if (
    !application.vetting_id_verified ||
    !application.vetting_call_completed ||
    !application.vetting_reference_checked
  ) {
    redirect(
      `/admin/artisan-applications?error=${encodeURIComponent("Complete the vetting checklist before approving.")}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  // The application's "contact" field may be an email or a WhatsApp
  // number, same convention as leads — but an artisan account needs a
  // real email to log in with, so require one at approval time rather
  // than guessing.
  if (!looksLikeEmail(application.contact)) {
    redirect(
      `/admin/artisan-applications?error=${encodeURIComponent("Applicant's contact isn't an email address — add them manually from Artisans with their email instead.")}`,
    );
  }

  const { error: insertError } = await supabase.from("artisans").insert({
    name: application.name,
    email: application.contact,
    trade: application.trade,
    service_area: application.service_area,
    added_by_admin: admin?.id ?? null,
  });

  if (insertError) {
    redirect(`/admin/artisan-applications?error=${encodeURIComponent(insertError.message)}`);
  }

  await supabase
    .from("artisan_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  await notifyArtisanInvited({
    artisanEmail: application.contact,
    artisanName: application.name,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  });

  revalidatePath("/admin/artisan-applications");
  revalidatePath("/admin/artisans");
  redirect("/admin/artisan-applications?approved=1");
}

export async function updateVettingChecklist(formData: FormData) {
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationId) {
    redirect("/admin/artisan-applications?error=1");
  }

  const supabase = await createClient();

  await supabase
    .from("artisan_applications")
    .update({
      vetting_id_verified: formData.get("vetting_id_verified") === "on",
      vetting_call_completed: formData.get("vetting_call_completed") === "on",
      vetting_reference_checked: formData.get("vetting_reference_checked") === "on",
    })
    .eq("id", applicationId);

  revalidatePath("/admin/artisan-applications");
  redirect("/admin/artisan-applications");
}

export async function declineArtisanApplication(formData: FormData) {
  const applicationId = String(formData.get("applicationId") ?? "");
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("artisan_applications")
    .select("name, contact")
    .eq("id", applicationId)
    .maybeSingle();

  await supabase
    .from("artisan_applications")
    .update({ status: "declined" })
    .eq("id", applicationId);

  if (application && looksLikeEmail(application.contact)) {
    await notifyArtisanApplicationDeclined({
      applicantEmail: application.contact,
      applicantName: application.name,
    });
  }

  revalidatePath("/admin/artisan-applications");
  redirect("/admin/artisan-applications");
}
