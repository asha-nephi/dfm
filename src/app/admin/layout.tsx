import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { AppHeader } from "@/components/app-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-off-white">
      <AppHeader
        roleLabel="Admin"
        homeHref="/admin"
        nav={[
          { href: "/admin", label: "Overview" },
          { href: "/admin/clients", label: "Clients" },
          { href: "/admin/work-orders", label: "Work orders" },
          { href: "/admin/artisans", label: "Artisans" },
          { href: "/admin/payments", label: "Payments" },
          { href: "/admin/cohost", label: "Co-host (beta)" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
