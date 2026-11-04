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
  isAllowedSecret,
  isLiveSecret,
  isStripeCheckoutUrl,
  isTestSecret,
  priceCart,
  resolveStripeMode,
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

const SHIPPED_FIXTURE = {
  currency: "usd",
  shippingCountries: ["US", "CA"],
  maxQuantity: 10,
  products: [
    {
      id: "print",
      example: true,
      name: "EXAMPLE: Print",
      description: "Placeholder.",
      priceCents: 6400,
      shippable: true,
      images: [],
      variants: [],
    },
  ],
};

test("shipped catalog is valid and the public copy matches", () => {
  assert.deepEqual(errors, []);
  const source = readFileSync(join(here, "products.json"), "utf8");
  const published = readFileSync(join(here, "../dist/products.json"), "utf8");
  assert.equal(published, source);
  assert.equal(catalog.currency, "usd");
  assert.deepEqual(catalog.products.map((p) => [p.id, p.priceCents, p.billing]), [
    ["shorts-starter", 40000, "monthly"],
    ["creator-growth", 90000, "monthly"],
    ["local-business-visuals", 65000, "one_time"],
    ["game-day-coverage", 15000, "one_time"],
  ]);
  assert.ok(catalog.products.every((product) => product.example === false && product.shippable === false));
  assert.deepEqual(validateCatalog({ ...catalog, products: [{ ...catalog.products[0], billing: "weekly" }] }).length, 1);
  assert.equal(validateCatalog({ ...catalog, products: [{ ...catalog.products[0], shippable: true }] }).length, 1);
});

test("server prices ignore a client price and enforce per package limits", () => {
  const priced = priceCart(catalog, [{ id: "shorts-starter", variantId: "", quantity: 1, priceCents: 1 }]);
  assert.equal(priced.ok, true);
  assert.equal(priced.lines[0].unitAmount, 40000);
  assert.equal(priced.recurring, true);

  const games = priceCart(catalog, [{ id: "game-day-coverage", variantId: "", quantity: 3 }]);
  assert.equal(games.ok, true);
  assert.equal(games.recurring, false);
  assert.equal(games.amountCents, 45000);

  assert.equal(priceCart(catalog, [{ id: "shorts-starter", variantId: "", quantity: 2 }]).ok, false);
  assert.equal(priceCart(catalog, [{ id: "local-business-visuals", variantId: "", quantity: 2 }]).ok, false);
  assert.equal(priceCart(catalog, [{ id: "game-day-coverage", variantId: "", quantity: 11 }]).ok, false);
  assert.equal(priceCart(catalog, [{ id: "creator-growth", variantId: "big", quantity: 1 }]).ok, false);
  assert.equal(priceCart(catalog, [{ id: "not-real", variantId: "", quantity: 1 }]).ok, false);
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
        images: [],
        variants: [{ id: "l", label: "Large", priceCents: 2500 }],
      },
    ],
  };
  assert.deepEqual(validateCatalog(custom), []);
  assert.equal(priceCart(custom, [{ id: "hat", variantId: "", quantity: 1 }]).ok, false);
  const priced = priceCart(custom, [{ id: "hat", variantId: "l", quantity: 1 }]);
  assert.equal(priced.lines[0].unitAmount, 2500);
  assert.match(priced.lines[0].name, /Large/);
});

test("one time checkouts keep dynamic payment methods and server amounts", () => {
  const built = buildSessionFields(
    catalog,
    [
      { id: "local-business-visuals", quantity: 1, priceCents: 1 },
      { id: "game-day-coverage", variantId: "", quantity: 2 },
    ],
    SITE,
  );
  assert.equal(built.ok, true);
  assert.equal(built.fields.mode, "payment");
  assert.equal(built.fields["line_items[0][price_data][unit_amount]"], "65000");
  assert.equal(built.fields["line_items[1][price_data][unit_amount]"], "15000");
  assert.equal(built.fields["line_items[1][quantity]"], "2");
  assert.equal(built.fields["payment_intent_data[metadata][source]"], "bouke-store");
  assert.equal(Object.keys(built.fields).some((key) => key.includes("recurring")), false);
  assert.equal(Object.keys(built.fields).some((key) => key.startsWith("subscription_data")), false);
  assert.equal(Object.keys(built.fields).some((key) => key.startsWith("payment_method_types")), false);
  assert.equal(Object.keys(built.fields).some((key) => key.startsWith("shipping_address_collection")), false);
  const body = encodeSessionBody(built.fields);
  assert.match(body, /session_id%3D\{CHECKOUT_SESSION_ID\}/);
  assert.equal(body.includes("%7BCHECKOUT_SESSION_ID%7D"), false);
  assert.equal(body.includes("payment_method_types"), false);

  const shipped = buildSessionFields(SHIPPED_FIXTURE, [{ id: "print", quantity: 1 }], SITE);
  assert.equal(shipped.fields["shipping_address_collection[allowed_countries][0]"], "US");
  assert.equal(shipped.fields["shipping_address_collection[allowed_countries][1]"], "CA");

  const merged = buildSessionFields(
    catalog,
    [
      { id: "game-day-coverage", quantity: 2 },
      { id: "game-day-coverage", quantity: 3 },
    ],
    SITE,
  );
  assert.equal(merged.fields["line_items[0][quantity]"], "5");
  assert.equal(Object.keys(merged.fields).some((key) => key.startsWith("line_items[1]")), false);
});

test("monthly packages check out as subscriptions with dynamic payment methods", () => {
  const built = buildSessionFields(catalog, [{ id: "creator-growth", quantity: 1, priceCents: 5 }], SITE);
  assert.equal(built.ok, true);
  assert.equal(built.fields.mode, "subscription");
  assert.equal(Object.keys(built.fields).some((key) => key.startsWith("payment_method_types")), false);
  assert.equal(built.fields["line_items[0][price_data][unit_amount]"], "90000");
  assert.equal(built.fields["line_items[0][price_data][recurring][interval]"], "month");
  assert.equal(built.fields["subscription_data[metadata][bouke_cart]"], "creator-growth:-:1");
  assert.equal(Object.keys(built.fields).some((key) => key.startsWith("payment_intent_data")), false);

  const mixed = buildSessionFields(catalog, [{ id: "shorts-starter", quantity: 1 }, { id: "game-day-coverage", quantity: 1 }], SITE);
  assert.equal(mixed.fields.mode, "subscription");
  assert.equal(mixed.fields["line_items[0][price_data][recurring][interval]"], "month");
  assert.equal(Object.hasOwn(mixed.fields, "line_items[1][price_data][recurring][interval]"), false);
});

test("live keys need STRIPE_MODE=live, and live mode refuses test keys", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return stripeResponse(200, { id: "cs_x", url: "https://checkout.stripe.com/c/pay/cs_x" });
  };
  const items = [{ id: "game-day-coverage", quantity: 1 }];
  const missing = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: "", fetchImpl });
  const live = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: "sk_live_1234567890", fetchImpl });
  const testInLive = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: SECRET, stripeMode: "live", fetchImpl });
  const noSite = await createCheckoutSession({ catalog, items, siteUrl: "", secretKey: SECRET, fetchImpl });
  assert.equal(missing.status, 503);
  assert.equal(live.status, 503);
  assert.equal(testInLive.status, 503);
  assert.equal(noSite.status, 503);
  assert.match(missing.error, /coming soon/);
  assert.equal(calls, 0);
  const liveOk = await createCheckoutSession({ catalog, items, siteUrl: SITE, secretKey: "sk_live_1234567890", stripeMode: "live", fetchImpl });
  assert.equal(liveOk.ok, true);
  assert.equal(calls, 1);

  assert.equal(isTestSecret("sk_live_1234567890"), false);
  assert.equal(isTestSecret(SECRET), true);
  assert.equal(isTestSecret("rk_test_abc"), true);
  assert.equal(isLiveSecret("sk_live_1234567890"), true);
  assert.equal(isAllowedSecret("sk_live_1234567890", "test"), false);
  assert.equal(isAllowedSecret("sk_live_1234567890", "live"), true);
  assert.equal(isAllowedSecret(SECRET, "live"), false);
  assert.equal(resolveStripeMode({}), "test");
  assert.equal(resolveStripeMode({ STRIPE_MODE: "true" }), "test");
  assert.equal(resolveStripeMode({ STRIPE_MODE: " Live " }), "live");
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
    items: [{ id: "shorts-starter", variantId: "", quantity: 1 }],
    siteUrl: SITE,
    secretKey: SECRET,
    fetchImpl,
  });
  assert.equal(result.ok, true);
  assert.equal(result.url, "https://checkout.stripe.com/c/pay/cs_test_session");
  assert.equal(seen.url, "https://api.stripe.com/v1/checkout/sessions");
  assert.equal(seen.opts.headers.Authorization, "Bearer " + SECRET);
  assert.equal(seen.opts.headers["Stripe-Version"], "2026-10-28.endive");
  assert.match(seen.opts.body, /unit_amount%5D=40000/);
  assert.match(seen.opts.body, /mode=subscription/);
  assert.match(seen.opts.body, /recurring%5D%5Binterval%5D=month/);

  const badHost = await createCheckoutSession({
    catalog,
    items: [{ id: "game-day-coverage", quantity: 1 }],
    siteUrl: SITE,
    secretKey: SECRET,
    fetchImpl: async () => stripeResponse(200, { url: "https://example.com/phish" }),
  });
  assert.equal(badHost.ok, false);

  const unauthorized = await createCheckoutSession({
    catalog,
    items: [{ id: "game-day-coverage", quantity: 1 }],
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
        amount_total: 15000,
        currency: "usd",
        customer_details: { email: "buyer@example.com" },
        shipping_details: { name: "Example Buyer", address: { country: "US" } },
        metadata: { bouke_cart: "game-day-coverage:-:1" },
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
      line_items: { data: [{ description: "Game-day coverage", quantity: 1, amount_total: 15000, currency: "usd" }] },
    }),
  });
  assert.equal(result.status, 200);
  const order = JSON.parse(lines[0]);
  assert.equal(order.tag, "BOUKE_ORDER");
  assert.equal(order.sessionId, "cs_test_order");
  assert.equal(order.customerEmail, "buyer@example.com");
  assert.equal(order.amountTotal, 15000);
  assert.equal(order.items[0].description, "Game-day coverage");
  assert.equal(order.livemode, false);

  const ignored = await handleStripeEvent({
    rawBody: JSON.stringify({ id: "evt_other", type: "customer.created", data: { object: {} } }),
    signature: sign(secret, JSON.stringify({ id: "evt_other", type: "customer.created", data: { object: {} } }), String(Math.floor(now / 1000))),
    webhookSecret: secret,
    nowMs: now,
    log: () => { throw new Error("ignored events are not orders"); },
  });
  assert.equal(ignored.ignored, true);

  const subLines = [];
  const subEvents = [
    { id: "evt_sub", type: "customer.subscription.created", data: { object: { id: "sub_1", customer: "cus_1", status: "active", currency: "usd", metadata: { bouke_cart: "shorts-starter:-:1" } } } },
    { id: "evt_inv", type: "invoice.paid", data: { object: { id: "in_1", customer: "cus_1", customer_email: "buyer@example.com", status: "paid", amount_paid: 40000, currency: "usd", billing_reason: "subscription_cycle", parent: { subscription_details: { subscription: "sub_1", metadata: { bouke_cart: "shorts-starter:-:1" } } } } } },
    { id: "evt_del", type: "customer.subscription.deleted", data: { object: { id: "sub_1", customer: "cus_1", status: "canceled", metadata: {} } } },
  ];
  for (const ev of subEvents) {
    const raw = JSON.stringify(ev);
    const res = await handleStripeEvent({
      rawBody: raw,
      signature: sign(secret, raw, String(Math.floor(now / 1000))),
      webhookSecret: secret,
      nowMs: now,
      log: (line) => subLines.push(JSON.parse(line)),
      fetchImpl: async () => { throw new Error("subscription events do not fetch"); },
    });
    assert.equal(res.status, 200);
  }
  assert.deepEqual(subLines.map((l) => [l.tag, l.eventType, l.subscriptionId]), [
    ["BOUKE_SUBSCRIPTION", "customer.subscription.created", "sub_1"],
    ["BOUKE_SUBSCRIPTION", "invoice.paid", "sub_1"],
    ["BOUKE_SUBSCRIPTION", "customer.subscription.deleted", "sub_1"],
  ]);
  assert.equal(subLines[1].amountPaid, 40000);
  assert.equal(subLines[1].cart, "shorts-starter:-:1");
  assert.equal(subLines[2].status, "canceled");
});

test("http handlers stay quiet when Stripe is not configured and create a session when it is", async () => {
  const previous = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    STRIPE_MODE: process.env.STRIPE_MODE,
  };
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.VERCEL_URL;
    delete process.env.STRIPE_MODE;
    process.env.SITE_URL = SITE;

    const quiet = await createGet();
    assert.equal(quiet.status, 200);
    const quietBody = await quiet.json();
    assert.equal(quietBody.checkoutAvailable, false);
    assert.match(quietBody.message, /coming soon/);

    const missingPost = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: SITE, "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "game-day-coverage", quantity: 1, priceCents: 1 }] }),
    }));
    assert.equal(missingPost.status, 503);

    const foreign = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: "https://evil.example", "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "game-day-coverage", quantity: 1 }] }),
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
      body: JSON.stringify({ items: [{ id: "game-day-coverage", quantity: 1, priceCents: 1 }] }),
    }));
    assert.equal(started.status, 200);
    const startedBody = await started.json();
    assert.equal(startedBody.url, "https://checkout.stripe.com/c/pay/cs_test_handler");
    assert.equal(posted.split("&").some((part) => part.endsWith("unit_amount%5D=15000")), true);
    assert.equal(posted.split("&").some((part) => part.endsWith("unit_amount%5D=1")), false);

    const readyAgain = await createGet();
    assert.equal((await readyAgain.json()).testMode, true);

    process.env.STRIPE_SECRET_KEY = "sk_live_1234567890abc";
    const liveGet = await createGet();
    assert.equal((await liveGet.json()).checkoutAvailable, false);
    const livePost = await createPost(new Request(SITE + "/api/create-checkout-session", {
      method: "POST",
      headers: { origin: SITE, "content-type": "application/json" },
      body: JSON.stringify({ items: [{ id: "game-day-coverage", quantity: 1 }] }),
    }));
    assert.equal(livePost.status, 503);

    process.env.STRIPE_MODE = "live";
    const liveOn = await (await createGet()).json();
    assert.equal(liveOn.checkoutAvailable, true);
    assert.equal(liveOn.testMode, false);
    process.env.STRIPE_SECRET_KEY = SECRET;
    assert.equal((await (await createGet()).json()).checkoutAvailable, false);
    delete process.env.STRIPE_MODE;

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
