import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { convertLeadToClient, archiveLead } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  converted: "bg-green-50 text-green-700",
  archived: "bg-charcoal/10 text-navy-black/50",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
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

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6">
        {!leads || leads.length === 0 ? (
          <p className="text-sm text-navy-black/60">No leads yet.</p>
        ) : (
          <ul className="space-y-3">
            {leads.map((lead) => {
              const contactIsEmail = EMAIL_RE.test(lead.contact);
              return (
                <li
                  key={lead.id}
                  className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-5"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-navy-black">{lead.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[lead.status] ?? "bg-charcoal/10 text-navy-black"}`}
                      >
                        {lead.status}
                      </span>
                      <p className="text-xs text-navy-black/50">{formatDate(lead.created_at)}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-navy-black/70">{lead.contact}</p>
                  {lead.property_location && (
                    <p className="mt-1 text-sm text-navy-black/60">
                      Property: {lead.property_location}
                    </p>
                  )}
                  {lead.message && <p className="mt-2 text-navy-black">{lead.message}</p>}

                  {lead.status === "new" && (
                    <div className="mt-4 border-t border-charcoal/10 pt-4">
                      <form
                        action={convertLeadToClient}
                        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                      >
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input
                          name="name"
                          defaultValue={lead.name}
                          placeholder="Client name"
                          required
                          className="rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm text-navy-black focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                        />
                        <input
                          name="email"
                          type="email"
                          defaultValue={contactIsEmail ? lead.contact : ""}
                          placeholder="Client email"
                          required
                          className="rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm text-navy-black focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
                        />
                        <SubmitButton className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-off-white shadow-sm transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Convert to client
</SubmitButton>
                      </form>
                      <form action={archiveLead} className="mt-2">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <SubmitButton className="text-xs text-navy-black/50 hover:text-red-600">
  Archive
</SubmitButton>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
