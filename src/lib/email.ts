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
  return `
    <div style="font-family: Arial, sans-serif; color: #12151F; max-width: 480px;">
      <p style="font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #D9A441; font-weight: 600;">
        Deseret Facility Management
      </p>
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
