"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSpamSubmission, containsSuspiciousLink } from "@/lib/spam-protection";
import { notifyAdminNewCohostRequest } from "@/lib/email";

const requestSchema = z.object({
  host_name: z.string().trim().min(1).max(200),
  host_contact: z.string().trim().min(1).max(200),
  property_description: z.string().trim().min(1).max(2000),
  agree_terms: z.literal("on"),
});

export async function submitCohostRequest(formData: FormData) {
  const parsed = requestSchema.safeParse({
    host_name: formData.get("host_name"),
    host_contact: formData.get("host_contact"),
    property_description: formData.get("property_description"),
    agree_terms: formData.get("agree_terms"),
  });

  if (!parsed.success) {
    redirect("/?cohost_error=1#cohost");
  }

  const supabase = await createClient();

  if (
    (await isSpamSubmission(formData, supabase, "cohost_request")) ||
    containsSuspiciousLink(parsed.data.property_description, parsed.data.host_name)
  ) {
    // No real request/token exists to pretend-succeed with — just bounce
    // back quietly rather than exposing a rejection reason.
    redirect("/#cohost");
  }

  const { data, error } = await supabase.rpc("submit_cohost_request", {
    p_host_name: parsed.data.host_name,
    p_host_contact: parsed.data.host_contact,
    p_property_description: parsed.data.property_description,
  });

  const row = data?.[0];
  if (error || !row) {
    redirect("/?cohost_error=1#cohost");
  }

  await notifyAdminNewCohostRequest({
    hostName: parsed.data.host_name,
    propertyDescription: parsed.data.property_description,
  });

  redirect(`/cohost/host/${row.host_token}?submitted=1`);
}
