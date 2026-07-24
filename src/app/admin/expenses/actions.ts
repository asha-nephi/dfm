"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const expenseSchema = z.object({
  category: z.string().trim().min(1).max(100),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
  date: z.string().min(1),
});

export async function createExpense(formData: FormData) {
  const parsed = expenseSchema.safeParse({
    category: formData.get("category"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    redirect("/admin/expenses?error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    category: parsed.data.category,
    description: parsed.data.description || null,
    amount: parsed.data.amount,
    date: parsed.data.date,
  });

  if (error) {
    redirect("/admin/expenses?error=1");
  }

  revalidatePath("/admin/expenses");
  revalidatePath("/admin/analytics");
  redirect("/admin/expenses?added=1");
}

export async function deleteExpense(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("expenses").delete().eq("id", id);
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/analytics");
  redirect("/admin/expenses");
}
