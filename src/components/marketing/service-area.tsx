const AREAS = ["Ikeja GRA", "Opebi", "Allen Avenue", "Maryland", "Ogba"];

export function ServiceArea() {
  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-navy-black sm:text-3xl">
          Starting in Ikeja, expanding from there
        </h2>
        <p className="mt-4 max-w-2xl text-navy-black/70">
          We&apos;re focused on Ikeja and its immediate surroundings today —
          Ikeja GRA, Opebi, Allen Avenue, Maryland, Ogba — so every job can be
          personally verified before we lean on remote reporting alone. If
          your property is elsewhere in Lagos or beyond, reach out anyway;
          we&apos;re expanding and want to know where the demand is.
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
