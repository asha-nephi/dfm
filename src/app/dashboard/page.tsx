import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";

export default async function DashboardRedirect() {
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role === "admin") redirect("/admin");
  if (role === "client") redirect("/client");
  if (role === "artisan") redirect("/artisan");

  redirect("/login?error=" + encodeURIComponent(
    "This account isn't linked to a DFM client, artisan, or admin profile yet.",
  ));
}
