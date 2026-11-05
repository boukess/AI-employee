// Vercel adapter for the BOUKE clothing catalog.
// SHOPIFY_STOREFRONT_ACCESS_TOKEN is read here and is not sent to the browser.
// With no token, or an empty Shopify catalog, the response is a coming soon state.

import { loadShopifyCatalog } from "../employees/website-designer-employee/member-projects/bouke/store/shopify.mjs";
import { json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function GET() {
  const catalog = await loadShopifyCatalog(process.env);
  return json(200, {
    state: catalog.state,
    products: catalog.products,
  });
}
