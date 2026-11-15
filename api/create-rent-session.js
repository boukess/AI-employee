// Vercel adapter for renters paying BOUKE LLC. Logic lives in the BOUKE member project.
import { createRentSession } from "../employees/website-designer-employee/member-projects/bouke/store/rent.mjs";
import { CHECKOUT_UNAVAILABLE, isAllowedSecret, resolveSiteUrl, resolveStripeMode } from "../employees/website-designer-employee/member-projects/bouke/store/checkout.mjs";
import { isSameOrigin, json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";
import { bearer, clerkUserEmail, verifyClerkToken } from "../employees/website-designer-employee/member-projects/bouke/store/clerk.mjs";

export async function GET() {
  const mode = resolveStripeMode(process.env);
  const available = Boolean(resolveSiteUrl(process.env)) && isAllowedSecret(process.env.STRIPE_SECRET_KEY || "", mode);
  return json(200, { checkoutAvailable: available, testMode: available ? mode !== "live" : undefined, message: available ? "Card and bank details are entered on Stripe, not on this site." : CHECKOUT_UNAVAILABLE });
}

export async function POST(request) {
  if (!isSameOrigin(request.url, request.headers.get("origin"))) return json(403, { error: "Open checkout from the BOUKE rent page." });
  const who = await verifyClerkToken(bearer(request));
  if (!who) return json(401, { error: "Sign in to your personnel account to pay rent." });
  let body;
  try { body = JSON.parse((await request.text()).slice(0, 2000)); } catch { return json(400, { error: "The payment could not be read." }); }
  const email = await clerkUserEmail(who.userId);
  const result = await createRentSession({ body, payer: { userId: who.userId, email }, siteUrl: resolveSiteUrl(process.env), secretKey: process.env.STRIPE_SECRET_KEY || "", stripeMode: resolveStripeMode(process.env) });
  if (!result.ok) return json(result.status, { error: result.error, checkoutAvailable: result.unavailable ? false : undefined });
  return json(200, { url: result.url, sessionId: result.sessionId });
}
