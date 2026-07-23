const PROBLEMS = [
  {
    title: "You can't verify the work",
    body: "A caretaker says the job is done. There's no photo, no receipt, and no way to check from abroad.",
  },
  {
    title: "Costs get inflated",
    body: "Repair quotes with no breakdown and no benchmark — no way to tell what's a fair price and what's padded.",
  },
  {
    title: "You're out of the loop",
    body: "No updates until something's already gone wrong, and no record of what's been done over time.",
  },
];

const SOLUTIONS = [
  {
    title: "Dated photos of every job",
    body: "Before-and-after photos, timestamped and tied to the specific work order — not just a text message saying \"done.\"",
  },
  {
    title: "Itemized, benchmarked costs",
    body: "Every repair broken down into labor and materials, so you see exactly what you're paying for and why.",
  },
  {
    title: "One flat management fee",
    body: "A flat monthly fee, not a cut of repair costs — so there's no incentive to make a job cost more than it should.",
  },
];

export function ProblemSolution() {
  return (
    <>
      <section id="problem" className="bg-off-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
            The problem with managing property from a distance
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PROBLEMS.map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-navy-black">{item.title}</h3>
                <p className="mt-2 text-sm text-navy-black/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
            How DFM makes it verifiable
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {SOLUTIONS.map((item, i) => (
              <div key={item.title} className="rounded-lg border border-charcoal/10 p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-amber">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-navy-black">{item.title}</h3>
                <p className="mt-2 text-sm text-navy-black/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
