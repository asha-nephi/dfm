// The five services DFM sells. One place so the site, booking form and admin agree.

export type ServiceSlug = "cleaning" | "ac" | "electrical" | "plumbing" | "generator";

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  tagline: string;
  fromPrice: number; // naira, starting price shown on the site
  priceNote: string;
  trade: string; // matches artisans.trade
  includes: string[];
  goodFor: string[];
  icon: string; // key for ServiceIcon
};

export const SERVICES: Service[] = [
  {
    slug: "cleaning",
    name: "Cleaning",
    short: "Regular, deep and move-in/move-out cleaning.",
    tagline: "A clean property, proven with photos after every visit.",
    fromPrice: 25000,
    priceNote: "per visit, 2-bedroom. 3-bedroom from ₦35,000. Deep clean from ₦60,000.",
    trade: "Cleaner",
    includes: [
      "Sweeping, mopping and dusting of every room",
      "Kitchen surfaces, sink and appliance fronts",
      "Bathrooms and toilets scrubbed and disinfected",
      "Before-and-after photos of each room",
      "Weekly, every two weeks or monthly plans",
    ],
    goodFor: ["Owners abroad", "Short-let turnovers", "Tenant move-in / move-out"],
    icon: "sparkle",
  },
  {
    slug: "ac",
    name: "AC servicing",
    short: "Routine servicing, gas top-up and repairs for split units.",
    tagline: "Cool rooms and fewer breakdowns, with a record of every service.",
    fromPrice: 15000,
    priceNote: "per unit for routine servicing. Gas and parts quoted after inspection.",
    trade: "AC Technician",
    includes: [
      "Filter and coil cleaning",
      "Drain line flush and leak check",
      "Gas pressure check (top-up quoted if needed)",
      "Dated photos and a short condition note per unit",
    ],
    goodFor: ["Every 3 months", "Before tenants move in", "Short-lets"],
    icon: "snow",
  },
  {
    slug: "electrical",
    name: "Electrical",
    short: "Faults, sockets, lighting, wiring and changeover work.",
    tagline: "Safe, tidy electrical work with itemized parts.",
    fromPrice: 15000,
    priceNote: "inspection visit, taken off the repair cost if you go ahead.",
    trade: "Electrician",
    includes: [
      "Fault finding and repairs",
      "Sockets, switches and light fittings",
      "Changeover and distribution board checks",
      "Itemized quote for your approval before work starts",
    ],
    goodFor: ["Power faults", "Safety checks", "Upgrades"],
    icon: "bolt",
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    short: "Leaks, blockages, pumps, tanks and fittings.",
    tagline: "Leaks fixed before they turn into damage.",
    fromPrice: 15000,
    priceNote: "inspection visit, taken off the repair cost if you go ahead.",
    trade: "Plumber",
    includes: [
      "Leaks, drips and blocked drains",
      "Water pumps and overhead tanks",
      "Taps, toilets, showers and heaters",
      "Itemized quote for your approval before work starts",
    ],
    goodFor: ["Leaks", "Low water pressure", "Bathroom fixes"],
    icon: "drop",
  },
  {
    slug: "generator",
    name: "Generator servicing",
    short: "Oil and filter changes, checks and repairs for home generators.",
    tagline: "Power you can count on, with proof the servicing was done.",
    fromPrice: 25000,
    priceNote: "per service for a small home generator. Larger diesel sets quoted.",
    trade: "Generator Technician",
    includes: [
      "Oil and oil filter change",
      "Air filter and spark plug check",
      "Battery, wiring and run test",
      "Dated photos and running-hours note",
    ],
    goodFor: ["Every 3 months", "Before tenants move in", "Repairs"],
    icon: "engine",
  },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]];

export function getService(slug: string | null | undefined): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function serviceLabel(slug: string | null | undefined): string {
  return getService(slug)?.name ?? "General";
}

export const MONTHLY_FEE = 40000;
export const COORDINATION_RATE = 0.1;
export const COORDINATION_CAP = 20000;

// Rough naira-to-dollar rate for the "about $X" hint. Set NEXT_PUBLIC_USD_RATE to update.
export const USD_RATE = Number(process.env.NEXT_PUBLIC_USD_RATE) || 1500;

export function usdEstimate(naira: number): string {
  const usd = Math.max(1, Math.round(naira / USD_RATE));
  return `about $${usd}`;
}

export const SERVICE_AREAS = ["Ikeja GRA", "Opebi", "Allen Avenue", "Maryland", "Ogba", "Alausa"];
