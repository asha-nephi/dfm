import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = { title: "Co-host marketplace — Terms of Service" };

export default function CohostTermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <span className="inline-block rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Beta
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-navy-black">
          Co-host marketplace — Terms of Service
        </h1>
        <p className="mt-2 text-sm text-navy-black/60">Last updated 2026-07-23</p>

        <div className="mt-8 space-y-6 text-navy-black/80">
          <div>
            <h2 className="text-lg font-semibold text-navy-black">1. What this service is</h2>
            <p className="mt-2">
              Deseret Facility Management Ltd (&quot;DFM&quot;, &quot;we&quot;, &quot;us&quot;), RC 9461286,
              operates a co-host request/application service (&quot;the Service&quot;) that helps
              hosts of short-term rental properties (&quot;Hosts&quot;) connect with individuals or
              teams interested in co-hosting (&quot;Applicants&quot;).
            </p>
            <p className="mt-2">
              <strong>DFM&apos;s role is limited to facilitating the introduction</strong> between
              a Host and an Applicant. DFM is not a party to, and assumes no responsibility for,
              any agreement, arrangement, or working relationship that results between a Host and
              a co-host they select through the Service (&quot;the Co-Host Arrangement&quot;).
            </p>
            <p className="mt-2">
              This Service is currently offered in <strong>beta</strong>. Features, availability,
              and these Terms may change as the Service develops.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">2. Eligibility and accounts</h2>
            <p className="mt-2">
              The Service does not require a DFM client account, a password, or ongoing
              registration. A Host submits a request describing their property and needs;
              Applicants respond to a specific request via a link. By submitting a request or
              application, you confirm that:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>You are at least 18 years old and legally able to enter into agreements under Nigerian law.</li>
              <li>The information you provide (contact details, property description, your background) is accurate and not misleading.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">3. What DFM does and does not do</h2>
            <p className="mt-2 font-medium text-navy-black">DFM does:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Review and approve Host requests before they&apos;re opened to applications.</li>
              <li>Provide a private link for the Host to review Applicants and record their selection.</li>
              <li>Store the information submitted through the Service to make the introduction possible.</li>
            </ul>
            <p className="mt-4 font-medium text-navy-black">DFM does not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Vet, verify, background-check, or guarantee the competence, reliability, honesty, or suitability of any Host or Applicant.</li>
              <li>
                Negotiate, set, collect, hold, or guarantee any compensation, fee-split, or payment
                between a Host and a co-host. Any such arrangement is agreed directly between the
                Host and the co-host, entirely outside of DFM&apos;s systems (DFM&apos;s payment
                processing is used solely for DFM&apos;s own client billing and is unrelated to
                this Service).
              </li>
              <li>Draft, review, or enforce any contract between a Host and a co-host.</li>
              <li>Guarantee that a Host will find a suitable Applicant, or that an Applicant will be selected.</li>
              <li>
                Mediate or resolve disputes arising from a Co-Host Arrangement, though we may, at
                our discretion, assist with communication between the parties.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">4. Host responsibilities</h2>
            <p className="mt-2">If you submit a request as a Host, you are solely responsible for:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Independently assessing any Applicant before entering into a Co-Host Arrangement
                with them (we strongly recommend requesting references, verifying identity, and
                agreeing terms in writing directly with your chosen co-host).
              </li>
              <li>
                The legality of the Co-Host Arrangement, including compliance with any applicable
                short-term rental regulations, tax obligations, and property agreements (e.g.
                landlord or building consent where you are not the freehold owner).
              </li>
              <li>Any compensation, access, or authority you grant a co-host to manage your property.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">5. Applicant responsibilities</h2>
            <p className="mt-2">If you apply to co-host, you are solely responsible for:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>The accuracy of any experience, qualifications, or availability you represent to a Host.</li>
              <li>Independently assessing the property, the Host, and the terms of any Co-Host Arrangement before accepting it.</li>
              <li>Your own conduct, tax obligations, and legal compliance in carrying out any co-hosting arrangement you enter into.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">6. No liability for the Co-Host Arrangement</h2>
            <p className="mt-2">
              To the fullest extent permitted by Nigerian law, DFM disclaims all liability for any
              loss, damage, dispute, injury, theft, property damage, financial loss, or other harm
              arising from or connected to a Co-Host Arrangement, including but not limited to a
              co-host&apos;s conduct, a Host&apos;s conduct, or the terms either party agrees to.
              The Service is provided to facilitate an introduction only; everything that happens
              after that introduction is between the Host and the co-host.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">7. Service provided &quot;as is&quot;</h2>
            <p className="mt-2">
              The Service is provided on a beta, &quot;as is&quot; and &quot;as available&quot; basis, without
              warranties of any kind, express or implied, including as to availability, uptime, or
              fitness for a particular purpose.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">8. Removal from the Service</h2>
            <p className="mt-2">
              DFM may, at its sole discretion, decline to approve a request, remove a request or
              application, or refuse to make an introduction, including where we believe the
              request is fraudulent, unsafe, or inconsistent with these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">9. Data and privacy</h2>
            <p className="mt-2">
              Information submitted through the Service is handled as described in DFM&apos;s{" "}
              <a href="/privacy" className="text-charcoal underline underline-offset-2">
                Privacy Notice
              </a>
              . In summary: contact details you provide for a specific request or application are
              shared only with the specific Host or Applicant involved in that introduction, not
              published or made publicly browsable.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">10. Governing law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute
              arising from these Terms or the Service shall be subject to the exclusive
              jurisdiction of the courts of Lagos State.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-navy-black">11. Contact</h2>
            <p className="mt-2">
              Questions about these Terms: nephi.asha@deseretfacilities.com
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
