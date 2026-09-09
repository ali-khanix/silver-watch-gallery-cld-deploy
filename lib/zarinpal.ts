import ZarinPal from "zarinpal-node-sdk";

// ZarinPal amounts are Toman throughout this app (matches the totals shown
// on the cart/order pages), so every call into the SDK below passes
// currency: "IRT" explicitly.
export const ZARINPAL_CURRENCY = "IRT" as const;

const merchantId = process.env.ZARINPAL_MERCHANT_ID;

if (!merchantId && process.env.NODE_ENV !== "development") {
  console.warn("ZARINPAL_MERCHANT_ID is not set — payment requests will fail.");
}

export const zarinpal = new ZarinPal({
  merchantId,
  sandbox: process.env.ZARINPAL_SANDBOX === "true",
});

// Base URL used to build the callback_url ZarinPal redirects back to.
// Set NEXT_PUBLIC_BASE_URL in .env for local dev (e.g. http://localhost:3002);
// falls back to the production domain otherwise.
export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://silverwatchgallery.com";
}
