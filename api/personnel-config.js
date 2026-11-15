// Public Clerk settings for the personnel page. The publishable key is public by design.
import { clerkPublishableKey, frontendApiFromKey } from "../employees/website-designer-employee/member-projects/bouke/store/clerk.mjs";
import { json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function GET() {
  const publishableKey = clerkPublishableKey();
  const frontendApi = frontendApiFromKey(publishableKey);
  if (!publishableKey || !frontendApi) return json(200, { configured: false });
  return json(200, { configured: true, publishableKey, frontendApi });
}
