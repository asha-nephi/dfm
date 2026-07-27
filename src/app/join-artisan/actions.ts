"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSpamSubmission } from "@/lib/spam-protection";
import { notifyAdminNewArtisanApplication, notifyArtisanApplicationReceived } from "@/lib/email";
import { looksLikeEmail } from "@/lib/format";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  contact: z.string().trim().min(1, "Email or WhatsApp number is required").max(200),
  trade: z.string().trim().min(1, "Trade is required").max(200),
  trade_other: z.string().trim().max(200).optional().or(z.literal("")),
  service_area: z.string().trim().max(300).optional().or(z.literal("")),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  reference_name: z.string().trim().min(1, "Reference name is required").max(200),
  reference_contact: z.string().trim().min(1, "Reference contact is required").max(200),
});

export async function submitArtisanApplication(formData: FormData) {
  const parsed = applicationSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    trade: formData.get("trade"),
    trade_other: formData.get("trade_other") ?? "",
    service_area: formData.get("service_area"),
    experience: formData.get("experience"),
    reference_name: formData.get("reference_name"),
    reference_contact: formData.get("reference_contact"),
  });

  if (!parsed.success) {
    redirect("/join-artisan?error=1");
  }

  const idDocument = formData.get("id_document");
  if (!(idDocument instanceof File) || idDocument.size === 0) {
    redirect("/join-artisan?error=1");
  }

  const supabase = await createClient();

  if (await isSpamSubmission(formData, supabase, "artisan_application")) {
    // Pretend it worked — don't tip off whatever's submitting this.
    redirect("/join-artisan?submitted=1");
  }

  // "Other" replaces the select value with whatever the applicant typed,
  // so the stored trade is always the real one, never the literal word
  // "Other".
  const trade = parsed.data.trade === "Other" ? parsed.data.trade_other || "Other" : parsed.data.trade;

  const ext = idDocument.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await idDocument.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("artisan-application-documents")
    .upload(path, buffer, { contentType: idDocument.type || "image/jpeg" });

  if (uploadError) {
    console.error("artisan application ID upload failed", uploadError);
    redirect("/join-artisan?error=1");
  }

  const { error } = await supabase.from("artisan_applications").insert({
    name: parsed.data.name,
    contact: parsed.data.contact,
    trade,
    service_area: parsed.data.service_area || null,
    experience: parsed.data.experience || null,
    reference_name: parsed.data.reference_name,
    reference_contact: parsed.data.reference_contact,
    id_document_url: path,
  });

  if (error) {
    // Clean up the just-uploaded document rather than leaving an orphaned
    // file behind — this path (insert failing after upload succeeded) is
    // the only place that can happen.
    await supabase.storage.from("artisan-application-documents").remove([path]);

    if (error.code === "23505") {
      redirect("/join-artisan?duplicate=1");
    }
    redirect("/join-artisan?error=1");
  }

  await notifyAdminNewArtisanApplication({
    name: parsed.data.name,
    trade,
    serviceArea: parsed.data.service_area || "not specified",
  });

  // Contact may be a WhatsApp number rather than an email (same convention
  // as leads) — only send the confirmation when we actually have somewhere
  // to send it.
  if (looksLikeEmail(parsed.data.contact)) {
    await notifyArtisanApplicationReceived({
      applicantEmail: parsed.data.contact,
      applicantName: parsed.data.name,
    });
  }

  redirect("/join-artisan?submitted=1");
}
