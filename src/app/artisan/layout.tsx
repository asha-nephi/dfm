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
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "artisan") redirect("/dashboard");

  return (
    <DashboardShell
      roleLabel="Artisan"
      homeHref="/artisan"
      nav={[
        { href: "/artisan", label: "My jobs" },
        { href: "/artisan/profile", label: "My profile" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
