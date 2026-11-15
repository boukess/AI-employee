import assert from "node:assert/strict";
import { generateKeyPairSync, createSign } from "node:crypto";
import { test } from "node:test";
import { _resetJwksCache, frontendApiFromKey, verifyClerkToken } from "./clerk.mjs";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "k1", alg: "RS256", use: "sig" };
const env = { CLERK_SECRET_KEY: "sk_test_x", SITE_URL: "https://frbouke.com" };
const fetchImpl = async () => new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
function sign(payload, kid = "k1", key = privateKey) {
  const h = Buffer.from(JSON.stringify({ alg: "RS256", kid, typ: "JWT" })).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const s = createSign("RSA-SHA256"); s.update(h + "." + p);
  return h + "." + p + "." + s.sign(key).toString("base64url");
}
const now = 1_800_000_000_000, sec = now / 1000;

test("publishable key decodes to the frontend API host", () => {
  const pk = "pk_test_" + Buffer.from("example-1.clerk.accounts.dev$").toString("base64");
  assert.equal(frontendApiFromKey(pk), "example-1.clerk.accounts.dev");
  assert.equal(frontendApiFromKey("nope"), "");
});

test("valid token passes; forged, expired and foreign origin tokens fail", async () => {
  _resetJwksCache();
  const good = sign({ sub: "user_1", exp: sec + 60, nbf: sec - 5, azp: "https://frbouke.com" });
  assert.deepEqual(await verifyClerkToken(good, { env, fetchImpl, now }), { userId: "user_1" });
  const other = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;
  assert.equal(await verifyClerkToken(sign({ sub: "user_1", exp: sec + 60 }, "k1", other), { env, fetchImpl, now }), null);
  assert.equal(await verifyClerkToken(sign({ sub: "user_1", exp: sec - 60 }), { env, fetchImpl, now }), null);
  assert.equal(await verifyClerkToken(sign({ sub: "user_1", exp: sec + 60, azp: "https://evil.example" }), { env, fetchImpl, now }), null);
  assert.equal(await verifyClerkToken("garbage", { env, fetchImpl, now }), null);
});
