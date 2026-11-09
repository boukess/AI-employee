// Builds a Stripe Checkout Session for a donation to BOUKE LLC.
// The amount comes from the visitor, so it is validated here on the server.
// BOUKE LLC is a business, not a charity: the page and the Stripe line say
// that a donation is not tax deductible. Same key and mode rules as the shop.

import {
  CHECKOUT_UNAVAILABLE,
  STRIPE_API_VERSION,
  encodeSessionBody,
  isAllowedSecret,
  isStripeCheckoutUrl,
} from "./checkout.mjs";

export const DONATION_MIN_CENTS = 100;
export const DONATION_MAX_CENTS = 1000000;
export const DONATION_CURRENCY = "usd";
export const DONATION_NAME = "Donation to BOUKE";
export const DONATION_DESCRIPTION = "Support for BOUKE content and creative work. BOUKE LLC is not a charity, so this is not tax deductible.";

export function normalizeDonation(body) {
  if (!body || typeof body !== "object") return { ok: false, error: "The donation could not be read." };
  const cents = body.amountCents;
  if (!Number.isInteger(cents)) return { ok: false, error: "Enter a whole dollar or cent amount." };
  if (cents < DONATION_MIN_CENTS) return { ok: false, error: "The smallest donation is $1." };
  if (cents > DONATION_MAX_CENTS) return { ok: false, error: "The largest donation here is $10,000. Email BOUKE for more." };
  const monthly = body.monthly === true;
  return { ok: true, amountCents: cents, monthly };
}

export function buildDonationFields(donation, siteUrl) {
  let origin = "";
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad protocol");
    origin = parsed.origin;
  } catch {
    return { ok: false, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  }
  const tag = "donation:" + (donation.monthly ? "monthly" : "once") + ":" + donation.amountCents;
  const fields = {
    mode: donation.monthly ? "subscription" : "payment",
    success_url: origin + "/donate.html?thanks=1&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/donate.html?canceled=1",
    submit_type: donation.monthly ? undefined : "donate",
    "metadata[source]": "bouke-donation",
    "metadata[bouke_cart]": tag,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": DONATION_CURRENCY,
    "line_items[0][price_data][unit_amount]": String(donation.amountCents),
    "line_items[0][price_data][product_data][name]": donation.monthly ? DONATION_NAME + " (monthly)" : DONATION_NAME,
    "line_items[0][price_data][product_data][description]": DONATION_DESCRIPTION,
    "line_items[0][price_data][product_data][metadata][product_id]": "donation",
  };
  if (donation.monthly) {
    fields["line_items[0][price_data][recurring][interval]"] = "month";
    fields["subscription_data[metadata][source]"] = "bouke-donation";
    fields["subscription_data[metadata][bouke_cart]"] = tag;
  } else {
    fields["payment_intent_data[metadata][source]"] = "bouke-donation";
    fields["payment_intent_data[metadata][bouke_cart]"] = tag;
  }
  for (const key of Object.keys(fields)) if (fields[key] === undefined) delete fields[key];
  return { ok: true, fields };
}

export async function createDonationSession({ body, siteUrl, secretKey, stripeMode = "test", fetchImpl }) {
  if (!isAllowedSecret(secretKey, stripeMode) || !siteUrl) {
    return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  }
  const donation = normalizeDonation(body);
  if (!donation.ok) return { ok: false, status: 400, error: donation.error };
  const built = buildDonationFields(donation, siteUrl);
  if (!built.ok) return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  const fetcher = fetchImpl || globalThis.fetch;
  let response;
  try {
    response = await fetcher("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secretKey.trim(),
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: encodeSessionBody(built.fields),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error("BOUKE donation request failed", err && err.name ? err.name : "error");
    return { ok: false, status: 502, error: "Checkout could not start. Try again in a moment." };
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok || !payload || !isStripeCheckoutUrl(payload.url)) {
    const stripeMessage = payload && payload.error && payload.error.message ? payload.error.message : "no message";
    console.error("BOUKE donation Stripe error", response.status, stripeMessage);
    if (response.status === 401) return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
    return { ok: false, status: 502, error: "Checkout could not start. Try again in a moment." };
  }
  return { ok: true, status: 200, url: payload.url, sessionId: payload.id || "" };
}
