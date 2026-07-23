"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(["accepted", "in_progress", "complete"]),
});

export async function updateJobStatus(formData: FormData) {
  const parsed = statusSchema.safeParse({
    jobId: formData.get("jobId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(`/artisan/jobs/${formData.get("jobId")}?error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("artisan_update_work_order", {
    p_work_order_id: parsed.data.jobId,
    p_status: parsed.data.status,
  });

  if (error) {
    redirect(`/artisan/jobs/${parsed.data.jobId}?error=1`);
  }

  revalidatePath(`/artisan/jobs/${parsed.data.jobId}`);
  redirect(`/artisan/jobs/${parsed.data.jobId}?updated=1`);
}

export async function uploadJobPhoto(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "");
  const file = formData.get("file") as File | null;

  if (!jobId || !file || file.size === 0) {
    redirect(`/artisan/jobs/${jobId}?photo_error=1`);
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${jobId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("work-order-photos")
    .upload(path, buffer, { contentType: file.type || "image/jpeg" });

  if (uploadError) {
    redirect(`/artisan/jobs/${jobId}?photo_error=1`);
  }

  const { error: insertError } = await supabase.from("work_order_photos").insert({
    work_order_id: jobId,
    uploaded_by: "artisan",
    photo_url: path,
  });

  if (insertError) {
    redirect(`/artisan/jobs/${jobId}?photo_error=1`);
  }

  revalidatePath(`/artisan/jobs/${jobId}`);
  redirect(`/artisan/jobs/${jobId}`);
}
