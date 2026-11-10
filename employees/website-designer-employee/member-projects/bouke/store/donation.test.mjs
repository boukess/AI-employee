import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDonationFields, createDonationSession, normalizeDonation } from "./donation.mjs";
import { POST, GET } from "../../../../../api/create-donation-session.js";

test("amount is validated on the server", () => {
  assert.equal(normalizeDonation({ amountCents: 99 }).ok, false);
  assert.equal(normalizeDonation({ amountCents: 1000001 }).ok, false);
  assert.equal(normalizeDonation({ amountCents: 10.5 }).ok, false);
  assert.equal(normalizeDonation({ amountCents: "1000" }).ok, false);
  assert.deepEqual(normalizeDonation({ amountCents: 1000 }), { ok: true, amountCents: 1000, monthly: false });
  assert.equal(normalizeDonation({ amountCents: 500, monthly: "yes" }).monthly, false);
});

test("one time donation uses payment mode and the donate button", () => {
  const { fields } = buildDonationFields({ amountCents: 2500, monthly: false }, "https://frbouke.com/x");
  assert.equal(fields.mode, "payment");
  assert.equal(fields.submit_type, "donate");
  assert.equal(fields["line_items[0][price_data][unit_amount]"], "2500");
  assert.equal(fields["metadata[source]"], "bouke-donation");
  assert.equal(fields.success_url, "https://frbouke.com/donate.html?thanks=1&session_id={CHECKOUT_SESSION_ID}");
  assert.ok(!("line_items[0][price_data][recurring][interval]" in fields));
});

test("monthly donation uses subscription mode", () => {
  const { fields } = buildDonationFields({ amountCents: 500, monthly: true }, "https://frbouke.com");
  assert.equal(fields.mode, "subscription");
  assert.equal(fields["line_items[0][price_data][recurring][interval]"], "month");
  assert.ok(!("submit_type" in fields));
  assert.equal(fields["subscription_data[metadata][bouke_cart]"], "donation:monthly:500");
});

test("refuses without an allowed key and never sends a mixed mode key", async () => {
  const r1 = await createDonationSession({ body: { amountCents: 500 }, siteUrl: "https://frbouke.com", secretKey: "" });
  assert.equal(r1.status, 503);
  const r2 = await createDonationSession({ body: { amountCents: 500 }, siteUrl: "https://frbouke.com", secretKey: "sk_live_abc", stripeMode: "test" });
  assert.equal(r2.status, 503);
});

test("returns the Stripe url on success", async () => {
  let sent = "";
  const fetchImpl = async (_url, init) => { sent = init.body; return new Response(JSON.stringify({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" }), { status: 200 }); };
  const r = await createDonationSession({ body: { amountCents: 1000 }, siteUrl: "https://frbouke.com", secretKey: "sk_test_abc", fetchImpl });
  assert.equal(r.ok, true);
  assert.equal(r.url, "https://checkout.stripe.com/c/pay/cs_test_1");
  assert.ok(sent.includes("{CHECKOUT_SESSION_ID}"));
  assert.ok(sent.includes("submit_type=donate"));
});

test("api rejects other origins and bad bodies", async () => {
  const bad = await POST(new Request("https://frbouke.com/api/create-donation-session", { method: "POST", headers: { origin: "https://evil.example" }, body: "{}" }));
  assert.equal(bad.status, 403);
  const junk = await POST(new Request("https://frbouke.com/api/create-donation-session", { method: "POST", body: "not json" }));
  assert.equal(junk.status, 400);
  const info = await (await GET()).json();
  assert.equal(typeof info.checkoutAvailable, "boolean");
});
