const LINE_ITEMS = [
  {
    title: "Flat monthly management fee",
    body: "One predictable amount per property, regardless of how much maintenance activity happens that month.",
  },
  {
    title: "Repairs at verified actual cost",
    body: "Pass-through pricing on any repair or maintenance work — what the job actually costs, itemized, never marked up.",
  },
  {
    title: "Small, disclosed coordination fee",
    body: "A capped fee on repair jobs for sourcing and overseeing the work, always shown separately, never hidden in the repair cost.",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
          How pricing works
        </h2>
        <p className="mt-4 max-w-2xl text-navy-black/70">
          No percentage-of-repair pricing — that's exactly the structure that
          creates an incentive to overcharge, and it's what we're positioned
          against.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {LINE_ITEMS.map((item) => (
            <div key={item.title} className="rounded-lg bg-off-white p-6">
              <h3 className="font-semibold text-navy-black">{item.title}</h3>
              <p className="mt-2 text-sm text-navy-black/70">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-navy-black/60">
          Exact naira figures depend on the property and are shared once we
          scope it with you — reach out below and we&apos;ll walk you through
          it.
        </p>
      </div>
    </section>
  );
}
