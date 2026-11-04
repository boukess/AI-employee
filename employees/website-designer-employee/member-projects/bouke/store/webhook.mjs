// Verifies a Stripe webhook signature and turns a completed Checkout
// session into a plain order record. The Stripe Dashboard remains the
// source of truth. This module only logs. It does not write a database.

import { createHmac, timingSafeEqual } from "node:crypto";

export const TOLERANCE_SECONDS = 300;
const HANDLED = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);

function hexEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export function verifyStripeSignature(rawBody, header, secret, nowMs = Date.now()) {
  if (typeof rawBody !== "string" || typeof header !== "string" || typeof secret !== "string" || !secret) {
    return { ok: false, error: "Missing signature." };
  }
  const parts = header.split(",").map((part) => part.trim());
  let timestamp = "";
  const signatures = [];
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === "t") timestamp = value;
    if (key === "v1" && value) signatures.push(value);
  }
  if (!/^\d+$/.test(timestamp) || signatures.length === 0) {
    return { ok: false, error: "Signature header is not valid." };
  }
  const age = Math.abs(nowMs / 1000 - Number(timestamp));
  if (age > TOLERANCE_SECONDS) return { ok: false, error: "Signature timestamp is outside the tolerance window." };
  const expected = createHmac("sha256", secret).update(timestamp + "." + rawBody, "utf8").digest("hex");
  const match = signatures.some((signature) => hexEqual(signature, expected));
  if (!match) return { ok: false, error: "Signature does not match." };
  return { ok: true };
}

function shippingOf(session) {
  if (!session || typeof session !== "object") return null;
  return session.shipping_details
    || (session.collected_information && session.collected_information.shipping_details)
    || null;
}

export function summarizeOrder(event, session) {
  const object = (event && event.data && event.data.object) || {};
  const source = session || object;
  const lineItems = source.line_items && Array.isArray(source.line_items.data) ? source.line_items.data : [];
  return {
    tag: "BOUKE_ORDER",
    eventId: event.id || "",
    eventType: event.type || "",
    livemode: event.livemode === true,
    sessionId: object.id || "",
    paymentStatus: object.payment_status || source.payment_status || "",
    amountTotal: Number.isInteger(object.amount_total) ? object.amount_total : null,
    currency: object.currency || "",
    customerEmail: (object.customer_details && object.customer_details.email) || object.customer_email || "",
    shipping: shippingOf(object) || shippingOf(source),
    cart: (object.metadata && object.metadata.bouke_cart) || "",
    items: lineItems.map((item) => ({
      description: item.description || "",
      quantity: item.quantity || 0,
      amountTotal: item.amount_total ?? null,
      currency: item.currency || object.currency || "",
    })),
  };
}

async function retrieveSession(sessionId, secretKey, fetchImpl) {
  if (!sessionId || !secretKey) return null;
  const fetcher = fetchImpl || globalThis.fetch;
  const url = "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId) + "?expand[]=line_items";
  try {
    const response = await fetcher(url, {
      headers: { Authorization: "Bearer " + secretKey },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function handleStripeEvent({ rawBody, signature, webhookSecret, secretKey, fetchImpl, nowMs, log }) {
  const verified = verifyStripeSignature(rawBody, signature, webhookSecret, nowMs);
  if (!verified.ok) return { ok: false, status: 400, error: "Webhook signature could not be verified." };
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, error: "Webhook body is not JSON." };
  }
  if (!event || typeof event !== "object" || !HANDLED.has(event.type)) {
    return { ok: true, status: 200, ignored: true };
  }
  const sessionId = event.data && event.data.object && event.data.object.id;
  const session = await retrieveSession(sessionId, secretKey, fetchImpl);
  const order = summarizeOrder(event, session);
  const writer = log || ((line) => console.log(line));
  writer(JSON.stringify(order));
  return { ok: true, status: 200, order };
}
