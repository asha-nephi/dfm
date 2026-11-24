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
  const { role, userId, email } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "admin") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Admin"
      homeHref="/admin"
      nav={[
        {
          label: "Operations",
          items: [
            { href: "/admin", label: "Overview", icon: "home" },
            { href: "/admin/requests", label: "Service requests", icon: "inbox" },
            { href: "/admin/work-orders", label: "Work orders", icon: "clipboard" },
            { href: "/admin/clients", label: "Clients", icon: "users" },
          ],
        },
        {
          label: "Artisans",
          items: [
            { href: "/admin/artisans", label: "Roster", icon: "briefcase" },
            { href: "/admin/artisan-applications", label: "Applications", icon: "user" },
          ],
        },
        {
          label: "Sales",
          items: [{ href: "/admin/leads", label: "Leads", icon: "tag" }],
        },
        {
          label: "Money",
          items: [
            { href: "/admin/payments", label: "Payments", icon: "wallet" },
            { href: "/admin/payouts", label: "Payouts", icon: "receipt" },
            { href: "/admin/expenses", label: "Expenses", icon: "receipt" },
            { href: "/admin/benchmarks", label: "Price benchmarks", icon: "chart" },
          ],
        },
        {
          label: "Insights & support",
          items: [
            { href: "/admin/analytics", label: "Analytics", icon: "chart" },
            { href: "/admin/messages", label: "Messages", icon: "chat" },
            { href: "/admin/help", label: "Help", icon: "help" },
          ],
        },
      ]}
      userName={email ?? undefined}
    >
      {children}
    </DashboardShell>
  );
}
