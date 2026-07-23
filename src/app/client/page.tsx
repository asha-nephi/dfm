import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { propertyTypeLabel } from "@/lib/format";

export default async function ClientHomePage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">My properties</h1>

      {!properties || properties.length === 0 ? (
        <p className="mt-4 text-sm text-navy-black/60">
          No properties on file yet. Once DFM adds a property to your
          account, it will show up here.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/client/properties/${property.id}`}
              className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5 transition hover:border-amber/60"
            >
              <span className="inline-block rounded-full bg-off-white px-2.5 py-0.5 text-xs font-medium text-navy-black/70">
                {propertyTypeLabel(property.property_type)}
              </span>
              <h2 className="mt-3 font-semibold text-navy-black">
                {property.address}
              </h2>
              {property.notes && (
                <p className="mt-1 text-sm text-navy-black/60">{property.notes}</p>
              )}
              <span className="mt-4 inline-block text-sm font-medium text-charcoal underline underline-offset-2">
                View maintenance history
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
