# BOUKE clothing shop

The Shop page (`/clothing.html`) lists products from the Shopify store. The package catalog stays at `/shop.html` and still checks out on Stripe. This file is only the clothing connection.

The page asks `/api/shopify-products` for the catalog. That Vercel function calls the Shopify Storefront API. The access token stays on the server. The browser receives product title, price, image, and a link. It never receives the token.

With no token, a refused token, or zero published products, the function answers `coming_soon` and the page keeps the "new collection is dropping soon" state. It does not show an error.

## Environment variables

Set these on the Vercel project that serves frbouke.com.

- Team: `bouke1`
- Project: `ai-employee`
- Where: Vercel Dashboard, the `ai-employee` project, **Settings**, **Environment Variables**
- Do not put them in `vercel.json`, in git, or in the page

| Name | Value | Required |
| --- | --- | --- |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | The Storefront API public access token from Shopify admin | Yes, before live products can appear |
| `SHOPIFY_STORE_DOMAIN` | `ykpvju-5y.myshopify.com` | No. This host is the default when the variable is empty |

Use the `*.myshopify.com` host. The Storefront API does not live on a public custom domain. Apply the variables to Production (and Preview, if you want preview deployments to load the catalog). Save, then redeploy. A deploy that is already live does not pick up new variables until the next deployment.

Mark the token as Sensitive in Vercel. It is a Storefront token, which Shopify scopes for unauthenticated storefront reads, so it is not a secret Admin key. It still stays out of the repository and out of client JavaScript. Server side means a leaked page source cannot copy it, and the function can be changed later without republishing the token to every visitor.

## Create the Storefront API token

The store is `ykpvju-5y.myshopify.com`. Either path below works. You only need one token. Copy the **Storefront API access token**, not the Admin API token.

### Headless channel

1. In Shopify admin, open **Sales channels**.
2. Add the **Headless** channel if it is not already there.
3. Create a storefront for this shop.
4. Open that storefront and copy its Storefront API access token.
5. Publish each product to that Headless storefront. A product that is only a draft, or only on another channel, will not appear.

### Develop apps

1. In Shopify admin, open **Settings**, then **Apps and sales channels**.
2. Open **Develop apps**. If Shopify asks, allow custom app development.
3. Create an app. Name it something you will recognize, such as BOUKE website.
4. Open **Configuration**. Find **Storefront API integration** and configure it.
5. Enable the scope `unauthenticated_read_product_listings`. Save.
6. Open **API credentials** and install the app if Shopify asks you to install it first.
7. Copy the Storefront API access token.
8. Publish each product to the Online Store channel (or the channel this token can read). Unpublished products stay hidden, and the page keeps showing coming soon.

## Local preview

From `employees/website-designer-employee/member-projects/bouke/dist`:

```bash
python3 -m http.server 8765
```

- `http://127.0.0.1:8765/clothing.html` shows the coming soon state, because this static server has no token and no API.
- `http://127.0.0.1:8765/clothing.html?preview=products` draws three example cards on localhost only. Those graphics are labelled EXAMPLE. They are not live products, and the query does nothing on frbouke.com.

The catalog logic is covered by:

```bash
node --test employees/website-designer-employee/member-projects/bouke/store/shopify.test.mjs
```
