// Product catalog for the BOUKE shop.
// Edit store/products.json, then run: node store/sync-public.mjs
// so the static shop page (dist/products.json) matches this file.
// Checkout always prices from this file, never from the browser.
// If the site moves from dist/ to a src/ layout, keep this folder together
// and update sync-public.mjs plus the root api/ adapters.

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const CATALOG_FILE = join(HERE, "products.json");

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCatalog(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== "object") {
    return ["Catalog must be a JSON object."];
  }
  if (!/^[a-z]{3}$/.test(catalog.currency || "")) {
    errors.push("currency must be a 3 letter lowercase code, for example usd.");
  }
  if (!Array.isArray(catalog.shippingCountries) || catalog.shippingCountries.length === 0) {
    errors.push("shippingCountries must list at least one 2 letter country code.");
  } else {
    catalog.shippingCountries.forEach((code, i) => {
      if (!/^[A-Z]{2}$/.test(code)) errors.push("shippingCountries[" + i + "] must be a 2 letter uppercase code.");
    });
  }
  if (!Number.isInteger(catalog.maxQuantity) || catalog.maxQuantity < 1 || catalog.maxQuantity > 99) {
    errors.push("maxQuantity must be a whole number from 1 to 99.");
  }
  if (!Array.isArray(catalog.products) || catalog.products.length === 0) {
    errors.push("products must be a non-empty list.");
    return errors;
  }
  const seen = new Set();
  catalog.products.forEach((product, i) => {
    const where = "products[" + i + "]";
    if (!product || typeof product !== "object") {
      errors.push(where + " must be an object.");
      return;
    }
    if (!ID_RE.test(product.id || "")) errors.push(where + ".id must be a lowercase slug.");
    if (product.id && seen.has(product.id)) errors.push(where + ".id is duplicated.");
    if (product.id) seen.add(product.id);
    if (typeof product.name !== "string" || !product.name.trim()) errors.push(where + ".name is required.");
    if (typeof product.description !== "string" || !product.description.trim()) errors.push(where + ".description is required.");
    if (typeof product.example !== "boolean") errors.push(where + ".example must be true or false.");
    if (typeof product.shippable !== "boolean") errors.push(where + ".shippable must be true or false.");
    if (!Number.isInteger(product.priceCents) || product.priceCents < 50 || product.priceCents > 99999999) {
      errors.push(where + ".priceCents must be a whole number of cents from 50 to 99999999.");
    }
    if (!Array.isArray(product.images) || product.images.some((src) => typeof src !== "string" || !src.trim())) {
      errors.push(where + ".images must be a list of file paths.");
    }
    if (!Array.isArray(product.variants)) {
      errors.push(where + ".variants must be a list (use [] when there are no options).");
      return;
    }
    const variantIds = new Set();
    product.variants.forEach((variant, v) => {
      const at = where + ".variants[" + v + "]";
      if (!variant || typeof variant !== "object") {
        errors.push(at + " must be an object.");
        return;
      }
      if (!ID_RE.test(variant.id || "")) errors.push(at + ".id must be a lowercase slug.");
      if (variant.id && variantIds.has(variant.id)) errors.push(at + ".id is duplicated.");
      if (variant.id) variantIds.add(variant.id);
      if (typeof variant.label !== "string" || !variant.label.trim()) errors.push(at + ".label is required.");
      if (variant.priceCents !== undefined && (!Number.isInteger(variant.priceCents) || variant.priceCents < 50)) {
        errors.push(at + ".priceCents must be a whole number of cents, at least 50, when set.");
      }
    });
  });
  return errors;
}

function readCatalogFile() {
  try {
    return require("./products.json");
  } catch {
    // The Vercel file tracer follows require(). If the bundle layout differs, read the file directly.
  }
  const candidates = [
    CATALOG_FILE,
    join(process.cwd(), "employees/website-designer-employee/member-projects/bouke/store/products.json"),
  ];
  for (const path of candidates) {
    try {
      return JSON.parse(readFileSync(path, "utf8"));
    } catch {
      // Try the next path.
    }
  }
  return null;
}

export function loadCatalog() {
  const catalog = readCatalogFile();
  if (!catalog) return { catalog: null, errors: ["Product catalog file could not be read."] };
  return { catalog, errors: validateCatalog(catalog) };
}
