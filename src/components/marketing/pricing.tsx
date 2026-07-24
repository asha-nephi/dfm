const LINE_ITEMS = [
  {
    title: "Flat monthly management fee",
    body: "₦40,000/month per property (may vary slightly by size or complexity) — one predictable amount, regardless of how much maintenance activity happens that month.",
  },
  {
    title: "Repairs at verified actual cost",
    body: "Repair and vendor costs are passed through at the actual invoiced cost — itemized, never marked up.",
  },
  {
    title: "Small, disclosed coordination fee",
    body: "A disclosed 10% coordination fee on vendor costs, capped at ₦20,000 per job, always shown as its own line next to the vendor's invoice.",
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
          Pilot pricing — may be adjusted slightly as we take on more
          properties. Reach out below and we&apos;ll confirm the exact
          figures for your property.
        </p>
      </div>
    </section>
  );
}
