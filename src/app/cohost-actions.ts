"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  host_name: z.string().trim().min(1).max(200),
  host_contact: z.string().trim().min(1).max(200),
  property_description: z.string().trim().min(1).max(2000),
});

export async function submitCohostRequest(formData: FormData) {
  const parsed = requestSchema.safeParse({
    host_name: formData.get("host_name"),
    host_contact: formData.get("host_contact"),
    property_description: formData.get("property_description"),
  });

  if (!parsed.success) {
    redirect("/?cohost_error=1#cohost");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_cohost_request", {
    p_host_name: parsed.data.host_name,
    p_host_contact: parsed.data.host_contact,
    p_property_description: parsed.data.property_description,
  });

  const row = data?.[0];
  if (error || !row) {
    redirect("/?cohost_error=1#cohost");
  }

  redirect(`/cohost/host/${row.host_token}?submitted=1`);
}
