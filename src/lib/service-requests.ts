import { z } from "zod";
import type { createClient } from "@/lib/supabase/server";
import { SERVICE_SLUGS, serviceLabel } from "@/lib/services";
import { notifyAdminNewMaintenanceRequest } from "@/lib/email";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export const serviceRequestSchema = z.object({
  propertyId: z.string().uuid(),
  serviceType: z.enum(SERVICE_SLUGS).optional().or(z.literal("")),
  description: z.string().trim().min(1, "Please describe what you need").max(2000),
  preferredTiming: z.string().trim().max(200).optional().or(z.literal("")),
});

export function parseServiceRequest(formData: FormData) {
  return serviceRequestSchema.safeParse({
    propertyId: formData.get("propertyId"),
    serviceType: formData.get("serviceType") ?? "",
    description: formData.get("description"),
    preferredTiming: formData.get("preferredTiming") ?? "",
  });
}

// Creates a client-requested work order and emails admin. Returns true on success.
export async function createServiceRequest(
  supabase: Supabase,
  data: z.infer<typeof serviceRequestSchema>,
): Promise<boolean> {
  const base = {
    property_id: data.propertyId,
    description: data.description,
    created_by: "client",
    status: "requested",
    flagged_for_review: false,
    cost_amount: 0,
    assigned_artisan_id: null,
  };
  const service = data.serviceType || null;
  const timing = data.preferredTiming || null;

  let { error } = await supabase
    .from("work_orders")
    .insert({ ...base, service_type: service, preferred_timing: timing });

  // Fallback if the service columns aren't migrated yet: keep the info in the description.
  if (error) {
    const prefix = service ? `[${serviceLabel(service)}] ` : "";
    const suffix = timing ? `\nPreferred timing: ${timing}` : "";
    ({ error } = await supabase
      .from("work_orders")
      .insert({ ...base, description: `${prefix}${data.description}${suffix}` }));
  }
  if (error) return false;

  const { data: property } = await supabase
    .from("properties")
    .select("address, clients(name)")
    .eq("id", data.propertyId)
    .maybeSingle();

  if (property) {
    await notifyAdminNewMaintenanceRequest({
      clientName: property.clients?.name ?? "A client",
      propertyAddress: property.address,
      description: `${service ? `${serviceLabel(service)}: ` : ""}${data.description}${
        timing ? ` (preferred timing: ${timing})` : ""
      }`,
    });
  }
  return true;
}
