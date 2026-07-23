import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "client" | "artisan" | null;

export async function getCurrentRole(): Promise<{
  role: Role;
  userId: string | null;
  email: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { role: null, userId: null, email: null };

  const [{ data: isAdmin }, { data: clientId }, { data: artisanId }] =
    await Promise.all([
      supabase.rpc("is_admin"),
      supabase.rpc("current_client_id"),
      supabase.rpc("current_artisan_id"),
    ]);

  const role: Role = isAdmin
    ? "admin"
    : clientId
      ? "client"
      : artisanId
        ? "artisan"
        : null;

  return { role, userId: user.id, email: user.email ?? null };
}
