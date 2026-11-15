// Clerk sign in for personnel (renters). Clerk stores accounts, hashes
// passwords, sends sign up emails and runs Google sign in. This module only
// verifies a Clerk session token (RS256 JWT) on the server and looks up the
// account's email. Keys come from the Vercel Clerk integration env vars.

import { createPublicKey, createVerify } from "node:crypto";

export function clerkPublishableKey(env = process.env) {
  return String(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || env.CLERK_PUBLISHABLE_KEY || "").trim();
}

// pk_test_<base64 of "host$"> -> host
export function frontendApiFromKey(pk) {
  const m = /^pk_(test|live)_([A-Za-z0-9+/=_-]+)$/.exec(String(pk || ""));
  if (!m) return "";
  try {
    const host = Buffer.from(m[2], "base64").toString("utf8").replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? host : "";
  } catch {
    return "";
  }
}

function b64urlJson(part) {
  return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
}

let jwksCache = { at: 0, keys: [] };
async function getJwks(env, fetchImpl) {
  if (jwksCache.keys.length && Date.now() - jwksCache.at < 3600000) return jwksCache.keys;
  const secret = String(env.CLERK_SECRET_KEY || "").trim();
  if (!secret) throw new Error("no Clerk secret");
  const res = await fetchImpl("https://api.clerk.com/v1/jwks", { headers: { Authorization: "Bearer " + secret }, signal: AbortSignal.timeout(10000) });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || !Array.isArray(body.keys)) throw new Error("jwks " + res.status);
  jwksCache = { at: Date.now(), keys: body.keys };
  return body.keys;
}
export function _resetJwksCache() { jwksCache = { at: 0, keys: [] }; }

export function allowedOrigins(env = process.env) {
  const out = new Set(["https://frbouke.com", "https://www.frbouke.com"]);
  const site = String(env.SITE_URL || "").trim().replace(/\/$/, "");
  if (site) out.add(site);
  const vercel = String(env.VERCEL_URL || "").trim();
  if (vercel) out.add("https://" + vercel.replace(/^https?:\/\//, ""));
  const branch = String(env.VERCEL_BRANCH_URL || "").trim();
  if (branch) out.add("https://" + branch.replace(/^https?:\/\//, ""));
  return out;
}

// Returns { userId } for a valid token, or null.
export async function verifyClerkToken(token, { env = process.env, fetchImpl = globalThis.fetch, now = Date.now() } = {}) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  let header, payload;
  try { header = b64urlJson(parts[0]); payload = b64urlJson(parts[1]); } catch { return null; }
  if (header.alg !== "RS256" || !header.kid) return null;
  let keys;
  try { keys = await getJwks(env, fetchImpl); } catch { return null; }
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;
  let ok = false;
  try {
    const v = createVerify("RSA-SHA256");
    v.update(parts[0] + "." + parts[1]);
    ok = v.verify(createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(parts[2], "base64url"));
  } catch { ok = false; }
  if (!ok) return null;
  const sec = Math.floor(now / 1000);
  if (typeof payload.exp !== "number" || payload.exp < sec - 5) return null;
  if (typeof payload.nbf === "number" && payload.nbf > sec + 5) return null;
  if (payload.azp && !allowedOrigins(env).has(payload.azp)) return null;
  if (!payload.sub) return null;
  return { userId: payload.sub };
}

export async function clerkUserEmail(userId, { env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const secret = String(env.CLERK_SECRET_KEY || "").trim();
  if (!secret || !/^user_[A-Za-z0-9]+$/.test(userId)) return "";
  try {
    const res = await fetchImpl("https://api.clerk.com/v1/users/" + userId, { headers: { Authorization: "Bearer " + secret }, signal: AbortSignal.timeout(10000) });
    const u = await res.json();
    if (!res.ok || !u) return "";
    const primary = (u.email_addresses || []).find((e) => e.id === u.primary_email_address_id) || (u.email_addresses || [])[0];
    return primary && primary.email_address ? String(primary.email_address) : "";
  } catch {
    return "";
  }
}

export function bearer(request) {
  const h = request.headers.get("authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}
