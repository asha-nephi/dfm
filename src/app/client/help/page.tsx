import type { Metadata } from "next";
import { HelpArticles, type HelpArticle } from "@/components/help-articles";

export const metadata: Metadata = { title: "Help" };

const ARTICLES: HelpArticle[] = [
  {
    category: "Booking",
    title: "Book a service",
    body: "Click \"Book a service\" (top of the menu) → pick the service, the property, describe what you need and when suits you → Send request. You'll see it under Jobs straight away, and we confirm within 24 hours.",
  },
  {
    category: "Jobs",
    title: "Track your jobs",
    body: "Jobs shows every request and job across your properties. Open one to see its status, itemized costs, before-and-after photos and comments.",
  },
  {
    category: "Properties",
    title: "View a property's history",
    body: "Properties → open a property. Every job DFM has done there shows up with its date, service, status, itemized cost and photos.",
  },
  {
    category: "Properties",
    title: "Send a quick request from a property",
    body: "Open a property → \"Quick request\" → pick a service if you know it, describe the problem → Submit request. It works the same as booking.",
  },
  {
    category: "Properties",
    title: "Download or view a statement",
    body: "Open a property → \"Statement\" button, top right. Gives you a printable summary of maintenance and cost history for that property.",
  },
  {
    category: "Properties",
    title: "Rate a completed job",
    body: "Open the property → find the completed job → \"How was this job?\" → pick a star rating and optional note. Once submitted, the rating is locked in.",
  },
  {
    category: "Properties",
    title: "Comment on a job",
    body: "Open the property → scroll to the job → comment box at the bottom of that job's card. Comments are visible to DFM admin and the assigned artisan.",
  },
  {
    category: "Payments",
    title: "Pay an outstanding payment",
    body: "Payments → find the pending one → \"Pay now\" → completes checkout through Paystack. Once it clears, the status updates to Paid automatically.",
  },
  {
    category: "Payments",
    title: "Understand payment statuses",
    body: "Pending: not yet paid. Paid: successfully processed. Failed: the attempt didn't go through — try Pay now again or contact DFM.",
  },
  {
    category: "Messages",
    title: "Message DFM directly",
    body: "Messages → type your message → Send. Use this for anything that doesn't fit a specific property or job — DFM sees it right away, no need to email or call.",
  },
  {
    category: "My profile",
    title: "Update your name or phone number",
    body: "My profile → edit Name or Phone / WhatsApp → Save changes. Your email is tied to your login and can't be changed here — contact DFM directly if it needs to change.",
  },
  {
    category: "My profile",
    title: "Add bank details",
    body: "My profile → Bank details section → pick your bank, enter your account number → Verify & save. This is kept on file for any future refund — it isn't used for your regular payments to DFM.",
  },
];

export default function ClientHelpPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-navy-black sm:text-4xl">Help</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        How to guides for your dashboard.
      </p>
      <div className="mt-6">
        <HelpArticles articles={ARTICLES} />
      </div>
    </div>
  );
}
