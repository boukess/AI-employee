import assert from "node:assert/strict";
import { test } from "node:test";
import { checkLogin, makeSession, readSession, sessionCookie, stripeSummary } from "./employee.mjs";

const env = { EMPLOYEE_USER: "TESTUSER", EMPLOYEE_PASS: "test-pass", EMPLOYEE_SESSION_SECRET: "x".repeat(40) };

test("login needs the configured username and exact password", () => {
  assert.equal(checkLogin("testuser", "test-pass", env), true);
  assert.equal(checkLogin("TESTUSER", "wrong", env), false);
  assert.equal(checkLogin("other", "test-pass", env), false);
  assert.equal(checkLogin("TESTUSER", "test-pass", {}), false);
});

test("session cookie round trips and rejects tampering and expiry", () => {
  const v = makeSession(env, 1_000_000_000_000);
  assert.ok(readSession("a=1; bouke_emp=" + v, env, 1_000_000_000_000));
  assert.equal(readSession("bouke_emp=" + v + "x", env, 1_000_000_000_000), null);
  assert.equal(readSession("bouke_emp=" + v, env, 1_000_000_000_000 + 13 * 3600 * 1000), null);
  assert.equal(readSession("bouke_emp=" + v, { ...env, EMPLOYEE_SESSION_SECRET: "y".repeat(40) }, 1_000_000_000_000), null);
  assert.match(sessionCookie(v), /HttpOnly; Secure; SameSite=Strict/);
});

test("stripe summary splits paid sessions by source", async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ has_more: false, data: [
    { id: "a", created: 1794700000, payment_status: "paid", amount_total: 40000, metadata: { source: "bouke-store" }, mode: "subscription" },
    { id: "b", created: 1794700000, payment_status: "paid", amount_total: 2500, metadata: { source: "bouke-donation" }, mode: "payment" },
    { id: "c", created: 1794700000, payment_status: "unpaid", amount_total: 999, metadata: {} },
  ] }), { status: 200 });
  const s = await stripeSummary({ STRIPE_SECRET_KEY: "rk_test_x" }, fetchImpl, 1794757000000);
  assert.equal(s.connected, true);
  assert.equal(s.packages, 400);
  assert.equal(s.donations, 25);
  assert.equal(s.total, 425);
  assert.equal(s.payments, 2);
});
