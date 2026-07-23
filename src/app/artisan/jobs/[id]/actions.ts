"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyClientWorkOrderComplete } from "@/lib/email";

const checklistItemSchema = z.object({
  item: z.string().trim().min(1),
  done: z.boolean(),
});

const statusSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(["accepted", "in_progress", "complete"]),
  turnoverChecklist: z.string().optional().or(z.literal("")),
});

export async function updateJobStatus(formData: FormData) {
  const parsed = statusSchema.safeParse({
    jobId: formData.get("jobId"),
    status: formData.get("status"),
    turnoverChecklist: formData.get("turnoverChecklist"),
  });

  if (!parsed.success) {
    redirect(`/artisan/jobs/${formData.get("jobId")}?error=1`);
  }

  let checklist: { item: string; done: boolean }[] | undefined;
  if (parsed.data.turnoverChecklist) {
    try {
      checklist = z.array(checklistItemSchema).parse(JSON.parse(parsed.data.turnoverChecklist));
    } catch {
      redirect(`/artisan/jobs/${parsed.data.jobId}?error=1`);
    }
  }

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("work_orders")
    .select("status")
    .eq("id", parsed.data.jobId)
    .maybeSingle();

  const { error } = await supabase.rpc("artisan_update_work_order", {
    p_work_order_id: parsed.data.jobId,
    p_status: parsed.data.status,
    p_turnover_checklist: checklist,
  });

  if (error) {
    redirect(`/artisan/jobs/${parsed.data.jobId}?error=1`);
  }

  // Artisans can't read the client's email directly (RLS scopes clients to
  // admin/self) — the admin client is used here purely to fetch what's
  // needed to send this one notification, never surfaced to the artisan.
  if (before && before.status !== "complete" && parsed.data.status === "complete") {
    const admin = createAdminClient();
    const { data: job } = await admin
      .from("work_orders")
      .select("description, properties(address, clients(email))")
      .eq("id", parsed.data.jobId)
      .maybeSingle();

    const clientEmail = job?.properties?.clients?.email;
    if (job && clientEmail) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      await notifyClientWorkOrderComplete({
        clientEmail,
        propertyAddress: job.properties!.address,
        description: job.description,
        siteUrl,
      });
    }
  }

  revalidatePath(`/artisan/jobs/${parsed.data.jobId}`);
  redirect(`/artisan/jobs/${parsed.data.jobId}?updated=1`);
}

export async function uploadJobPhoto(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "");
  const files = formData.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);

  if (!jobId || files.length === 0) {
    redirect(`/artisan/jobs/${jobId}?photo_error=1`);
  }

  const supabase = await createClient();
  let hadError = false;

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${jobId}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("work-order-photos")
      .upload(path, buffer, { contentType: file.type || "image/jpeg" });

    if (uploadError) {
      hadError = true;
      continue;
    }

    const { error: insertError } = await supabase.from("work_order_photos").insert({
      work_order_id: jobId,
      uploaded_by: "artisan",
      photo_url: path,
    });

    if (insertError) hadError = true;
  }

  revalidatePath(`/artisan/jobs/${jobId}`);
  redirect(`/artisan/jobs/${jobId}${hadError ? "?photo_error=1" : ""}`);
}
