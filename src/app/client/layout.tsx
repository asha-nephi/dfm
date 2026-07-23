import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import { AppHeader } from "@/components/app-header";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, userId } = await getCurrentRole();

  if (!userId) redirect("/login");
  if (role !== "client") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-off-white">
      <AppHeader
        roleLabel="Client"
        homeHref="/client"
        nav={[
          { href: "/client", label: "My properties" },
          { href: "/client/payments", label: "Payments" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
