import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNaira } from "@/lib/format";
import { createExpense, deleteExpense } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

const CATEGORIES = [
  "Salaries & wages",
  "Transport",
  "Software & tools",
  "Marketing",
  "Bank & payment fees",
  "Office & supplies",
  "Other",
];

export default async function AdminExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const { added, error } = await searchParams;
  const supabase = await createClient();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  const total = (expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Expenses</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Operating costs — salaries, transport, tools, and anything else that leaves the business
        outside of artisan payouts. Feeds into net profit on the analytics page.
      </p>

      <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
        <h2 className="font-semibold text-navy-black">Log an expense</h2>
        {added && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Expense logged.
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong — please check the form and try again.
          </p>
        )}
        <form action={createExpense} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <input
              name="category"
              list="expense-categories"
              placeholder="Category"
              required
              className="w-full rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <datalist id="expense-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <input
            type="date"
            name="date"
            defaultValue={today}
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            name="description"
            placeholder="Note (optional)"
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount (₦)"
            min={1}
            step="1"
            required
            className="rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          <SubmitButton className="w-fit rounded-lg bg-charcoal shadow-sm px-5 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90 sm:col-span-2">
            Log expense
          </SubmitButton>
        </form>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-navy-black">All expenses</h2>
          <span className="text-sm text-navy-black/60">Total: {formatNaira(total)}</span>
        </div>
        {!expenses || expenses.length === 0 ? (
          <p className="text-sm text-navy-black/60">No expenses logged yet.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-navy-black">{e.category}</p>
                  <p className="text-xs text-navy-black/50">
                    {formatDate(e.date)}
                    {e.description ? ` · ${e.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy-black/70">{formatNaira(Number(e.amount))}</span>
                  <form action={deleteExpense}>
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmSubmitButton
                      confirmMessage="Remove this expense?"
                      className="text-xs text-navy-black/50 hover:text-red-600"
                    >
                      Remove
                    </ConfirmSubmitButton>
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
