import assert from "node:assert/strict";
import { test } from "node:test";
import { buildRentFields, cleanReference, createRentSession, normalizeRent } from "./rent.mjs";

test("amount and reference are validated on the server", () => {
  assert.equal(normalizeRent({ amountCents: 99, reference: "Unit 2" }).ok, false);
  assert.equal(normalizeRent({ amountCents: 2000001, reference: "Unit 2" }).ok, false);
  assert.equal(normalizeRent({ amountCents: 12.5, reference: "Unit 2" }).ok, false);
  assert.equal(normalizeRent({ amountCents: 120000, reference: " " }).ok, false);
  assert.deepEqual(normalizeRent({ amountCents: 120000, reference: "  Unit   2B " }), { ok: true, amountCents: 120000, reference: "Unit 2B" });
  assert.equal(cleanReference("<b>x</b>"), "b x /b");
});

test("rent session is one time, labeled and tagged", () => {
  const { fields } = buildRentFields({ amountCents: 95000, reference: "Unit 4" }, "https://frbouke.com");
  assert.equal(fields.mode, "payment");
  assert.equal(fields["metadata[source]"], "bouke-rent");
  assert.equal(fields["metadata[rent_reference]"], "Unit 4");
  assert.equal(fields["line_items[0][price_data][unit_amount]"], "95000");
  assert.equal(fields.success_url, "https://frbouke.com/employee.html?paid=1&session_id={CHECKOUT_SESSION_ID}#pay-rent");
  const withPayer = buildRentFields({ amountCents: 95000, reference: "Unit 4" }, "https://frbouke.com", { userId: "user_abc", email: "renter@example.com" }).fields;
  assert.equal(withPayer.customer_email, "renter@example.com");
  assert.equal(withPayer["metadata[clerk_user]"], "user_abc");
});

test("refuses without an allowed key and returns the Stripe url with one", async () => {
  assert.equal((await createRentSession({ body: { amountCents: 100, reference: "A1" }, siteUrl: "https://frbouke.com", secretKey: "" })).status, 503);
  const fetchImpl = async () => new Response(JSON.stringify({ id: "cs_test_r", url: "https://checkout.stripe.com/c/pay/cs_test_r" }), { status: 200 });
  const r = await createRentSession({ body: { amountCents: 100000, reference: "Unit 1" }, siteUrl: "https://frbouke.com", secretKey: "sk_test_x", fetchImpl });
  assert.equal(r.url, "https://checkout.stripe.com/c/pay/cs_test_r");
});
