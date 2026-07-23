import { formatDate } from "@/lib/format";
import { SubmitButton } from "@/components/submit-button";

type Comment = {
  id: string;
  author_role: string;
  author_name: string;
  body: string;
  created_at: string;
};

const ROLE_LABEL: Record<string, string> = {
  admin: "DFM",
  client: "Client",
  artisan: "Artisan",
};

export function WorkOrderComments({
  comments,
  action,
  workOrderId,
  extraFields,
}: {
  comments: Comment[];
  action: (formData: FormData) => Promise<void>;
  workOrderId: string;
  extraFields?: Record<string, string>;
}) {
  return (
    <section className="mt-6 rounded-xl border border-charcoal/10 bg-white shadow-sm shadow-charcoal/5 p-6">
      <h2 className="font-semibold text-navy-black">Comments</h2>

      {comments.length === 0 ? (
        <p className="mt-3 text-sm text-navy-black/60">No comments yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg bg-off-white p-3">
              <p className="text-xs text-navy-black/50">
                <span className="font-medium text-navy-black/70">{c.author_name}</span>
                {" · "}
                {ROLE_LABEL[c.author_role] ?? c.author_role}
                {" · "}
                {formatDate(c.created_at)}
              </p>
              <p className="mt-1 text-sm text-navy-black">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
        <input type="hidden" name="workOrderId" value={workOrderId} />
        {extraFields &&
          Object.entries(extraFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        <textarea
          name="body"
          required
          rows={2}
          placeholder="Add a comment..."
          className="flex-1 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-navy-black placeholder:text-navy-black/40 transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
        <SubmitButton className="rounded-lg bg-charcoal shadow-sm px-4 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-navy-black active:bg-navy-black/90">
  Post
</SubmitButton>
      </form>
    </section>
  );
}
