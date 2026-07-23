import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/format";
import { createBenchmark, deleteBenchmark } from "./actions";

export default async function AdminBenchmarksPage() {
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
        easy to benchmark against.
      </p>

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
          <button
            type="submit"
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black active:bg-navy-black/90"
          >
            Add
          </button>
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
              <li
                key={b.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-navy-black">{b.label}</p>
                  {b.category && <p className="text-xs text-navy-black/50">{b.category}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy-black/70">{formatNaira(b.typical_amount)}</span>
                  <form action={deleteBenchmark}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="text-xs text-navy-black/50 hover:text-red-600">
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
