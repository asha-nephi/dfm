export function Hero() {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-sm font-medium tracking-wide text-amber uppercase">
          Facility management for absentee &amp; diaspora landlords
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-off-white sm:text-5xl">
          Verified, transparent property management for landlords who can&apos;t be there in person.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-off-white/80">
          Dated photos of every job, itemized and benchmarked costs, and one
          flat monthly fee — so you always know what was done to your
          property and what it cost, wherever you are.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="rounded-md bg-amber px-6 py-3 text-sm font-semibold text-charcoal hover:bg-amber/90"
          >
            Get in touch
          </a>
          <a
            href="#how-it-works"
            className="rounded-md border border-off-white/30 px-6 py-3 text-sm font-medium text-off-white hover:border-off-white/60"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
