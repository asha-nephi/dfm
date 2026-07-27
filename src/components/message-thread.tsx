import { formatDate } from "@/lib/format";
import { SubmitButton } from "@/components/submit-button";

type Message = { id: string; sender_role: string; body: string; created_at: string };

export function MessageThread({
  messages,
  action,
  hiddenFields,
  selfRole,
  otherPartyName,
}: {
  messages: Message[];
  action: (formData: FormData) => Promise<void>;
  hiddenFields?: Record<string, string>;
  selfRole: "admin" | "client" | "artisan";
  otherPartyName: string;
}) {
  return (
    <section className="rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
      {messages.length === 0 ? (
        <p className="text-sm text-navy-black/60">
          No messages yet — say hello to {otherPartyName}.
        </p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const isSelf = m.sender_role === selfRole;
            const label = isSelf ? "You" : m.sender_role === "admin" ? "DFM" : otherPartyName;
            return (
              <li
                key={m.id}
                className={`rounded-lg p-3 ${isSelf ? "bg-charcoal/5 ml-8" : "bg-off-white mr-8"}`}
              >
                <p className="text-xs text-navy-black/50">
                  <span className="font-medium text-navy-black/70">{label}</span>
                  {" · "}
                  {formatDate(m.created_at)}
                </p>
                <p className="mt-1 text-sm text-navy-black">{m.body}</p>
              </li>
            );
          })}
        </ul>
      )}

      <form action={action} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
        {hiddenFields &&
          Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        <textarea
          name="body"
          required
          rows={2}
          placeholder={`Message ${otherPartyName}...`}
          className="flex-1 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Send
</SubmitButton>
      </form>
    </section>
  );
}
