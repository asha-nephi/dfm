"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const benchmarkSchema = z.object({
  label: z.string().trim().min(1).max(200),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  typicalAmount: z.coerce.number().positive(),
});

export async function createBenchmark(formData: FormData) {
  const parsed = benchmarkSchema.safeParse({
    label: formData.get("label"),
    category: formData.get("category"),
    typicalAmount: formData.get("typicalAmount"),
  });

  if (!parsed.success) {
    redirect("/admin/benchmarks?error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("cost_benchmarks").insert({
    label: parsed.data.label,
    category: parsed.data.category || null,
    typical_amount: parsed.data.typicalAmount,
  });

  if (error) {
    redirect("/admin/benchmarks?error=1");
  }

  revalidatePath("/admin/benchmarks");
  redirect("/admin/benchmarks?added=1");
}

export async function deleteBenchmark(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("cost_benchmarks").delete().eq("id", id);
  revalidatePath("/admin/benchmarks");
  redirect("/admin/benchmarks");
}
