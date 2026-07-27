import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/message-thread";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { sendAdminMessage } from "../../actions";

export default async function AdminClientMessageThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (!client) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <RealtimeRefresh tables={["messages"]} />
      <Link href="/admin/messages" className="text-sm text-charcoal underline underline-offset-2">
        &larr; Messages
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-navy-black">{client.name}</h1>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please try again.
        </p>
      )}
      <div className="mt-6">
        <MessageThread
          messages={messages ?? []}
          action={sendAdminMessage}
          hiddenFields={{ clientId: id }}
          selfRole="admin"
          otherPartyName={client.name}
        />
      </div>
    </div>
  );
}
