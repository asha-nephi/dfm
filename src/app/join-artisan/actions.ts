"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSpamSubmission } from "@/lib/spam-protection";
import { notifyAdminNewArtisanApplication } from "@/lib/email";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  contact: z.string().trim().min(1, "Email or WhatsApp number is required").max(200),
  trade: z.string().trim().min(1, "Trade is required").max(200),
  service_area: z.string().trim().max(300).optional().or(z.literal("")),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function submitArtisanApplication(formData: FormData) {
  const parsed = applicationSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    trade: formData.get("trade"),
    service_area: formData.get("service_area"),
    experience: formData.get("experience"),
  });

  if (!parsed.success) {
    redirect("/join-artisan?error=1");
  }

  const supabase = await createClient();

  if (await isSpamSubmission(formData, supabase, "artisan_application")) {
    // Pretend it worked — don't tip off whatever's submitting this.
    redirect("/join-artisan?submitted=1");
  }

  const { error } = await supabase.from("artisan_applications").insert({
    name: parsed.data.name,
    contact: parsed.data.contact,
    trade: parsed.data.trade,
    service_area: parsed.data.service_area || null,
    experience: parsed.data.experience || null,
  });

  if (error) {
    redirect("/join-artisan?error=1");
  }

  await notifyAdminNewArtisanApplication({
    name: parsed.data.name,
    trade: parsed.data.trade,
    serviceArea: parsed.data.service_area || "not specified",
  });

  redirect("/join-artisan?submitted=1");
}
