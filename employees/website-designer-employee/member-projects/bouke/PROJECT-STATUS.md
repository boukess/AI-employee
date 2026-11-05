# Project status — BOUKE

- Brand slug: `bouke`
- Status: **Site draft, package shop (Stripe), and clothing shop (Shopify)**
- Publishable path: `member-projects/bouke/dist/`
- Records: BRAND-BRIEF, DESIGN-BRIEF, ASSET-MANIFEST, QA, STORE-SETUP, SHOPIFY-SETUP (this folder)
- Preview: serve `dist/` with a static server (see below). Clothing shop: `/clothing.html`. Packages: `/shop.html`
- Blockers: Contact email Unknown; no logo; no member content posts yet; form backend unfinished by design; Shopify storefront token is not in the repo (the clothing page stays on coming soon until it is set; see SHOPIFY-SETUP.md)
- Next: Member review; replace example products; connect Stripe test keys on Vercel (see STORE-SETUP); optional connect email/form backend; add real content cards
- CoS: Parent will FYI Chief of Staff

## Preview how-to

From the kit root or this folder:

```bash
cd member-projects/bouke/dist
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

Or: `npx --yes serve -l 8765 .` inside `dist/`.
