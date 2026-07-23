const AUDIENCES = [
  {
    title: "Diaspora landlords",
    body: "You own property in Lagos but live abroad and can't drop by to check on it. You need proof of work, not a phone call promising it's handled.",
  },
  {
    title: "Long-term-let owners",
    body: "Tenanted residential property that needs ongoing upkeep — repairs, inspections, and a running record you can check anytime.",
  },
  {
    title: "Short-term-rental hosts",
    body: "Airbnb-style property that needs turnover checklists between guests, and optionally a local co-host to handle day-to-day guest logistics.",
  },
];

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
          Who DFM is for
        </h2>
        <p className="mt-4 max-w-2xl text-navy-black/70">
          Built for landlords who can&apos;t be on-site — whichever of these
          sounds like you, the same verified record-keeping applies.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {AUDIENCES.map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-navy-black">{item.title}</h3>
              <p className="mt-2 text-sm text-navy-black/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
