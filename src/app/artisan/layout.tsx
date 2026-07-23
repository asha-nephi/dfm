import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { AppHeader } from "@/components/app-header";

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
    <div className="min-h-screen bg-off-white">
      <AppHeader roleLabel="Artisan" homeHref="/artisan" />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
