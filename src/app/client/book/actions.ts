"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRequest, parseServiceRequest } from "@/lib/service-requests";

export async function bookService(formData: FormData) {
  const parsed = parseServiceRequest(formData);
  if (!parsed.success) redirect("/client/book?error=1");

  const supabase = await createClient();
  const ok = await createServiceRequest(supabase, parsed.data);
  if (!ok) redirect("/client/book?error=1");

  revalidatePath("/client");
  revalidatePath("/client/jobs");
  redirect("/client/jobs?booked=1");
}
