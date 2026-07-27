import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "admin") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Admin"
      homeHref="/admin"
      nav={[
        { href: "/admin", label: "Overview" },
        { href: "/admin/clients", label: "Clients" },
        { href: "/admin/work-orders", label: "Work orders" },
        { href: "/admin/artisans", label: "Artisans" },
        { href: "/admin/artisan-applications", label: "Artisan applications" },
        { href: "/admin/leads", label: "Leads" },
        { href: "/admin/payments", label: "Payments" },
        { href: "/admin/payouts", label: "Payouts" },
        { href: "/admin/expenses", label: "Expenses" },
        { href: "/admin/benchmarks", label: "Benchmarks" },
        { href: "/admin/analytics", label: "Analytics" },
        { href: "/admin/cohost", label: "Co-host (beta)" },
        { href: "/admin/messages", label: "Messages" },
        { href: "/admin/help", label: "Help" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
