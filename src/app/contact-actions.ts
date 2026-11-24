"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSpamSubmission, containsSuspiciousLink } from "@/lib/spam-protection";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  contact: z.string().trim().min(1, "Email or WhatsApp number is required").max(200),
  property_location: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  service_interest: z.string().trim().max(40).optional().or(z.literal("")),
});

export async function submitLead(formData: FormData) {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    property_location: formData.get("property_location"),
    message: formData.get("message"),
    service_interest: formData.get("service_interest") ?? "",
  });

  if (!parsed.success) {
    redirect("/?contact_error=1#contact");
  }

  const supabase = await createClient();

  if (
    (await isSpamSubmission(formData, supabase, "contact_lead")) ||
    containsSuspiciousLink(parsed.data.message, parsed.data.name)
  ) {
    // Pretend it worked — don't tip off whatever's submitting this.
    redirect("/?contact_sent=1#contact");
  }

  const lead = {
    name: parsed.data.name,
    contact: parsed.data.contact,
    property_location: parsed.data.property_location || null,
    message: parsed.data.message || null,
  };
  const service = parsed.data.service_interest || null;
  let { error } = await supabase
    .from("contact_leads")
    .insert({ ...lead, service_interest: service });
  // Fallback if the service_interest column isn't migrated yet.
  if (error) {
    ({ error } = await supabase.from("contact_leads").insert({
      ...lead,
      message: service ? `[${service}] ${lead.message ?? ""}`.trim() : lead.message,
    }));
  }

  if (error) {
    redirect("/?contact_error=1#contact");
  }

  redirect("/?contact_sent=1#contact");
}
