import type { Metadata } from "next";
import { HelpArticles, type HelpArticle } from "@/components/help-articles";

export const metadata: Metadata = { title: "Help" };

const ARTICLES: HelpArticle[] = [
  {
    category: "Clients & properties",
    title: "Add a new client",
    body: "Clients → fill in name, email, and phone → Add client. They get an email inviting them to set a password and log in.",
  },
  {
    category: "Clients & properties",
    title: "Add a property to a client",
    body: "Clients → open the client → Add property. Choose long-term-let or short-term-rental — this determines whether the property gets a turnover checklist option on its work orders.",
  },
  {
    category: "Clients & properties",
    title: "Set up a preventive maintenance schedule",
    body: "Clients → open the client → open a property → add a maintenance schedule (title + how often, in months). The daily cron job automatically creates a work order when it's due and pushes the next due date forward.",
  },
  {
    category: "Work orders",
    title: "Create a work order",
    body: "Open the property (via Clients, or the property link on an existing work order) → \"New work order\" — or a client submitting their own maintenance request creates one automatically as \"requested\".",
  },
  {
    category: "Work orders",
    title: "Assign an artisan and add itemized costs",
    body: "Open the work order → Assigned artisan dropdown, and the Itemized costs section — add line items manually or quick-add from your benchmark library. The total becomes the job's cost.",
  },
  {
    category: "Work orders",
    title: "Review and accept an artisan's price quote",
    body: "Once you've assigned an artisan, they can propose itemized pricing from their own job page. It shows as an amber \"Artisan's quote — awaiting review\" panel at the top of the work order, plus a \"Quoted\" filter on the work orders list. Accept copies it straight into Itemized costs (and emails the artisan); Decline clears it so they can revise and resubmit.",
  },
  {
    category: "Work orders",
    title: "Set up a turnover checklist",
    body: "Only appears on short-term-rental properties. Open the work order → Turnover checklist section → add items. The assigned artisan checks them off as they complete the turnover.",
  },
  {
    category: "Work orders",
    title: "Flag a work order for review",
    body: "Open the work order → check \"Flag for review\" and add a reason (e.g. quote looks high). Flagged jobs show up on the Overview page and the Flagged filter on the work orders list.",
  },
  {
    category: "Work orders",
    title: "Rate an artisan's work",
    body: "Once a job is complete, open the work order and set a star rating and optional note — same rating field the client can also fill in from their side.",
  },
  {
    category: "Work orders",
    title: "Search or filter the work orders list",
    body: "Work orders page has filter pills (All / Requested / Flagged / Complete) plus a search box that matches the job description.",
  },
  {
    category: "Artisans",
    title: "Add an artisan to the roster",
    body: "Artisans → fill in name, email, phone → Add artisan. They get an email inviting them to set a password and log in.",
  },
  {
    category: "Artisans",
    title: "See an artisan's performance",
    body: "Analytics page → Artisan performance section shows completed job count, average rating, and total value of jobs handled per artisan.",
  },
  {
    category: "Artisans",
    title: "Recruit new artisans",
    body: "Artisan applications page has a shareable link (/join-artisan) — send it out in WhatsApp groups or to trade contacts. Applications land in a queue there; Approve adds them straight to the roster (same invite email as adding one manually), Decline just dismisses it.",
  },
  {
    category: "Leads",
    title: "Convert a lead to a client",
    body: "Leads page → find the lead → Convert to client. This creates the client record and marks the lead converted — you'll still need to add their property separately.",
  },
  {
    category: "Payments",
    title: "Create a payment request",
    body: "Payments → select the property, optionally a specific work order (pre-fills a \"Repair / job cost\" charge from that job's cost) → click one or more charge types (management fee, coordination fee, job cost, or a custom one) → set each amount → Create. The client gets an email with a pay-now link.",
  },
  {
    category: "Payments",
    title: "Combine multiple charges in one request",
    body: "Click more than one charge-type button before creating — e.g. a management fee plus a coordination fee in the same request. Each line item has its own editable amount and they sum to the total automatically.",
  },
  {
    category: "Payments",
    title: "Mark a payment as paid or failed manually",
    body: "Payments list → status dropdown next to any payment. Normally Paystack updates this automatically when the client pays, but you can override it if needed.",
  },
  {
    category: "Payouts",
    title: "Pay an artisan",
    body: "Payouts → select the artisan (only artisans who've added bank details on their profile show up as payable), optionally a completed work order to pre-fill the amount, enter a reason → Send payout. Only artisans with a verified bank account can be paid — if someone's missing, they need to add their bank details from their own profile page first.",
  },
  {
    category: "Payouts",
    title: "Confirm a payout with the one-time code",
    body: "After sending a payout, Paystack texts a one-time code to your phone. Click \"Enter code to confirm\" next to that payout and type it in — the payout stays \"Awaiting code\" until you do.",
  },
  {
    category: "Payouts",
    title: "Why a payout might fail",
    body: "Most common reasons: insufficient balance in your Paystack account, or you're switched to test mode (which has its own always-empty balance, separate from live). Check the error message shown — it now shows Paystack's real reason instead of a generic failure.",
  },
  {
    category: "Expenses",
    title: "Log an operating expense",
    body: "Expenses → pick or type a category (salaries, transport, tools, etc.), date, optional note, amount → Log expense. This is separate from artisan payouts and feeds into Net profit on Analytics.",
  },
  {
    category: "Benchmarks",
    title: "Add a cost benchmark",
    body: "Benchmarks → add a label, optional category, and typical amount. These show up as quick-add suggestions when itemizing costs on a work order, so pricing stays consistent across jobs.",
  },
  {
    category: "Analytics",
    title: "Understand the money numbers",
    body: "The top row is real money: Revenue (what clients actually paid), Paid to artisans (successful payouts only), Operating expenses, and Net profit = revenue − payouts − expenses. \"Estimated job cost by property\" further down is a separate, different number — it's the itemized pricing you entered on each work order, not money that has actually left the business.",
  },
  {
    category: "Analytics",
    title: "Track lead conversion and outstanding payments",
    body: "The second KPI row covers outstanding payments (pending, not yet paid), active work orders, flagged jobs, average cost per completed job, and lead conversion rate.",
  },
  {
    category: "Co-host marketplace",
    title: "Approve a co-host request",
    body: "Co-host (beta) → open a pending request → Approve. This opens it for applications and emails the host if their contact looks like an email address.",
  },
  {
    category: "Co-host marketplace",
    title: "Share the apply link",
    body: "Once a request is open, its detail page shows an apply link under \"Shareable links.\" Share it directly with a specific prospective co-host — it's never listed publicly.",
  },
  {
    category: "Co-host marketplace",
    title: "Reopen a matched or closed request",
    body: "Open the request → \"Reopen for new applications.\" The previous match and application history stay on record; the request just becomes open to new applicants again.",
  },
];

export default function AdminHelpPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-black">Help</h1>
      <p className="mt-1 text-sm text-navy-black/60">
        How to guides for everything in the admin dashboard.
      </p>
      <div className="mt-6">
        <HelpArticles articles={ARTICLES} />
      </div>
    </div>
  );
}
