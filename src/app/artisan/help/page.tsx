import type { Metadata } from "next";
import { HelpArticles, type HelpArticle } from "@/components/help-articles";

export const metadata: Metadata = { title: "Help" };

const ARTICLES: HelpArticle[] = [
  {
    category: "My jobs",
    title: "Find your assigned jobs",
    body: "My jobs splits into Active and Past jobs. Open any job to see the property, description, and access notes.",
  },
  {
    category: "My jobs",
    title: "Send DFM a price quote",
    body: "Open the job → Price quote → add priced line items (e.g. labor, materials) and an optional note → Submit quote. DFM gets notified and reviews it — once accepted, it becomes the job's official cost. You can revise and resubmit anytime before that happens.",
  },
  {
    category: "My jobs",
    title: "Update a job's status",
    body: "Open the job → Update status → choose Accepted, In progress, or Complete → Save status. Marking a job Complete emails the client automatically.",
  },
  {
    category: "My jobs",
    title: "Work through a turnover checklist",
    body: "Only appears on short-term-rental jobs where admin has set one up. Open the job → check off items as you complete them, then Save status.",
  },
  {
    category: "My jobs",
    title: "Upload completion photos",
    body: "Open the job → Completion photos → choose a file (or several) → Upload. Photos are compressed automatically before upload so it works fine on mobile data.",
  },
  {
    category: "My jobs",
    title: "Comment on a job",
    body: "Open the job → comment box at the bottom of the page. Comments are visible to DFM admin and the client.",
  },
  {
    category: "Messages",
    title: "Message DFM directly",
    body: "Messages → type your message → Send. Use this for anything that doesn't fit a specific job — DFM sees it right away, no need to WhatsApp or call.",
  },
  {
    category: "My profile",
    title: "Update your name or phone number",
    body: "My profile → edit Name or Phone / WhatsApp → Save changes. Your email is tied to your login and can't be changed here — contact DFM directly if it needs to change.",
  },
  {
    category: "My profile",
    title: "See your job count and rating",
    body: "My profile shows your completed job count and average rating at the top, based on ratings left by clients (and sometimes admin) on your completed jobs.",
  },
  {
    category: "My profile",
    title: "Add your bank details to get paid",
    body: "My profile → Payout account section → pick your bank, enter your account number → Verify & save. We confirm the account name with your bank before saving. Until this is set, DFM can't send you a payout.",
  },
];

export default function ArtisanHelpPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Help</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        How to guides for your dashboard.
      </p>
      <div className="mt-6">
        <HelpArticles articles={ARTICLES} />
      </div>
    </div>
  );
}
