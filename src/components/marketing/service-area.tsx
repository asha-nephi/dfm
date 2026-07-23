const AREAS = ["Ikeja GRA", "Opebi", "Allen Avenue", "Maryland", "Ogba"];

export function ServiceArea() {
  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
          Where we operate
        </h2>
        <p className="mt-4 max-w-2xl text-navy-black/70">
          We currently serve Ikeja and its immediate surroundings, expanding
          carefully as we take on more properties — every property is
          personally overseen, so we're not spreading beyond what we can
          actually verify.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <span
              key={area}
              className="rounded-full border border-charcoal/15 bg-white px-4 py-1.5 text-sm text-navy-black/80"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
