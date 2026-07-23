import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { BankDetailsForm } from "@/components/bank-details-form";
import { listNigerianBanks } from "@/lib/paystack";
import { updateOwnArtisanProfile } from "./actions";
import { saveArtisanBankDetails } from "./bank-actions";

export const metadata: Metadata = { title: "My Profile" };

export default async function ArtisanProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string; bank_updated?: string; bank_error?: string }>;
}) {
  const { updated, error, bank_updated, bank_error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artisan } = await supabase
    .from("artisans")
    .select("*")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  const { data: completedJobs } = await supabase
    .from("work_orders")
    .select("artisan_rating")
    .eq("assigned_artisan_id", artisan?.id ?? "")
    .eq("status", "complete");

  const jobCount = completedJobs?.length ?? 0;
  const ratings = (completedJobs ?? [])
    .map((j) => j.artisan_rating)
    .filter((r): r is number => r !== null);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const banks = await listNigerianBanks().catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">My profile</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5">
          <p className="text-2xl font-semibold text-navy-black">{jobCount}</p>
          <p className="mt-1 text-sm text-navy-black/60">Jobs completed</p>
        </div>
        <div className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5">
          <p className="text-2xl font-semibold text-navy-black">
            {avgRating ? (
              <>
                <span className="text-amber">&#9733;</span> {avgRating.toFixed(1)}
              </>
            ) : (
              "—"
            )}
          </p>
          <p className="mt-1 text-sm text-navy-black/60">Average rating</p>
        </div>
      </div>

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

        <form action={updateOwnArtisanProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-black">Name</label>
            <input
              name="name"
              defaultValue={artisan?.name ?? ""}
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
              defaultValue={artisan?.phone ?? ""}
              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-black">Email</label>
            <input
              value={artisan?.email ?? ""}
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

      <section className="mt-6 max-w-md rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Payout account</h2>
        <p className="mt-1 text-sm text-navy-black/60">
          Where DFM sends your payment for completed jobs.
        </p>
        {bank_updated && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Payout account saved.
          </p>
        )}
        {bank_error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Couldn&apos;t verify that account — double check the bank and account number and try
            again.
          </p>
        )}
        <div className="mt-4">
          <BankDetailsForm
            action={saveArtisanBankDetails}
            banks={banks}
            currentBankName={artisan?.bank_name ?? null}
            currentAccountNumber={artisan?.account_number ?? null}
            currentAccountName={artisan?.account_name ?? null}
            onFileLabel="Payouts go to"
            emptyLabel="No payout account on file yet."
          />
        </div>
      </section>
    </div>
  );
}
