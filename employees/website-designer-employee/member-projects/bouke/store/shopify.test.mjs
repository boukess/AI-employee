import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { GET } from "../../../../../api/shopify-products.js";
import {
  DEFAULT_STORE_DOMAIN,
  formatPriceRange,
  loadShopifyCatalog,
  normalizeStoreDomain,
  resolveStoreDomain,
} from "./shopify.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const TOKEN = "public-storefront-token";

function page(products, info) {
  return {
    data: {
      products: {
        pageInfo: info || { hasNextPage: false, endCursor: null },
        edges: products.map((node) => ({ node })),
      },
    },
  };
}

function product(overrides) {
  return {
    title: "Field tee",
    handle: "field-tee",
    availableForSale: true,
    featuredImage: { url: "https://cdn.shopify.com/tee.jpg", altText: "Folded tee" },
    priceRange: {
      minVariantPrice: { amount: "48.0", currencyCode: "USD" },
      maxVariantPrice: { amount: "48.0", currencyCode: "USD" },
    },
    ...overrides,
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

test("blank token is coming soon and does not call Shopify", async () => {
  let called = false;
  const result = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: "  " }, async () => {
    called = true;
    return jsonResponse({});
  });
  assert.equal(result.state, "coming_soon");
  assert.deepEqual(result.products, []);
  assert.equal(called, false);
});

test("default store domain is the BOUKE shop host", () => {
  assert.equal(resolveStoreDomain({}), DEFAULT_STORE_DOMAIN);
  assert.equal(normalizeStoreDomain("https://ykpvju-5y.myshopify.com/admin"), DEFAULT_STORE_DOMAIN);
  assert.equal(normalizeStoreDomain("evil.com"), "");
  assert.equal(normalizeStoreDomain("ykpvju-5y.myshopify.com.evil.com"), "");
  assert.equal(resolveStoreDomain({ SHOPIFY_STORE_DOMAIN: "not a host" }), "");
});

test("empty catalog is coming soon", async () => {
  const result = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async () => jsonResponse(page([])));
  assert.equal(result.state, "coming_soon");
});

test("maps products, price ranges, and a handle link", async () => {
  const calls = [];
  const result = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async (url, init) => {
    calls.push({ url, init });
    const body = JSON.parse(init.body);
    if (!body.variables.after) {
      return jsonResponse(page([product({})], { hasNextPage: true, endCursor: "cursor-1" }));
    }
    return jsonResponse(page([
      product({
        title: "Cap",
        handle: "cap",
        onlineStoreUrl: "https://ykpvju-5y.myshopify.com/products/cap",
        availableForSale: false,
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "32.00", currencyCode: "USD" },
          maxVariantPrice: { amount: "36.00", currencyCode: "USD" },
        },
      }),
    ]));
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://ykpvju-5y.myshopify.com/api/2026-10/graphql.json");
  assert.equal(calls[0].init.headers["X-Shopify-Storefront-Access-Token"], TOKEN);
  assert.equal(JSON.parse(calls[1].init.body).variables.after, "cursor-1");
  assert.equal(result.state, "ready");
  assert.equal(result.products[0].title, "Field tee");
  assert.equal(result.products[0].price, "$48.00");
  assert.equal(result.products[0].image, "https://cdn.shopify.com/tee.jpg");
  assert.equal(result.products[0].imageAlt, "Folded tee");
  assert.equal(result.products[0].url, "https://" + DEFAULT_STORE_DOMAIN + "/products/field-tee");
  assert.equal(result.products[0].available, true);
  assert.equal(result.products[1].price, "From $32.00");
  assert.equal(result.products[1].url, "https://ykpvju-5y.myshopify.com/products/cap");
  assert.equal(result.products[1].available, false);
  assert.equal(result.products[1].image, "");
  assert.equal(JSON.stringify(result).includes(TOKEN), false);
});

test("http and graphql failures stay on coming soon", async () => {
  const denied = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async () => jsonResponse({ errors: "no" }, 401));
  assert.equal(denied.state, "coming_soon");
  const broken = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async () => {
    throw new Error("network");
  });
  assert.equal(broken.state, "coming_soon");
  const graphql = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async () => jsonResponse({ errors: [{ message: "nope" }] }));
  assert.equal(graphql.state, "coming_soon");
});

test("unsafe product urls are dropped", async () => {
  const result = await loadShopifyCatalog({ SHOPIFY_STOREFRONT_ACCESS_TOKEN: TOKEN }, async () => jsonResponse(page([
    product({ handle: "../admin", onlineStoreUrl: "javascript:alert(1)", featuredImage: { url: "http://insecure.example/tee.jpg", altText: "" } }),
  ])));
  assert.equal(result.state, "coming_soon");
});

test("formatPriceRange uses From only when the max differs", () => {
  assert.equal(formatPriceRange("10.00", "10.00", "USD"), "$10.00");
  assert.equal(formatPriceRange("10.00", "12.50", "USD"), "From $10.00");
  assert.equal(formatPriceRange("", "12.50", "USD"), "");
});

test("GET returns coming soon when the token is missing and never echoes a token", async () => {
  const previousToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const previousFetch = globalThis.fetch;
  delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return jsonResponse(page([]));
  };
  try {
    const response = await GET();
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.state, "coming_soon");
    assert.deepEqual(body.products, []);
    assert.equal(called, false);
    assert.equal(Object.hasOwn(body, "token"), false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = previousToken;
  }
});

test("GET maps a catalog without leaking the token", async () => {
  const previousToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const previousDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const previousFetch = globalThis.fetch;
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = TOKEN;
  process.env.SHOPIFY_STORE_DOMAIN = DEFAULT_STORE_DOMAIN;
  globalThis.fetch = async () => jsonResponse(page([product({})]));
  try {
    const response = await GET();
    const body = await response.json();
    assert.equal(body.state, "ready");
    assert.equal(body.products.length, 1);
    assert.equal(body.products[0].title, "Field tee");
    assert.equal(JSON.stringify(body).includes(TOKEN), false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    else process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = previousToken;
    if (previousDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = previousDomain;
  }
});

test("every nav page links to Shop and can open it on a phone", () => {
  for (const file of ["index.html", "shop.html", "clothing.html", "success.html", "cancel.html"]) {
    const html = readFileSync(join(dist, file), "utf8");
    assert.match(html, /href="\.\/clothing\.html"[^>]*>Shop</);
    assert.match(html, /class="nav-toggle"/);
    assert.match(html, /src="\.\/nav\.js"/);
    assert.equal(html.includes(TOKEN), false);
  }
  const clothing = readFileSync(join(dist, "clothing.html"), "utf8");
  assert.match(clothing, /A new collection is dropping soon/);
  assert.match(clothing, /src="\.\/clothing\.js"/);
  const packages = readFileSync(join(dist, "shop.html"), "utf8");
  assert.match(packages, /id="shop-app"/);
  assert.match(packages, /src="\.\/shop\.js"/);
});
