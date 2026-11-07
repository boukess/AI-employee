// Server-side Shopify Storefront API catalog for the BOUKE clothing shop.
// The access token stays in the environment. This module never returns it.

export const STOREFRONT_API_VERSION = "2026-10";
export const DEFAULT_STORE_DOMAIN = "ykpvju-5y.myshopify.com";
export const PAGE_SIZE = 50;
export const MAX_PAGES = 4;

const QUERY = `
  query BoukeClothing($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          title
          handle
          onlineStoreUrl
          availableForSale
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
`;

export function normalizeStoreDomain(value) {
  const raw = String(value || "").trim().toLowerCase();
  const host = raw.replace(/^https?:\/\//, "").split("/")[0].split("?")[0].replace(/\.$/, "");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(host)) return "";
  return host;
}

export function resolveStoreDomain(env) {
  const configured = String((env && env.SHOPIFY_STORE_DOMAIN) || "").trim();
  if (!configured) return DEFAULT_STORE_DOMAIN;
  return normalizeStoreDomain(configured);
}

export function formatPriceRange(minAmount, maxAmount, currencyCode) {
  const min = amountNumber(minAmount);
  if (min === null) return "";
  const max = amountNumber(maxAmount);
  const currency = /^[A-Z]{3}$/.test(String(currencyCode || "")) ? String(currencyCode) : "USD";
  let minText = "";
  let maxText = "";
  try {
    const money = new Intl.NumberFormat("en-US", { style: "currency", currency });
    minText = money.format(min);
    if (max !== null) maxText = money.format(max);
  } catch {
    minText = min.toFixed(2) + " " + currency;
    if (max !== null) maxText = max.toFixed(2) + " " + currency;
  }
  if (max !== null && maxText && Math.abs(max - min) > 0.001) return "From " + minText;
  return minText;
}

export async function loadShopifyCatalog(env, fetchImpl = globalThis.fetch) {
  const token = String((env && env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) || "").trim();
  if (!token) return comingSoon();
  const domain = resolveStoreDomain(env || {});
  if (!domain) return comingSoon();

  const products = [];
  let after = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const payload = await requestPage(fetchImpl, domain, token, after);
    if (!payload) return products.length ? ready(products) : comingSoon();
    const connection = payload.data && payload.data.products;
    const edges = connection && Array.isArray(connection.edges) ? connection.edges : [];
    for (const edge of edges) {
      const product = mapProduct(edge && edge.node, domain);
      if (product) products.push(product);
    }
    const info = (connection && connection.pageInfo) || {};
    if (!info.hasNextPage || typeof info.endCursor !== "string" || !info.endCursor) break;
    after = info.endCursor;
  }
  return products.length ? ready(products) : comingSoon();
}

function comingSoon() {
  return { state: "coming_soon", products: [] };
}

function ready(products) {
  return { state: "ready", products };
}

async function requestPage(fetchImpl, domain, token, after) {
  let response;
  try {
    response = await fetchImpl("https://" + domain + "/api/" + STOREFRONT_API_VERSION + "/graphql.json", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { first: PAGE_SIZE, after },
      }),
    });
  } catch {
    console.error("BOUKE shopify catalog request failed");
    return null;
  }
  if (!response || !response.ok) {
    console.error("BOUKE shopify catalog request failed", response && response.status ? response.status : 0);
    return null;
  }
  try {
    const payload = await response.json();
    if (!payload || payload.errors || !payload.data || !payload.data.products) {
      console.error("BOUKE shopify catalog request failed");
      return null;
    }
    return payload;
  } catch {
    console.error("BOUKE shopify catalog request failed");
    return null;
  }
}

function mapProduct(node, domain) {
  if (!node || typeof node.title !== "string") return null;
  const title = node.title.trim();
  if (!title || title.length > 300) return null;
  const handle = typeof node.handle === "string" ? node.handle.trim() : "";
  const direct = httpsUrl(node.onlineStoreUrl);
  const fallback = /^[a-z0-9][a-z0-9-]*$/i.test(handle)
    ? "https://" + domain + "/products/" + handle
    : "";
  const url = direct || fallback;
  if (!url) return null;
  const image = node.featuredImage ? httpsUrl(node.featuredImage.url) : "";
  const altSource = node.featuredImage && typeof node.featuredImage.altText === "string"
    ? node.featuredImage.altText.trim()
    : "";
  const min = node.priceRange && node.priceRange.minVariantPrice;
  const max = node.priceRange && node.priceRange.maxVariantPrice;
  return {
    title,
    price: formatPriceRange(min && min.amount, max && max.amount, min && min.currencyCode),
    image,
    imageAlt: (altSource || title).slice(0, 200),
    url,
    available: node.availableForSale !== false,
  };
}

function httpsUrl(value) {
  if (typeof value !== "string" || !value || value.length > 2000) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function amountNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
