import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { propertyTypeLabel } from "@/lib/format";
import { EmptyState, PageHeader } from "@/components/ui/page-header";

export default async function ClientPropertiesPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        eyebrow="Your homes"
        title="Properties"
        description="Each property keeps its full history of jobs, photos and costs."
      />

      {!properties || properties.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No properties yet"
            body="Once DFM adds a property to your account, it will show up here."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/client/properties/${property.id}`}
              className="card p-6 transition hover:border-charcoal/40"
            >
              <span className="inline-block rounded-full bg-off-white px-2.5 py-0.5 text-xs font-medium text-navy-black/70">
                {propertyTypeLabel(property.property_type)}
              </span>
              <h2 className="font-display mt-3 text-2xl text-navy-black">
                {property.address}
              </h2>
              {property.notes && (
                <p className="mt-1 text-sm text-navy-black/60">{property.notes}</p>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-charcoal">
                View history &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
