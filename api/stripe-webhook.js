// Stripe webhook. Verify the signature, then log a BOUKE_ORDER line.
// Orders are viewed in the Stripe Dashboard. Vercel function logs keep a copy.
// See STORE-SETUP.md in the BOUKE member project.

import { loadCatalog } from "../employees/website-designer-employee/member-projects/bouke/store/catalog.mjs";
import { handleStripeEvent } from "../employees/website-designer-employee/member-projects/bouke/store/webhook.mjs";
import { json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function POST(request) {
  const secret = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  if (!secret) {
    console.error("BOUKE webhook is not configured");
    return json(503, { error: "Webhook is not configured." });
  }
  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return json(400, { error: "Webhook body could not be read." });
  }
  const result = await handleStripeEvent({
    rawBody,
    signature: request.headers.get("stripe-signature") || "",
    webhookSecret: secret,
    secretKey: String(process.env.STRIPE_SECRET_KEY || "").trim(),
  });
  if (!result.ok) return json(result.status, { error: result.error });
  return json(200, { received: true, ignored: Boolean(result.ignored) });
}

export async function GET() {
  const { errors } = loadCatalog();
  return json(200, {
    ok: errors.length === 0,
    message: "BOUKE order webhook. Stripe sends events here. This address does not show orders.",
  });
}
