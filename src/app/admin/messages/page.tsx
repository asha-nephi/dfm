import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const [{ data: clients }, { data: artisans }] = await Promise.all([
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("artisans").select("id, name, trade").order("name"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Messages</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Message a client or artisan directly — reaches them even if all you have on file is a WhatsApp number.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
          <h2 className="font-semibold text-navy-black">Clients</h2>
          {!clients || clients.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No clients yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {clients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/messages/client/${c.id}`}
                    className="text-sm font-medium text-charcoal underline underline-offset-2"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
          <h2 className="font-semibold text-navy-black">Artisans</h2>
          {!artisans || artisans.length === 0 ? (
            <p className="mt-2 text-sm text-navy-black/60">No artisans yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {artisans.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/messages/artisan/${a.id}`}
                    className="text-sm font-medium text-charcoal underline underline-offset-2"
                  >
                    {a.name}
                    {a.trade ? ` — ${a.trade}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
