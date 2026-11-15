// Employee area auth and finance summary for the BOUKE site.
// The username, password and signing secret live only in Vercel environment
// variables (EMPLOYEE_USER, EMPLOYEE_PASS, EMPLOYEE_SESSION_SECRET), never in
// the repository or the page. A session is an HMAC signed cookie the browser
// cannot read (HttpOnly) and that expires after 12 hours.

import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "bouke_emp";
const MAX_AGE = 12 * 60 * 60;

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export function authConfigured(env = process.env) {
  return Boolean(env.EMPLOYEE_USER && env.EMPLOYEE_PASS && env.EMPLOYEE_SESSION_SECRET && env.EMPLOYEE_SESSION_SECRET.length >= 32);
}

export function checkLogin(username, password, env = process.env) {
  if (!authConfigured(env)) return false;
  const userOk = safeEqual(String(username || "").trim().toUpperCase(), String(env.EMPLOYEE_USER).trim().toUpperCase());
  const passOk = safeEqual(String(password || ""), String(env.EMPLOYEE_PASS));
  return userOk && passOk;
}

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function makeSession(env = process.env, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ u: env.EMPLOYEE_USER, exp: Math.floor(now / 1000) + MAX_AGE })).toString("base64url");
  return payload + "." + sign(payload, env.EMPLOYEE_SESSION_SECRET);
}

export function readSession(cookieHeader, env = process.env, now = Date.now()) {
  if (!authConfigured(env) || !cookieHeader) return null;
  const match = String(cookieHeader).split(/;\s*/).find((c) => c.startsWith(COOKIE + "="));
  if (!match) return null;
  const [payload, sig] = match.slice(COOKIE.length + 1).split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload, env.EMPLOYEE_SESSION_SECRET))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Math.floor(now / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(value, clear = false) {
  return COOKIE + "=" + (clear ? "" : value) + "; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=" + (clear ? 0 : MAX_AGE);
}

// Stripe: completed Checkout Sessions in the last 30 days, split by source.
// Uses the existing read access of the site's restricted Stripe key.
export async function stripeSummary(env = process.env, fetchImpl = globalThis.fetch, now = Date.now()) {
  const key = String(env.STRIPE_SECRET_KEY || "").trim();
  if (!key) return { connected: false, note: "No Stripe key on the server." };
  const since = Math.floor(now / 1000) - 30 * 86400;
  let url = "https://api.stripe.com/v1/checkout/sessions?limit=100&status=complete&created[gte]=" + since;
  const totals = { packages: 0, donations: 0, other: 0 };
  let count = 0;
  const recent = [];
  for (let page = 0; page < 5 && url; page++) {
    const res = await fetchImpl(url, { headers: { Authorization: "Bearer " + key }, signal: AbortSignal.timeout(15000) });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body) return { connected: false, note: "Stripe refused the read (" + res.status + ")." };
    for (const s of body.data || []) {
      if (s.payment_status !== "paid") continue;
      const cents = Number(s.amount_total || 0);
      const src = s.metadata && s.metadata.source;
      const bucket = src === "bouke-donation" ? "donations" : src === "bouke-store" ? "packages" : "other";
      totals[bucket] += cents;
      count++;
      if (recent.length < 10) recent.push({ date: new Date(s.created * 1000).toISOString().slice(0, 10), amount: cents / 100, kind: bucket, mode: s.mode });
    }
    const last = (body.data || []).at(-1);
    url = body.has_more && last ? url.replace(/&starting_after=[^&]*/, "") + "&starting_after=" + last.id : "";
  }
  return {
    connected: true,
    windowDays: 30,
    payments: count,
    packages: totals.packages / 100,
    donations: totals.donations / 100,
    other: totals.other / 100,
    total: (totals.packages + totals.donations + totals.other) / 100,
    recent,
  };
}

// PayPal: needs PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET on the server and the
// Transaction Search permission on the PayPal app.
export async function paypalSummary(env = process.env, fetchImpl = globalThis.fetch, now = Date.now()) {
  const id = String(env.PAYPAL_CLIENT_ID || "").trim();
  const secret = String(env.PAYPAL_CLIENT_SECRET || "").trim();
  if (!id || !secret) return { connected: false, note: "Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET on Vercel to connect PayPal." };
  const auth = await fetchImpl("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(15000),
  });
  const tok = await auth.json().catch(() => null);
  if (!auth.ok || !tok || !tok.access_token) return { connected: false, note: "PayPal refused the app credentials." };
  const end = new Date(now).toISOString().slice(0, 19) + "Z";
  const start = new Date(now - 30 * 86400000).toISOString().slice(0, 19) + "Z";
  const res = await fetchImpl("https://api-m.paypal.com/v1/reporting/transactions?fields=transaction_info&page_size=100&start_date=" + start + "&end_date=" + end, {
    headers: { Authorization: "Bearer " + tok.access_token },
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body) return { connected: false, note: "PayPal app needs the Transaction Search permission (" + res.status + ")." };
  let total = 0, payments = 0;
  const recent = [];
  for (const t of body.transaction_details || []) {
    const v = Number(t.transaction_info && t.transaction_info.transaction_amount && t.transaction_info.transaction_amount.value);
    if (!isFinite(v) || v <= 0) continue;
    total += v; payments++;
    if (recent.length < 10) recent.push({ date: String(t.transaction_info.transaction_initiation_date || "").slice(0, 10), amount: v, kind: "paypal" });
  }
  return { connected: true, windowDays: 30, payments, total: Math.round(total * 100) / 100, recent };
}
