// Vercel adapter for BOUKE donations. Logic lives in the BOUKE member project.

import { createDonationSession } from "../employees/website-designer-employee/member-projects/bouke/store/donation.mjs";
import { CHECKOUT_UNAVAILABLE, isAllowedSecret, resolveSiteUrl, resolveStripeMode } from "../employees/website-designer-employee/member-projects/bouke/store/checkout.mjs";
import { isSameOrigin, json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function GET() {
  const stripeMode = resolveStripeMode(process.env);
  const available = Boolean(resolveSiteUrl(process.env)) && isAllowedSecret(process.env.STRIPE_SECRET_KEY || "", stripeMode);
  return json(200, {
    checkoutAvailable: available,
    testMode: available ? stripeMode !== "live" : undefined,
    message: available ? "Payment details are entered on Stripe, not on this site." : CHECKOUT_UNAVAILABLE,
  });
}

export async function POST(request) {
  if (!isSameOrigin(request.url, request.headers.get("origin"))) {
    return json(403, { error: "Open checkout from the BOUKE donate page." });
  }
  let text = "";
  try {
    text = await request.text();
  } catch {
    return json(400, { error: "The donation could not be read." });
  }
  if (text.length > 2000) return json(400, { error: "The donation could not be read." });
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { error: "The donation could not be read." });
  }
  const result = await createDonationSession({
    body,
    siteUrl: resolveSiteUrl(process.env),
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeMode: resolveStripeMode(process.env),
  });
  if (!result.ok) return json(result.status, { error: result.error, checkoutAvailable: result.unavailable ? false : undefined });
  return json(200, { url: result.url, sessionId: result.sessionId });
}
