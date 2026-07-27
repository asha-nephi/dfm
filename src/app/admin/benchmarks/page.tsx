import { createClient } from "@/lib/supabase/server";
import { createBenchmark, updateBenchmark, deleteBenchmark } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

export default async function AdminBenchmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; updated?: string; error?: string }>;
}) {
  const { added, updated, error } = await searchParams;
  const supabase = await createClient();
  const { data: benchmarks } = await supabase
    .from("cost_benchmarks")
    .select("*")
    .order("category", { ascending: true, nullsFirst: false })
    .order("label", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Cost benchmarks</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Typical prices for common jobs — shows up as quick-add suggestions
        when itemizing costs on a work order, so entries stay consistent and
        easy to benchmark against. Edit any figure below once you have real
        numbers — nothing here is fixed.
      </p>

      {added && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Benchmark added.
        </p>
      )}
      {updated && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Benchmark updated.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please check the form and try again.
        </p>
      )}

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Add a benchmark</h2>
        <form action={createBenchmark} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto]">
          <input
            name="label"
            placeholder="e.g. Toilet seat replacement"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            name="category"
            placeholder="Category (optional, e.g. Plumbing)"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            type="number"
            name="typicalAmount"
            placeholder="Typical (₦)"
            min={1}
            step="1"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <SubmitButton className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Add
</SubmitButton>
        </form>
      </section>

      <section className="mt-8">
        {!benchmarks || benchmarks.length === 0 ? (
          <p className="text-sm text-navy-black/60">
            No benchmarks yet — add common jobs above to speed up cost entry.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
            {benchmarks.map((b) => (
              <li key={b.id} className="p-5">
                <form
                  action={updateBenchmark}
                  className="grid gap-2 sm:grid-cols-[1fr_1fr_140px_auto] sm:items-center"
                >
                  <input type="hidden" name="id" value={b.id} />
                  <input
                    name="label"
                    defaultValue={b.label}
                    required
                    className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                  />
                  <input
                    name="category"
                    defaultValue={b.category ?? ""}
                    placeholder="Category"
                    className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                  />
                  <input
                    type="number"
                    name="typicalAmount"
                    defaultValue={b.typical_amount}
                    min={1}
                    step="1"
                    required
                    className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                  />
                  <SubmitButton className="rounded-lg border border-charcoal/20 px-3.5 py-2 text-sm font-medium text-navy-black hover:border-charcoal/40">
  Save
</SubmitButton>
                </form>
                <form action={deleteBenchmark} className="mt-2">
                  <input type="hidden" name="id" value={b.id} />
                  <ConfirmSubmitButton
                    confirmMessage="Remove this benchmark?"
                    className="text-xs text-navy-black/50 hover:text-red-600"
                  >
                    Remove
                  </ConfirmSubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
