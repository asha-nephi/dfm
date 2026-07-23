import { createHmac } from "node:crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export async function initializePaystackTransaction(params: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100), // Paystack amounts are in kobo
      reference: params.reference,
      callback_url: params.callbackUrl,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to initialize Paystack transaction");
  }
  return json.data;
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<{ status: string; reference: string; amount: number; currency: string }> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } },
  );
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to verify Paystack transaction");
  }
  return json.data;
}

export type PaystackBank = { name: string; code: string; slug: string };

export async function listNigerianBanks(): Promise<PaystackBank[]> {
  const res = await fetch(`${PAYSTACK_BASE}/bank?country=nigeria&currency=NGN`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    // Bank list changes rarely — safe to cache for a day.
    next: { revalidate: 86400 },
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to load bank list");
  }
  return json.data.map((b: { name: string; code: string; slug: string }) => ({
    name: b.name,
    code: b.code,
    slug: b.slug,
  }));
}

export async function resolveBankAccount(params: {
  accountNumber: string;
  bankCode: string;
}): Promise<{ account_number: string; account_name: string }> {
  const res = await fetch(
    `${PAYSTACK_BASE}/bank/resolve?account_number=${encodeURIComponent(params.accountNumber)}&bank_code=${encodeURIComponent(params.bankCode)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } },
  );
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Could not verify that account number");
  }
  return json.data;
}

export async function createTransferRecipient(params: {
  name: string;
  accountNumber: string;
  bankCode: string;
}): Promise<{ recipient_code: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transferrecipient`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "nuban",
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: "NGN",
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to save that bank account with Paystack");
  }
  return json.data;
}

export async function initiateTransfer(params: {
  amountNaira: number;
  recipientCode: string;
  reason: string;
  reference: string;
}): Promise<{ transfer_code: string; status: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "balance",
      amount: Math.round(params.amountNaira * 100),
      recipient: params.recipientCode,
      reason: params.reason,
      reference: params.reference,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Failed to initiate transfer");
  }
  return json.data;
}

export async function finalizeTransfer(params: {
  transferCode: string;
  otp: string;
}): Promise<{ status: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transfer/finalize_transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transfer_code: params.transferCode, otp: params.otp }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Incorrect or expired code — please try again");
  }
  return json.data;
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  return hash === signature;
}
