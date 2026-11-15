// Employee finance summary. Only answers with a valid session cookie.
import { readSession, stripeSummary, paypalSummary } from "../employees/website-designer-employee/member-projects/bouke/store/employee.mjs";
import { json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function GET(request) {
  if (!readSession(request.headers.get("cookie"))) return json(401, { error: "Sign in first." });
  const safe = (p) => p.catch(() => ({ connected: false, note: "Could not reach the service." }));
  const [stripe, paypal] = await Promise.all([safe(stripeSummary()), safe(paypalSummary())]);
  return json(200, {
    asOf: new Date().toISOString(),
    stripe,
    paypal,
    quickbooks: { connected: false, note: "QuickBooks needs an OAuth app. Ask Claude to connect it." },
  });
}
