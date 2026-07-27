import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/message-thread";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { sendClientMessage } from "./actions";

export const metadata: Metadata = { title: "Messages" };

export default async function ClientMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <RealtimeRefresh tables={["messages"]} />
      <h1 className="text-2xl font-semibold text-navy-black">Messages</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        Message DFM directly — for anything that doesn&apos;t fit a specific property or job.
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong — please try again.
        </p>
      )}
      <div className="mt-6">
        <MessageThread
          messages={messages ?? []}
          action={sendClientMessage}
          selfRole="client"
          otherPartyName="DFM"
        />
      </div>
    </div>
  );
}
