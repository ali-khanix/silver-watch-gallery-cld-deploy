// Bitpay.ir payment gateway integration (docs: راهنمای اتصال به درگاه پرداخت bitpay نسخه 2.2).
// Bitpay has no official Node SDK — the API is a couple of plain
// x-www-form-urlencoded POST requests, so we talk to it directly with fetch.
//
// IMPORTANT: Bitpay amounts are Rial. Every price/total in this app is
// stored and displayed in Toman (see order.total etc.), so amounts are
// multiplied by 10 right before they're sent to Bitpay — nowhere else.

const BITPAY_API_KEY = process.env.BITPAY_API_KEY;
const BITPAY_SANDBOX = process.env.BITPAY_SANDBOX === "true";

if (!BITPAY_API_KEY && process.env.NODE_ENV !== "development") {
  console.warn("BITPAY_API_KEY is not set — payment requests will fail.");
}

// Test environment drops the "-test" segment from every URL below once you
// go live — see BITPAY_BASE.
const BITPAY_BASE = BITPAY_SANDBOX
  ? "https://bitpay.ir/payment-test"
  : "https://bitpay.ir/payment";

// Base URL used to build the redirect Bitpay sends the customer back to.
// Set NEXT_PUBLIC_BASE_URL in .env for local dev (e.g. http://localhost:3002);
// falls back to the production domain otherwise.
export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://silverwatchgallery.com";
}

// The page the customer is sent to after gateway-send succeeds.
export function getGatewayUrl(idGet: string) {
  return `${BITPAY_BASE}/gateway-${idGet}-get`;
}

type CreatePaymentParams = {
  /** Amount in Rial (already multiplied by 10 from the Toman total). */
  amountRial: number;
  redirect: string;
  name?: string;
  email?: string;
  description?: string;
};

type CreatePaymentResult =
  | { ok: true; idGet: string }
  | { ok: false; errorCode: number };

// POSTs to gateway-send. Bitpay replies with a plain-text body: a positive
// integer (id_get) on success, or a negative error code (-1..-5, see docs)
// on failure — it is not JSON.
export async function createBitpayPayment(
  params: CreatePaymentParams
): Promise<CreatePaymentResult> {
  const body = new URLSearchParams({
    api: BITPAY_API_KEY ?? "",
    amount: String(params.amountRial),
    redirect: params.redirect,
  });
  if (params.name) body.set("name", params.name);
  if (params.email) body.set("email", params.email);
  if (params.description) body.set("description", params.description);

  const res = await fetch(`${BITPAY_BASE}/gateway-send`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = (await res.text()).trim();
  const value = Number(text);

  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, errorCode: Number.isFinite(value) ? value : -99 };
  }

  return { ok: true, idGet: text };
}

export type BitpayVerifyResult = {
  status: number;
  amount?: number;
  cardNum?: string;
  factorId?: string;
};

// POSTs to gateway-result-second with json=1 so Bitpay replies with JSON.
// status: 1 = success, 11 = already verified previously (treat as success,
// don't re-credit the order); anything else = failed/invalid transaction.
export async function verifyBitpayPayment(
  transId: string,
  idGet: string
): Promise<BitpayVerifyResult> {
  const body = new URLSearchParams({
    api: BITPAY_API_KEY ?? "",
    trans_id: transId,
    id_get: idGet,
    json: "1",
  });

  const res = await fetch(`${BITPAY_BASE}/gateway-result-second`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return (await res.json()) as BitpayVerifyResult;
}
