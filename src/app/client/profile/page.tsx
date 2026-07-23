import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { updateOwnProfile } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export const metadata: Metadata = { title: "My Profile" };

export default async function ClientProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { updated, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">My profile</h1>

      <section className="mt-6 max-w-md rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        {updated && (
          <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Profile updated.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please try again.
          </p>
        )}

        <form action={updateOwnProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-black">Name</label>
            <input
              name="name"
              defaultValue={client?.name ?? ""}
              required
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-black">
              Phone / WhatsApp
            </label>
            <input
              name="phone"
              defaultValue={client?.phone ?? ""}
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-black">Email</label>
            <input
              value={client?.email ?? ""}
              disabled
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-off-white px-3.5 py-2.5 text-sm text-navy-black/50"
            />
            <p className="mt-1 text-xs text-navy-black/50">
              To change your email, contact DFM directly.
            </p>
          </div>
          <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-5 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Save changes
</SubmitButton>
        </form>
      </section>
    </div>
  );
}
