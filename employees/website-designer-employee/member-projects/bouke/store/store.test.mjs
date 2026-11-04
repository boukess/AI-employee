import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadCatalog, validateCatalog } from "./catalog.mjs";
import {
  buildSessionFields,
  createCheckoutSession,
  encodeSessionBody,
  isStripeCheckoutUrl,
  isTestSecret,
  priceCart,
} from "./checkout.mjs";
import { handleStripeEvent, verifyStripeSignature } from "./webhook.mjs";
import { POST as createPost, GET as createGet } from "../../../../../api/create-checkout-session.js";
import { POST as webhookPost, GET as webhookGet } from "../../../../../api/stripe-webhook.js";

const here = dirname(fileURLToPath(import.meta.url));
const { catalog, errors } = loadCatalog();
const SECRET = "sk_test_1234567890abc";
const SITE = "https://ai-employee-bouke1.vercel.app";

function stripeResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("shipped catalog is valid and the public copy matches", () => {
  assert.deepEqual(errors, []);
  const source = readFileSync(join(here, "products.json"), "utf8");
  const published = readFileSync(join(here, "../dist/products.json"), "utf8");
  assert.equal(published, source);
  assert.equal(catalog.currency, "usd");
  assert.equal(catalog.products.length, 3);
  assert.ok(catalog.products.every((product) => product.example === true));
  assert.ok(validateCatalog(catalog).length === 0);
});

test("server prices ignore a client price and require options", () => {
  const priced = priceCart(catalog, [{ id: "example-field-print", variantId: "", quantity: 1, priceCents: 1 }]);
  assert.equal(priced.ok, true);
  assert.equal(priced.lines[0].unitAmount, 6400);
  assert.equal(priced.shippable, true);

  const missing = priceCart(catalog, [{ id: "example-sports-tee", variantId: "", quantity: 1 }]);
  assert.equal(missing.ok, false);

  const sized = priceCart(catalog, [{ id: "example-sports-tee", variantId: "m", quantity: 2 }]);
  assert.equal(sized.ok, true);
  assert.equal(sized.lines[0].unitAmount, 3600);
  assert.match(sized.lines[0].name, /Medium/);

  const unknown = priceCart(catalog, [{ id: "not-real", variantId: "", quantity: 1 }]);
  assert.equal(unknown.ok, false);
});

test("variant price override is used when the catalog sets one", () => {
  const custom = {
    currency: "usd",
    shippingCountries: ["US"],
    maxQuantity: 10,
    products: [
      {
        id: "hat",
        example: true,
        name: "EXAMPLE: Hat",
        description: "Placeholder.",
        priceCents: 2000,
        shippable: true,
        images: ["images/example-field-print.svg"],
        variants: [{ id: "l", label: "Large", priceCents: 2500 }],
      },
    ],
  };
  const priced = priceCart(custom, [{ id: "hat", variantId: "l", quantity: 1 }]);
  assert.equal(priced.lines[0].unitAmount, 2500);
});

test("checkout fields use dynamic payment methods and server amounts", () => {
  const built = buildSessionFields(
    catalog,
    [
      { id: "example-field-print", quantity: 1, priceCents: 1 },
      { id: "example-digital-notes", variantId: "", quantity: 2 },
    ],
    SITE,
  );
  assert.equal(built.ok, true);
  assert.equal(built.fields["line_items[0][price_data][unit_amount]"], "6400");
  assert.equal(built.fields["line_items[1][price_data][unit_amount]"], "800");
  assert.equal(built.fields["line_items[1][quantity]"], "2");
  assert.equal(built.fields["shipping_address_collection[allowed_countries][0]"], "US");
  assert.equal(built.fields["shipping_address_collection[allowed_countries][1]"], "CA");
  assert.equal(Object.hasOwn(built.fields, "payment_method_types"), false);
  assert.equal(Object.hasOwn(built.fields, "automatic_payment_methods[enabled]"), false);
  const body = encodeSessionBody(built.fields);
  assert.match(body, /session_id%3D\{CHECKOUT_SESSION_ID\}/);
  assert.equal(body.includes("%7BCHECKOUT_SESSION_ID%7D"), false);
  assert.equal(body.includes("payment_method_types"), false);

  const digital = buildSessionFields(catalog, [{ id: "example-digital-notes", quantity: 1 }], SITE);
  assert.equal(digital.priced.shippable, false);
  assert.equal(Object.keys(digital.fields).some((key) => key.startsWith("shipping_address_collection")), false);

  const merged = buildSessionFields(
    catalog,
    [
      { id: "example-field-print", quantity: 2 },
      { id: "example-field-print", quantity: 3 },
    ],
    SITE,
  );
  assert.equal(merged.fields["line_items[0][quantity]"], "5");
  assert.equal(Object.keys(merged.fields).some((key) => key.startsWith("line_items[1]")), false);
});

test("missing, live, and rejected keys do not open a real charge", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return stripeResponse(200, { id: "cs_test_x", url: "https://checkout.stripe.com/c/pay/cs_test_x" });
  };
  const items = [{ id: "example-field-print", quantity: 1 }];
  const missing = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: "", fetchImpl });
  const live = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: "sk_live_1234567890", fetchImpl });
  const noSite = await createCheckoutSession({ catalog, items, siteUrl: "", secretKey: SECRET, fetchImpl });
  assert.equal(missing.status, 503);
  assert.equal(live.status, 503);
  assert.equal(noSite.status, 503);
  assert.match(missing.error, /coming soon/);
  assert.equal(calls, 0);
  assert.equal(isTestSecret("sk_live_1234567890"), false);
  assert.equal(isTestSecret(SECRET), true);
  assert.equal(isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_x"), true);
  assert.equal(isStripeCheckoutUrl("https://example.com/checkout"), false);
});

test("a mocked Stripe test session returns only a Stripe hosted url", async () => {
  let seen = null;
  const fetchImpl = async (url, opts) => {
    seen = { url, opts };
    return stripeResponse(200, { id: "cs_test_session", url: "https://checkout.stripe.com/c/pay/cs_test_session" });
  };
  const result = await createCheckoutSession({
    catalog,
    items: [{ id: "example-sports-tee", variantId: "l", quantity: 1 }],
    siteUrl: SITE,
    secretKey: SECRET,
    fetchImpl,
  });
  assert.equal(result.ok, true);
  assert.equal(result.url, "https://checkout.stripe.com/c/pay/cs_test_session");
  assert.equal(seen.url, "https://api.stripe.com/v1/checkout/sessions");
  assert.equal(seen.opts.headers.Authorization, "Bearer " + SECRET);
  assert.equal(seen.opts.headers["Stripe-Version"], "2026-10-28.endive");
  assert.match(seen.opts.body, /unit_amount%5D=3600/);
  assert.match(seen.opts.body, /shipping_address_collection/);

  const badHost = await createCheckoutSession({
    catalog,
    items: [{ id: "example-field-print", quantity: 1 }],
    siteUrl: SITE,
    secretKey: SECRET,
    fetchImpl: async () => stripeResponse(200, { url: "https://example.com/phish" }),
  });
  assert.equal(badHost.ok, false);

  const unauthorized = await createCheckoutSession({
    catalog,
    items: [{ id: "example-field-print", quantity: 1 }],
    siteUrl: SITE,
    secretKey: SECRET,
    fetchImpl: async () => stripeResponse(401, { error: { message: "Invalid API Key provided" } }),
  });
  assert.equal(unauthorized.status, 503);
});

test("webhook signature accepts a matching Stripe header and rejects the rest", () => {
  const secret = "whsec_test_secret_value";
  const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const now = 1_700_000_000_000;
  const header = sign(secret, payload, String(Math.floor(now / 1000)));
  assert.equal(verifyStripeSignature(payload, header, secret, now).ok, true);
  assert.equal(verifyStripeSignature(payload + " ", header, secret, now).ok, false);
  assert.equal(verifyStripeSignature(payload, header, "whsec_other", now).ok, false);
  assert.equal(verifyStripeSignature(payload, "", secret, now).ok, false);
  assert.equal(verifyStripeSignature(payload, header, secret, now + 600_000).ok, false);
  const alt = "t=" + Math.floor(now / 1000) + ",v1=deadbeef,v1=" + header.split("v1=")[1];
  assert.equal(verifyStripeSignature(payload, alt, secret, now).ok, true);
});

test("a verified checkout event is logged without a database write", async () => {
  const secret = "whsec_test_secret_value";
  const event = {
    id: "evt_order",
    type: "checkout.session.completed",
    livemode: false,
    data: {
      object: {
        id: "cs_test_order",
        payment_status: "paid",
        amount_total: 6400,
        currency: "usd",
        customer_details: { email: "buyer@example.com" },
        shipping_details: { name: "Example Buyer", address: { country: "US" } },
        metadata: { bouke_cart: "example-field-print:-:1" },
      },
    },
  };
  const rawBody = JSON.stringify(event);
  const now = Date.now();
  const lines = [];
  const result = await handleStripeEvent({
    rawBody,
    signature: sign(secret, rawBody, String(Math.floor(now / 1000))),
    webhookSecret: secret,
    secretKey: SECRET,
    nowMs: now,
    log: (line) => lines.push(line),
    fetchImpl: async () => stripeResponse(200, {
      id: "cs_test_order",
      line_items: { data: [{ description: "EXAMPLE: Field print", quantity: 1, amount_total: 6400, currency: "usd" }] },
    }),
  });
  assert.equal(result.status, 200);
  const order = JSON.parse(lines[0]);
  assert.equal(order.tag, "BOUKE_ORDER");
  assert.equal(order.sessionId, "cs_test_order");
  assert.equal(order.customerEmail, "buyer@example.com");
  assert.equal(order.amountTotal, 6400);
  assert.equal(order.items[0].description, "EXAMPLE: Field print");
  assert.equal(order.livemode, false);

  const ignored = await handleStripeEvent({
    rawBody: JSON.stringify({ id: "evt_other", type: "customer.created", data: { object: {} } }),
    signature: sign(secret, JSON.stringify({ id: "evt_other", type: "customer.created", data: { object: {} } }), String(Math.floor(now / 1000))),
    webhookSecret: secret,
    nowMs: now,
    log: () => { throw new Error("ignored events are not orders"); },
  });
  assert.equal(ignored.ignored, true);
});

test("http handlers stay quiet when Stripe is not configured and create a session when it is", async () => {
  const previous = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  };
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.VERCEL_URL;
    process.env.SITE_URL = SITE;

    const quiet = await createGet();
    assert.equal(quiet.status, 200);
    const quietBody = await quiet.json();
    assert.equal(quietBody.checkoutAvailable, false);
    assert.match(quietBody.message, /coming soon/);

    const missingPost = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: SITE, "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "example-field-print", quantity: 1, priceCents: 1 }] }),
    }));
    assert.equal(missingPost.status, 503);

    const foreign = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: "https://evil.example", "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "example-field-print", quantity: 1 }] }),
    }));
    assert.equal(foreign.status, 403);

    const unconfiguredHook = await webhookPost(new Request(SITE + "/api/stripe-webhook", { method: "POST", body: "{}" }));
    assert.equal(unconfiguredHook.status, 503);

    process.env.STRIPE_SECRET_KEY = SECRET;
    let posted = "";
    globalThis.fetch = async (url, opts) => {
      posted = opts.body;
      return stripeResponse(200, { id: "cs_test_handler", url: "https://checkout.stripe.com/c/pay/cs_test_handler" });
    };
    const ready = await createGet();
    assert.equal((await ready.json()).checkoutAvailable, true);
    const started = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: SITE, "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "example-field-print", quantity: 1, priceCents: 1 }] }),
    }));
    assert.equal(started.status, 200);
    const startedBody = await started.json();
    assert.equal(startedBody.url, "https://checkout.stripe.com/c/pay/cs_test_handler");
    assert.equal(posted.split("&").some((part) => part.endsWith("unit_amount%5D=6400")), true);
    assert.equal(posted.split("&").some((part) => part.endsWith("unit_amount%5D=1")), false);

    process.env.STRIPE_SECRET_KEY = "sk_live_1234567890abc";
    const liveGet = await createGet();
    assert.equal((await liveGet.json()).checkoutAvailable, false);

    const hookInfo = await webhookGet();
    assert.equal(hookInfo.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

function sign(secret, payload, timestamp) {
  const v1 = createHmac("sha256", secret).update(timestamp + "." + payload, "utf8").digest("hex");
  return "t=" + timestamp + ",v1=" + v1;
}
