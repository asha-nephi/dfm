// Thin wrapper over the Resend HTTP API — no SDK dependency needed for
// simple transactional sends. Fails soft: a broken email send should never
// block the underlying action (a work order still gets marked complete even
// if the notification email fails), so callers don't need to handle errors.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_SENDER_EMAIL;

  if (!apiKey || !from) {
    console.error("sendEmail skipped: RESEND_API_KEY or RESEND_SENDER_EMAIL not set");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Deseret Facility Management <${from}>`,
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("sendEmail failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("sendEmail threw", err);
  }
}

const ADMIN_NOTIFY_EMAIL = "nephi.asha@deseretfacilities.com";

function wrapper(bodyHtml: string): string {
  // Absolute URL: email clients can't resolve relative paths, and most
  // (Outlook especially) render inline SVG unreliably or not at all — a
  // hosted PNG is the safe, universal choice. See scripts/gen-email-logo.js
  // for how public/email-logo.png is generated from the app's own mark.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `
    <div style="font-family: Arial, sans-serif; color: #12151F; max-width: 480px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px;">
        <tr>
          <td style="vertical-align: middle; padding-right: 10px;">
            <img
              src="${siteUrl}/email-logo.png"
              width="32"
              height="32"
              alt="Deseret Facility Management"
              style="display: block; width: 32px; height: 32px; border-radius: 7px;"
            />
          </td>
          <td style="vertical-align: middle;">
            <span style="font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #D9A441; font-weight: 600;">
              Deseret Facility Management
            </span>
          </td>
        </tr>
      </table>
      ${bodyHtml}
    </div>
  `;
}

export async function notifyAdminNewMaintenanceRequest(params: {
  clientName: string;
  propertyAddress: string;
  description: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `New maintenance request — ${params.propertyAddress}`,
    html: wrapper(`
      <h2>New maintenance request</h2>
      <p><strong>${params.clientName}</strong> submitted a request for <strong>${params.propertyAddress}</strong>:</p>
      <p style="background:#FAF7F1; padding:12px; border-radius:8px;">${params.description}</p>
    `),
  });
}

export async function notifyClientWorkOrderComplete(params: {
  clientEmail: string;
  propertyAddress: string;
  description: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.clientEmail,
    subject: `Job complete — ${params.propertyAddress}`,
    html: wrapper(`
      <h2>Your maintenance job is complete</h2>
      <p><strong>${params.propertyAddress}</strong></p>
      <p>${params.description}</p>
      <p><a href="${params.siteUrl}/client" style="color:#1C2233;">View photos and details on your dashboard &rarr;</a></p>
    `),
  });
}

export async function notifyClientPaymentDue(params: {
  clientEmail: string;
  amount: string;
  description: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.clientEmail,
    subject: `Payment due — ${params.amount}`,
    html: wrapper(`
      <h2>Payment due</h2>
      <p><strong>${params.description}</strong></p>
      <p style="font-size: 20px; font-weight: 600;">${params.amount}</p>
      <p><a href="${params.siteUrl}/client/payments" style="color:#1C2233;">Pay now &rarr;</a></p>
    `),
  });
}

export async function notifyClientPaymentReceived(params: {
  clientEmail: string;
  amount: string;
  description: string;
}): Promise<void> {
  await sendEmail({
    to: params.clientEmail,
    subject: `Payment received — ${params.amount}`,
    html: wrapper(`
      <h2>Payment received</h2>
      <p>Thanks — we've received your payment of <strong>${params.amount}</strong> for ${params.description}.</p>
    `),
  });
}

export async function notifyClientInvited(params: {
  clientEmail: string;
  clientName: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.clientEmail,
    subject: "You've been added to Deseret Facility Management",
    html: wrapper(`
      <h2>Welcome, ${params.clientName}</h2>
      <p>DFM has added you as a client. Set your password to access your dashboard — property details, maintenance history, and payments, all in one place.</p>
      <p><a href="${params.siteUrl}/signup" style="color:#1C2233;">Set your password &rarr;</a></p>
      <p style="font-size:13px; color:#666;">Use this same email address (${params.clientEmail}) when setting your password.</p>
    `),
  });
}

export async function notifyArtisanInvited(params: {
  artisanEmail: string;
  artisanName: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.artisanEmail,
    subject: "You've been added to Deseret Facility Management",
    html: wrapper(`
      <h2>Welcome, ${params.artisanName}</h2>
      <p>DFM has added you to the artisan roster. Set your password to access your dashboard — you'll see jobs assigned to you, and can update status and upload completion photos from there.</p>
      <p><a href="${params.siteUrl}/signup" style="color:#1C2233;">Set your password &rarr;</a></p>
      <p style="font-size:13px; color:#666;">Use this same email address (${params.artisanEmail}) when setting your password.</p>
    `),
  });
}

export async function notifyArtisanJobAssigned(params: {
  artisanEmail: string;
  propertyAddress: string;
  description: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: params.artisanEmail,
    subject: `New job assigned — ${params.propertyAddress}`,
    html: wrapper(`
      <h2>You've been assigned a job</h2>
      <p><strong>${params.propertyAddress}</strong></p>
      <p>${params.description}</p>
      <p><a href="${params.siteUrl}/artisan" style="color:#1C2233;">View job details &rarr;</a></p>
    `),
  });
}

export async function notifyArtisanPayoutSent(params: {
  artisanEmail: string;
  artisanName: string;
  amount: string;
}): Promise<void> {
  await sendEmail({
    to: params.artisanEmail,
    subject: `Payment sent — ${params.amount}`,
    html: wrapper(`
      <h2>Payment sent</h2>
      <p>Hi ${params.artisanName}, we've sent <strong>${params.amount}</strong> to your bank account on file. It should reflect shortly, depending on your bank.</p>
    `),
  });
}

export async function notifyAdminArtisanQuoteSubmitted(params: {
  artisanName: string;
  propertyAddress: string;
  amount: string;
  workOrderId: string;
  siteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Quote submitted — ${params.propertyAddress} (${params.amount})`,
    html: wrapper(`
      <h2>Artisan submitted a quote</h2>
      <p><strong>${params.artisanName}</strong> proposed <strong>${params.amount}</strong> for ${params.propertyAddress}.</p>
      <p><a href="${params.siteUrl}/admin/work-orders/${params.workOrderId}" style="color:#1C2233;">Review the quote &rarr;</a></p>
    `),
  });
}

export async function notifyArtisanQuoteAccepted(params: {
  artisanEmail: string;
  artisanName: string;
  propertyAddress: string;
  amount: string;
}): Promise<void> {
  await sendEmail({
    to: params.artisanEmail,
    subject: `Quote accepted — ${params.propertyAddress}`,
    html: wrapper(`
      <h2>Your quote was accepted</h2>
      <p>Hi ${params.artisanName}, DFM accepted your quote of <strong>${params.amount}</strong> for ${params.propertyAddress} — it's now the job's itemized cost.</p>
    `),
  });
}

export async function notifyArtisanQuoteDeclined(params: {
  artisanEmail: string;
  artisanName: string;
  propertyAddress: string;
}): Promise<void> {
  await sendEmail({
    to: params.artisanEmail,
    subject: `Quote declined — ${params.propertyAddress}`,
    html: wrapper(`
      <h2>Your quote wasn't accepted</h2>
      <p>Hi ${params.artisanName}, DFM didn't accept your quote for ${params.propertyAddress}. Check the job's comments, or reach out directly, and feel free to submit a revised quote.</p>
    `),
  });
}

export async function notifyAdminNewArtisanApplication(params: {
  name: string;
  trade: string;
  serviceArea: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `New artisan application — ${params.name} (${params.trade})`,
    html: wrapper(`
      <h2>New artisan application</h2>
      <p><strong>${params.name}</strong> applied to join the artisan network as a <strong>${params.trade}</strong>, working in ${params.serviceArea}.</p>
      <p>Review it in the admin artisan applications queue.</p>
    `),
  });
}

export async function notifyAdminNewCohostRequest(params: {
  hostName: string;
  propertyDescription: string;
}): Promise<void> {
  await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `New co-host request — ${params.hostName}`,
    html: wrapper(`
      <h2>New co-host request</h2>
      <p><strong>${params.hostName}</strong> submitted a co-host request:</p>
      <p style="background:#FAF7F1; padding:12px; border-radius:8px;">${params.propertyDescription}</p>
      <p>Review it in the admin co-host marketplace.</p>
    `),
  });
}

export async function notifyHostCohostApproved(params: {
  hostEmail: string;
  hostName: string;
  hostLink: string;
}): Promise<void> {
  await sendEmail({
    to: params.hostEmail,
    subject: "Your co-host request is open for applications",
    html: wrapper(`
      <h2>You're open for applications</h2>
      <p>Hi ${params.hostName}, DFM has reviewed and approved your co-host request — it's now open for prospective co-hosts to apply.</p>
      <p><a href="${params.hostLink}" style="color:#1C2233;">Check your request &rarr;</a></p>
      <p style="font-size:13px; color:#666;">Bookmark this link — it's the only way to review applicants and select a co-host.</p>
    `),
  });
}

export async function notifyHostNewCohostApplication(params: {
  hostEmail: string;
  hostName: string;
  applicantName: string;
  hostLink: string;
}): Promise<void> {
  await sendEmail({
    to: params.hostEmail,
    subject: `New co-host applicant — ${params.applicantName}`,
    html: wrapper(`
      <h2>New applicant</h2>
      <p>Hi ${params.hostName}, <strong>${params.applicantName}</strong> just applied to co-host your property.</p>
      <p><a href="${params.hostLink}" style="color:#1C2233;">Review and select &rarr;</a></p>
    `),
  });
}

export async function notifyApplicantCohostSelected(params: {
  applicantEmail: string;
  applicantName: string;
  hostName: string;
}): Promise<void> {
  await sendEmail({
    to: params.applicantEmail,
    subject: "You've been selected as a co-host",
    html: wrapper(`
      <h2>You've been selected</h2>
      <p>Hi ${params.applicantName}, ${params.hostName} has selected you as their co-host. They'll be in touch directly to sort out next steps.</p>
    `),
  });
}

export async function notifyApplicantCohostNotSelected(params: {
  applicantEmail: string;
  applicantName: string;
}): Promise<void> {
  await sendEmail({
    to: params.applicantEmail,
    subject: "Update on your co-host application",
    html: wrapper(`
      <h2>Application update</h2>
      <p>Hi ${params.applicantName}, thanks for applying — the host has chosen another co-host for this property this time. Keep an eye out for future requests.</p>
    `),
  });
}
