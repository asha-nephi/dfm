import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata = { title: "Privacy — Deseret Facility Management" };

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-navy-black">Privacy notice</h1>
        <p className="mt-2 text-sm text-navy-black/60">Last updated 2026-07-23</p>

        <div className="mt-8 space-y-6 text-navy-black/80">
          <p>
            Deseret Facility Management Ltd (&quot;DFM&quot;, &quot;we&quot;)
            manages properties on behalf of landlords. This notice explains,
            in plain terms, what personal data we collect through this site
            and while managing your property, and what we do with it.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">What we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Contact details you give us: name, email or WhatsApp number, property location, and any message you send.</li>
              <li>Client and property records: name, contact details, property address, and maintenance history if you become a client.</li>
              <li>Payment activity processed by Paystack: amount, status, and transaction reference. We never see or store your card details — Paystack handles that directly.</li>
              <li>Photos taken to document maintenance and repair work at your property.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">Why we collect it</h2>
            <p className="mt-2">
              To respond to enquiries, manage your property and the work done
              on it, keep a verifiable record of maintenance and cost, and
              process payment for our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">Who sees it</h2>
            <p className="mt-2">
              Your data is visible to DFM admin, and — scoped only to jobs
              assigned to them — to the artisan working on your property. We
              don&apos;t sell your data, and we don&apos;t share it with third
              parties beyond the service providers that make the platform
              work (currently Supabase for hosting/storage and Paystack for
              payments).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">Co-host marketplace</h2>
            <p className="mt-2">
              If you submit or respond to a co-host request, the contact
              details you provide are shared only with the specific host or
              applicant involved in that request, to make the introduction.
              DFM facilitates the introduction but is not a party to any
              resulting agreement between host and co-host.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">Questions or removal requests</h2>
            <p className="mt-2">
              Contact nephi.asha@deseretfacilities.com and we&apos;ll handle
              it directly.
            </p>
          </div>

          <p className="text-sm text-navy-black/50">
            This is a plain-language notice for v1. Full NDPR-aligned
            data-handling documentation is planned as the operation grows.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
