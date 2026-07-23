import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Leads</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Submissions from the landing page contact form.
      </p>

      <div className="mt-6">
        {!leads || leads.length === 0 ? (
          <p className="text-sm text-navy-black/60">No leads yet.</p>
        ) : (
          <ul className="space-y-3">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-lg border border-charcoal/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-navy-black">{lead.name}</p>
                  <p className="text-xs text-navy-black/50">{formatDate(lead.created_at)}</p>
                </div>
                <p className="mt-1 text-sm text-navy-black/70">{lead.contact}</p>
                {lead.property_location && (
                  <p className="mt-1 text-sm text-navy-black/60">
                    Property: {lead.property_location}
                  </p>
                )}
                {lead.message && <p className="mt-2 text-navy-black">{lead.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
