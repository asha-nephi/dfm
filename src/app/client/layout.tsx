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
  const { role, userId, email } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "client") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Client"
      homeHref="/client"
      nav={[
        {
          items: [
            { href: "/client", label: "Overview", icon: "home" },
            { href: "/client/properties", label: "Properties", icon: "pin" },
            { href: "/client/jobs", label: "Jobs", icon: "clipboard" },
            { href: "/client/payments", label: "Payments", icon: "wallet" },
            { href: "/client/messages", label: "Messages", icon: "chat" },
          ],
        },
        {
          label: "Account",
          items: [
            { href: "/client/profile", label: "Profile", icon: "user" },
            { href: "/client/help", label: "Help", icon: "help" },
          ],
        },
      ]}
      userName={email ?? undefined}
      cta={{ href: "/client/book", label: "Book a service" }}
    >
      {children}
    </DashboardShell>
  );
}
