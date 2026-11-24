import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "My Jobs",
  robots: { index: false, follow: false },
};

export default async function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId, email } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "artisan") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Artisan"
      homeHref="/artisan"
      nav={[
        {
          items: [
            { href: "/artisan", label: "My jobs", icon: "clipboard" },
            { href: "/artisan/earnings", label: "Earnings", icon: "wallet" },
            { href: "/artisan/messages", label: "Messages", icon: "chat" },
          ],
        },
        {
          label: "Account",
          items: [
            { href: "/artisan/profile", label: "Profile", icon: "user" },
            { href: "/artisan/help", label: "Help", icon: "help" },
          ],
        },
      ]}
      userName={email ?? undefined}
    >
      {children}
    </DashboardShell>
  );
}
