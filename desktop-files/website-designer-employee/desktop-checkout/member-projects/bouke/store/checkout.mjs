// Builds a Stripe Checkout Session from the server catalog.
// Client prices are ignored. Payment entry happens on Stripe's hosted page.
// Test keys (sk_test_ or rk_test_) are the default. A live key (sk_live_ or
// rk_live_) is accepted only when STRIPE_MODE=live is set on purpose, and
// then a test key is refused so the two modes never mix. See STORE-SETUP.md.
// Monthly packages use Checkout subscription mode. One time packages use
// payment mode. Both rely on the Dashboard's dynamic payment methods: this
// Stripe API version rejects payment_method_types. On a subscription Stripe
// offers only methods that support recurring charges (in test: card, Link,
// Klarna, Cash App, Amazon Pay). Affirm appears only on one time checkouts.

export const STRIPE_API_VERSION = "2026-10-28.endive";
export const CHECKOUT_UNAVAILABLE = "Checkout is not available yet. The store is coming soon.";
const MAX_LINES = 20;

export function isTestSecret(key) {
  return typeof key === "string" && /^(sk|rk)_test_[A-Za-z0-9_]+$/.test(key.trim());
}

export function isLiveSecret(key) {
  return typeof key === "string" && /^(sk|rk)_live_[A-Za-z0-9_]+$/.test(key.trim());
}

// "live" only when STRIPE_MODE is exactly live (case and spaces ignored).
export function resolveStripeMode(env = process.env) {
  return String((env && env.STRIPE_MODE) || "").trim().toLowerCase() === "live" ? "live" : "test";
}

export function isAllowedSecret(key, stripeMode = "test") {
  return stripeMode === "live" ? isLiveSecret(key) : isTestSecret(key);
}

export function resolveSiteUrl(env = process.env) {
  const site = String(env.SITE_URL || "").trim().replace(/\/$/, "");
  if (site) return site;
  const vercel = String(env.VERCEL_URL || "").trim().replace(/\/$/, "").replace(/^https?:\/\//, "");
  if (vercel) return "https://" + vercel;
  return "";
}

export function isStripeCheckoutUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "checkout.stripe.com";
  } catch {
    return false;
  }
}

export function normalizeCart(body, maxQuantity) {
  const cap = Number.isInteger(maxQuantity) ? maxQuantity : 10;
  if (!body || typeof body !== "object" || !Array.isArray(body.items)) {
    return { ok: false, error: "The cart could not be read." };
  }
  if (body.items.length === 0) return { ok: false, error: "Your cart is empty." };
  if (body.items.length > MAX_LINES) return { ok: false, error: "The cart has too many lines." };
  const merged = new Map();
  for (const raw of body.items) {
    if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || !raw.id.trim()) {
      return { ok: false, error: "A cart line is missing a product." };
    }
    const variantId = typeof raw.variantId === "string" ? raw.variantId : "";
    if (!Number.isInteger(raw.quantity)) {
      return { ok: false, error: "Quantity must be a whole number from 1 to " + cap + "." };
    }
    const key = raw.id + "\n" + variantId;
    const next = (merged.get(key) || 0) + raw.quantity;
    if (next < 1 || next > cap) {
      return { ok: false, error: "Quantity must be a whole number from 1 to " + cap + "." };
    }
    merged.set(key, next);
  }
  const items = [];
  for (const [key, quantity] of merged) {
    const splitAt = key.indexOf("\n");
    items.push({ id: key.slice(0, splitAt), variantId: key.slice(splitAt + 1), quantity });
  }
  return { ok: true, items };
}

export function priceCart(catalog, items) {
  const byId = new Map((catalog.products || []).map((product) => [product.id, product]));
  const lines = [];
  let shippable = false;
  let amountCents = 0;
  let recurring = false;
  for (const item of items) {
    const product = byId.get(item.id);
    if (!product) return { ok: false, error: "That product is not in the catalog." };
    const variants = Array.isArray(product.variants) ? product.variants : [];
    let variant = null;
    if (variants.length > 0) {
      if (!item.variantId) return { ok: false, error: "Choose an option for " + product.name + "." };
      variant = variants.find((entry) => entry.id === item.variantId) || null;
      if (!variant) return { ok: false, error: "That option is not available." };
    } else if (item.variantId) {
      return { ok: false, error: "That option is not available." };
    }
    const cap = Number.isInteger(product.maxQuantity) ? product.maxQuantity : catalog.maxQuantity;
    if (Number.isInteger(cap) && item.quantity > cap) {
      return { ok: false, error: "You can buy at most " + cap + " of " + product.name + " per checkout." };
    }
    const unit = variant && Number.isInteger(variant.priceCents) ? variant.priceCents : product.priceCents;
    if (!Number.isInteger(unit) || unit < 1) return { ok: false, error: "That product is not available." };
    if (product.shippable === true) shippable = true;
    const monthly = product.billing === "monthly";
    if (monthly) recurring = true;
    amountCents += unit * item.quantity;
    const name = variant ? product.name + " (" + variant.label + ")" : product.name;
    lines.push({
      productId: product.id,
      variantId: variant ? variant.id : "",
      name: name.slice(0, 250),
      description: String(product.description || "").slice(0, 450),
      unitAmount: unit,
      quantity: item.quantity,
      monthly,
    });
  }
  return {
    ok: true,
    lines,
    shippable,
    recurring,
    amountCents,
    currency: catalog.currency,
  };
}

function cartMetadata(lines) {
  const compact = lines.map((line) => line.productId + ":" + (line.variantId || "-") + ":" + line.quantity).join(",");
  return compact.length <= 500 ? compact : compact.slice(0, 500);
}

export function buildSessionFields(catalog, items, siteUrl) {
  const normalized = normalizeCart({ items }, catalog.maxQuantity);
  if (!normalized.ok) return normalized;
  const priced = priceCart(catalog, normalized.items);
  if (!priced.ok) return priced;
  let origin = "";
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad protocol");
    origin = parsed.origin;
  } catch {
    return { ok: false, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  }
  const cart = cartMetadata(priced.lines);
  const fields = {
    mode: priced.recurring ? "subscription" : "payment",
    success_url: origin + "/success.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/cancel.html",
    "metadata[source]": "bouke-store",
    "metadata[bouke_cart]": cart,
  };
  if (priced.recurring) {
    fields["subscription_data[metadata][source]"] = "bouke-store";
    fields["subscription_data[metadata][bouke_cart]"] = cart;
  } else {
    fields["payment_intent_data[metadata][source]"] = "bouke-store";
    fields["payment_intent_data[metadata][bouke_cart]"] = cart;
  }
  priced.lines.forEach((line, index) => {
    const base = "line_items[" + index + "]";
    fields[base + "[quantity]"] = String(line.quantity);
    fields[base + "[price_data][currency]"] = priced.currency;
    fields[base + "[price_data][unit_amount]"] = String(line.unitAmount);
    fields[base + "[price_data][product_data][name]"] = line.name;
    fields[base + "[price_data][product_data][description]"] = line.description;
    fields[base + "[price_data][product_data][metadata][product_id]"] = line.productId;
    if (line.monthly) fields[base + "[price_data][recurring][interval]"] = "month";
    if (line.variantId) {
      fields[base + "[price_data][product_data][metadata][variant_id]"] = line.variantId;
    }
  });
  if (priced.shippable) {
    catalog.shippingCountries.forEach((code, index) => {
      fields["shipping_address_collection[allowed_countries][" + index + "]"] = code;
    });
  }
  return { ok: true, fields, priced, items: normalized.items };
}

export function encodeSessionBody(fields) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) params.append(key, value);
  return params.toString().replace(/%7BCHECKOUT_SESSION_ID%7D/g, "{CHECKOUT_SESSION_ID}");
}

export async function createCheckoutSession({ catalog, items, siteUrl, secretKey, stripeMode = "test", fetchImpl }) {
  if (!isAllowedSecret(secretKey, stripeMode) || !siteUrl) {
    return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  }
  const built = buildSessionFields(catalog, items, siteUrl);
  if (!built.ok) {
    return {
      ok: false,
      status: built.unavailable ? 503 : 400,
      error: built.unavailable ? CHECKOUT_UNAVAILABLE : built.error,
      unavailable: Boolean(built.unavailable),
    };
  }
  const body = encodeSessionBody(built.fields);
  const locksMethods = Object.keys(built.fields).some((key) => key === "payment_method_types" || key.startsWith("payment_method_types["));
  if (locksMethods) {
    return { ok: false, status: 500, error: CHECKOUT_UNAVAILABLE, unavailable: true };
  }
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
      body,
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error("BOUKE checkout request failed", err && err.name ? err.name : "error");
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
    console.error("BOUKE checkout Stripe error", response.status, stripeMessage);
    if (response.status === 401) {
      return { ok: false, status: 503, error: CHECKOUT_UNAVAILABLE, unavailable: true };
    }
    return { ok: false, status: 502, error: "Checkout could not start. Try again in a moment." };
  }
  return { ok: true, status: 200, url: payload.url, sessionId: payload.id || "" };
}
