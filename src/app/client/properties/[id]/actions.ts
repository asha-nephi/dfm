"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  propertyId: z.string().uuid(),
  description: z.string().trim().min(1, "Please describe the issue").max(2000),
});

export async function submitMaintenanceRequest(formData: FormData) {
  const parsed = requestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(
      `/client/properties/${formData.get("propertyId")}?request_error=1`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("work_orders").insert({
    property_id: parsed.data.propertyId,
    description: parsed.data.description,
    created_by: "client",
    status: "requested",
    flagged_for_review: false,
    cost_amount: 0,
    assigned_artisan_id: null,
  });

  if (error) {
    redirect(`/client/properties/${parsed.data.propertyId}?request_error=1`);
  }

  revalidatePath(`/client/properties/${parsed.data.propertyId}`);
  redirect(`/client/properties/${parsed.data.propertyId}?request_sent=1`);
}
