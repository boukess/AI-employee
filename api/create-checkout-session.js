// Vercel adapter. The shop logic lives in the BOUKE member project so it
// can move with that site. This file stays at the repo root because the
// Vercel project (ai-employee) deploys the repository root and serves /api
// from here. No framework is set on the project.

import { loadCatalog } from "../employees/website-designer-employee/member-projects/bouke/store/catalog.mjs";
import { createCheckoutSession, resolveSiteUrl, isTestSecret, CHECKOUT_UNAVAILABLE } from "../employees/website-designer-employee/member-projects/bouke/store/checkout.mjs";
import { isSameOrigin, json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function GET() {
  const { errors } = loadCatalog();
  const siteUrl = resolveSiteUrl(process.env);
  const checkoutAvailable = errors.length === 0 && Boolean(siteUrl) && isTestSecret(process.env.STRIPE_SECRET_KEY || "");
  return json(200, {
    checkoutAvailable,
    message: checkoutAvailable
      ? "Checkout uses Stripe test mode. Payment details are entered on Stripe, not on this site."
      : CHECKOUT_UNAVAILABLE,
  });
}

export async function POST(request) {
  if (!isSameOrigin(request.url, request.headers.get("origin"))) {
    return json(403, { error: "Open checkout from the BOUKE shop page." });
  }
  const { catalog, errors } = loadCatalog();
  if (!catalog || errors.length) {
    console.error("BOUKE store catalog is not usable", errors);
    return json(503, { error: CHECKOUT_UNAVAILABLE, checkoutAvailable: false });
  }
  let bodyText = "";
  try {
    bodyText = await request.text();
  } catch {
    return json(400, { error: "The cart could not be read." });
  }
  if (bodyText.length > 20000) return json(400, { error: "The cart could not be read." });
  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return json(400, { error: "The cart could not be read." });
  }
  const result = await createCheckoutSession({
    catalog,
    items: body && body.items,
    siteUrl: resolveSiteUrl(process.env),
    secretKey: process.env.STRIPE_SECRET_KEY || "",
  });
  if (!result.ok) {
    return json(result.status, { error: result.error, checkoutAvailable: result.unavailable ? false : undefined });
  }
  return json(200, { url: result.url, sessionId: result.sessionId });
}
