import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "My Properties",
  robots: { index: false, follow: false },
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "client") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Client"
      homeHref="/client"
      nav={[
        { href: "/client", label: "My properties" },
        { href: "/client/payments", label: "Payments" },
        { href: "/client/profile", label: "My profile" },
        { href: "/client/help", label: "Help" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
