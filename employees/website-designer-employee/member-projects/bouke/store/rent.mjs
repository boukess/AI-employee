// Stripe Checkout for renters paying BOUKE LLC. The renter types the amount and
// a unit or name; both are validated here on the server. Same key and mode
// rules as the shop and donations.

import { CHECKOUT_UNAVAILABLE, STRIPE_API_VERSION, encodeSessionBody, isAllowedSecret, isStripeCheckoutUrl } from "./checkout.mjs";

export const RENT_MIN_CENTS = 100;
export const RENT_MAX_CENTS = 2000000;

export function cleanReference(text) {
  return String(text || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

export function normalizeRent(body) {
  if (!body || typeof body !== "object") return { ok: false, error: "The payment could not be read." };
  const cents = body.amountCents;
  if (!Number.isInteger(cents)) return { ok: false, error: "Enter the amount in dollars and cents." };
  if (cents < RENT_MIN_CENTS) return { ok: false, error: "The smallest payment is $1." };
  if (cents > RENT_MAX_CENTS) return { ok: false, error: "The largest payment here is $20,000. Contact BOUKE for more." };
  const reference = cleanReference(body.reference);
  if (reference.length < 2) return { ok: false, error: "Enter your unit or name so the payment can be matched." };
  return { ok: true, amountCents: cents, reference };
}

export function buildRentFields(rent, siteUrl, payer = null) {
  let origin = "";
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad protocol");
    origin = parsed.origin;
  } catch {
    return { ok: false };
  }
  const tag = "rent:" + rent.amountCents;
  const extra = {};
  if (payer && payer.userId) { extra["metadata[clerk_user]"] = payer.userId; extra["payment_intent_data[metadata][clerk_user]"] = payer.userId; }
  if (payer && payer.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payer.email)) extra.customer_email = payer.email;
  return {
    ok: true,
    fields: {
      ...extra,
      mode: "payment",
      submit_type: "pay",
      success_url: origin + "/employee.html?paid=1&session_id={CHECKOUT_SESSION_ID}#pay-rent",
      cancel_url: origin + "/employee.html?canceled=1#pay-rent",
      "metadata[source]": "bouke-rent",
      "metadata[bouke_cart]": tag,
      "metadata[rent_reference]": rent.reference,
      "payment_intent_data[metadata][source]": "bouke-rent",
      "payment_intent_data[metadata][rent_reference]": rent.reference,
      "payment_intent_data[description]": "Rent payment: " + rent.reference,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(rent.amountCents),
      "line_items[0][price_data][product_data][name]": "Rent payment to BOUKE LLC",
      "line_items[0][price_data][product_data][description]": "For: " + rent.reference,
      "line_items[0][price_data][product_data][metadata][product_id]": "rent",
    },
  };
}

export async function createRentSession({ body, payer = null, siteUrl, secretKey, stripeMode = "test", fetchImpl }) {
  if (!isAllowedSecret(secretKey, stripeMode) || !siteUrl) return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  const rent = normalizeRent(body);
  if (!rent.ok) return { ok: false, status: 400, error: rent.error };
  const built = buildRentFields(rent, siteUrl, payer);
  if (!built.ok) return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  let response;
  try {
    response = await (fetchImpl || globalThis.fetch)("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: "Bearer " + secretKey.trim(), "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": STRIPE_API_VERSION },
      body: encodeSessionBody(built.fields),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error("BOUKE rent request failed", err && err.name ? err.name : "error");
    return { ok: false, status: 502, error: "Checkout could not start. Try again in a moment." };
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || !isStripeCheckoutUrl(payload.url)) {
    console.error("BOUKE rent Stripe error", response.status, payload && payload.error && payload.error.message ? payload.error.message : "no message");
    if (response.status === 401) return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
    return { ok: false, status: 502, error: "Checkout could not start. Try again in a moment." };
  }
  return { ok: true, status: 200, url: payload.url, sessionId: payload.id || "" };
}
