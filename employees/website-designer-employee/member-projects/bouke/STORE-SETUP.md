# BOUKE shop setup

How the owner connects Stripe so the example shop can take **test** payments. The shop never asks for a card number or a bank account number. Those stay inside the Stripe Dashboard and on Stripe's hosted checkout page.

This build accepts only test secret keys (`sk_test_...`). A live key is refused and the shop shows "Checkout is not available yet." Real charges need a later code change in `store/checkout.mjs` (`isTestSecret`), plus live keys, a live webhook, and the bank account below. Do that only when BOUKE LLC is ready to sell.

Checked against Stripe's docs on 2026-11-02. Stripe changes eligibility, so open the payment method page in the Dashboard before relying on a limit.

## Where the code lives

| Piece | Path |
| --- | --- |
| Product file (edit this) | `employees/website-designer-employee/member-projects/bouke/store/products.json` |
| Public copy of that file | `dist/products.json` (created by the sync command below) |
| Pricing, checkout, webhook logic | `store/checkout.mjs`, `store/webhook.mjs`, `store/catalog.mjs` |
| Shop pages | `dist/shop.html`, `dist/success.html`, `dist/cancel.html`, `dist/shop.js` |
| Vercel functions | `/api/create-checkout-session` and `/api/stripe-webhook` at the repository root |

The Vercel project `ai-employee` (team bouke1, domain `https://ai-employee-bouke1.vercel.app`) deploys this whole repository with no framework preset. Root `vercel.json` serves the BOUKE site at `/` and leaves `/api` as serverless functions. Do not put secrets in `vercel.json`.

If the site later moves from `dist/` to a `src/` layout, move the `store/` folder with it, point `store/sync-public.mjs` at the new public folder, and update the two imports in `api/create-checkout-session.js` and `api/stripe-webhook.js`.

## 1. Create the Stripe account

1. Open [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Use the email that should own BOUKE LLC's Stripe account.
3. Set the business country to the country where BOUKE LLC is registered. This choice controls Affirm, Klarna, and PayPal. It is hard to change later.
4. Business type: company. Legal name: **BOUKE LLC**.
5. Finish Stripe's own identity and business questions. Stripe collects those on Stripe's site, not on the BOUKE website.
6. Leave the Dashboard in **Test mode** (the switch in the top bar). Test mode and live mode are separate. Keys, webhooks, and payments do not cross over.

## 2. Connect the bank account for payouts

Do this in the Stripe Dashboard when you are ready for live payouts. Test mode does not pay out to a bank. There is no bank form on the BOUKE site. Do not put the account number in git, in Vercel, or in a chat.

1. In the Dashboard, open **Settings** (the gear).
2. Open **Bank accounts and scheduling**, or the payouts / bank accounts screen if Stripe labels it that way. It is the same place: the business bank account Stripe pays out to.
3. Add the BOUKE LLC bank account. Stripe may verify it with small deposits.
4. Set the payout schedule you want.
5. Live payouts also require Stripe to finish activating the account (business details and the identity check Stripe shows). Test checkout does not wait on the bank.

## 3. Turn on payment methods

Checkout does **not** send a fixed list of payment methods. Stripe decides from the methods you enable in the Dashboard, plus the cart currency, amount, and the customer's country. If a method is off or the cart is not eligible, Stripe hides it. Checkout still opens for the methods that are eligible. Do not add `payment_method_types` in code. Naming PayPal on a US account can make session creation fail for every payment method.

Path: Dashboard, **Settings**, **Payment methods**. Turn each one on while **Test mode** is selected if Stripe shows a separate test configuration. Then repeat in live mode when you go live.

### Card, Apple Pay, and Google Pay

Cards are on for Checkout by default. Apple Pay and Google Pay are wallets on top of card. They show on Stripe's hosted page when the method is enabled (on by default) and the browser or device supports them. You do not register `ai-employee-bouke1.vercel.app` for Apple Pay for this shop, because the payment sheet runs on Stripe's domain. Register a domain only if you later embed a card form on your own site. This shop does not do that.

### PayPal

Enable PayPal on the payment methods screen. For a live PayPal charge, Stripe also asks you to connect a PayPal business account. Test mode can show PayPal without that connection.

As of Stripe's PayPal page on 2026-11-02, PayPal processed through Stripe is offered to businesses in these countries: AT, BE, BG, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GR, HR, IE, IT, LI, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK. The United States is not on that list. Customers can be worldwide, and USD is a supported currency, but the **business location** has to be one of those countries. If BOUKE LLC's Stripe account is in the US, PayPal may not appear. Checkout still works for card and the other methods you enabled. Stripe's page points US accounts that want PayPal at a separate "PayPal custom payment method", which this shop does not implement.

PayPal has no extra minimum of its own. Stripe's usual card minimums apply (about 0.50 USD).

### Affirm

Enable Affirm on the payment methods screen. Stripe only shows it when the account is eligible.

As of Stripe's Affirm page on 2026-11-02:

- Business location: United States or Canada. Great Britain is a private preview.
- Customer location: same country as the business. Affirm does not do cross border. A US business selling to a Canadian address will not see Affirm on that payment.
- Currency: `usd` or `cad`, and it should be the business's domestic currency.
- Transaction limits published there: minimum **35.00 USD**, maximum **30,000.00 USD**.
- US options on that page: Pay in 30 for about 35 to 50 USD, Pay in 4 for about 50 to 500 USD, monthly installments from about 100 USD up to 30,000 USD. Canada starts Pay in 4 around 50 CAD.
- One time payments only. This shop already uses one time Checkout (`mode=payment`).

The example field print is 64.00 USD so one item can fall in the Pay in 4 range. The example tee is 36.00 USD, just over the 35 USD minimum. The example digital notes are 8.00 USD, under the Affirm minimum, so Affirm stays hidden until the cart is large enough.

### Klarna

Enable Klarna on the payment methods screen. Read Klarna's rules in the Dashboard. Klarna does not support B2B payments.

As of Stripe's Klarna page on 2026-11-02, a US business can offer Klarna to US customers in USD (other countries are domestic too: the business country has to match the customer country outside Europe). US amount bands on that page:

| Option | About |
| --- | --- |
| Pay in full | 0 to 4,000 USD |
| Pay later | 5 to 1,000 USD |
| Pay in 4 | 1 to 2,000 USD |
| Financing | 45 to 10,000 USD |

US state limits on that page: Pay later is not offered in Montana, New Mexico, or Hawaii. Pay in 4 is not offered in New Mexico or Hawaii. Financing is not offered in Iowa, West Virginia, or Massachusetts. Among US territories, Puerto Rico is the one Klarna lists for all options.

The 8.00 USD example can qualify for Klarna pay later (the 5 USD floor) even when it is too small for Affirm.

## 4. Environment variables on Vercel

Project: **ai-employee**. Team: **bouke1**. Settings, then **Environment Variables**. Add:

| Name | Value | Required |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Secret key from Developers, API keys, with Test mode on. It starts with `sk_test_`. | Yes |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from the webhook endpoint. It starts with `whsec_`. | Yes, for the order log |
| `SITE_URL` | `https://ai-employee-bouke1.vercel.app` with no trailing slash | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_test_...`) | No. This shop does not use Stripe.js |

Apply them to Production and Preview. Do not paste the secret key into the repository. `.env.example` lists the names with empty values. A local `.env` is gitignored.

`SITE_URL` is how success and cancel URLs are built (`/success.html` and `/cancel.html`). If it is missing, Vercel fills in `VERCEL_URL` for that deployment. Set `SITE_URL` so buyers return to the public domain.

Saving variables does not change running code until the next deployment. This repository's latest production deployments were **BLOCKED** on 2026-11-02 with Vercel's account configuration error, and `https://ai-employee-bouke1.vercel.app` returned NOT_FOUND. Resolve that in the Vercel account before expecting the shop to appear. Do not change other project settings for this shop. Root directory stays the repository root.

Until the secret key and `SITE_URL` are present, the product grid still renders and the checkout button says the store is coming soon. The page does not show a stack trace.

## 5. Webhook

1. Dashboard, Test mode on.
2. Developers, **Webhooks**, **Add endpoint**.
3. Endpoint URL: `https://ai-employee-bouke1.vercel.app/api/stripe-webhook`
4. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
5. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Redeploy after the variable is saved, then send a test checkout (not only the Dashboard's generic test event) so the payload includes the cart metadata.

The function checks the `Stripe-Signature` header (HMAC SHA256 of `timestamp.rawBody`, five minute tolerance) before it trusts the body. A bad signature gets HTTP 400. A missing secret gets HTTP 503 and nothing is logged as an order.

Each accepted order event writes one JSON line to the Vercel function log, tagged `BOUKE_ORDER`. It includes the Stripe session id, amount, currency, email, shipping address when Stripe sent one, the cart metadata, and line items when the session retrieve succeeds. The log is a copy. It is not a database.

## 6. See orders

The Stripe Dashboard is the source of truth.

1. Test mode on.
2. **Payments**, or Checkout sessions under Payments.
3. Open a payment. Metadata `bouke_cart` is a compact list of `productId:variantId:quantity`.

The Vercel copy: project **ai-employee**, **Logs**, filter `BOUKE_ORDER`. There is no password protected admin page on the site.

## 7. Add or edit products

Edit `store/products.json` only. Then copy it to the public file:

```bash
node employees/website-designer-employee/member-projects/bouke/store/sync-public.mjs
```

Prices are integer cents. `6400` is 64.00 USD. The server recalculates every checkout from this file. A price typed in the browser is ignored.

| Field | Meaning |
| --- | --- |
| `currency` | `usd` today. Changing it changes Affirm and Klarna eligibility. |
| `shippingCountries` | Countries Stripe may collect a shipping address for. Default `US` and `CA`. |
| `maxQuantity` | Maximum quantity of one line. Default 10. |
| `id` | Lowercase slug, unique. |
| `example` | `true` shows the "Example placeholder" badge. Set `false` only when the text is a real product. |
| `lane` | Short label such as photography, sports, lifestyle. |
| `name`, `description` | Shown on the shop and on Stripe Checkout. Keep the example wording until the goods are real. |
| `priceCents` | Whole cents, at least 50. |
| `shippable` | `true` collects a shipping address when that product is in the cart. `false` does not, if the cart is only digital. |
| `images` | Paths under `dist/`, such as `images/example-field-print.svg`. The current files are labelled graphics, not photographs. |
| `variants` | Optional. Each needs `id` and `label`. Optional `priceCents` replaces the product price for that option. Use `[]` when there are no options. |

The three shipped products are placeholders. They are not real BOUKE goods, and no digital file is attached to "EXAMPLE: Digital notes".

Run the tests after an edit:

```bash
node --test employees/website-designer-employee/member-projects/bouke/store/store.test.mjs
```

The test fails if `dist/products.json` does not match `store/products.json`.

## 8. Try a test payment

1. Deploy with the test key and `SITE_URL` set.
2. Open `/shop.html`.
3. Add the example field print. Continue to Stripe.
4. Pay with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC, any postal code. Use Stripe's test mode prompts for Affirm, Klarna, or PayPal. Do not use a real card.
5. You should land on `/success.html`. Canceling lands on `/cancel.html` and keeps the cart in this browser.
6. Confirm the payment in the Dashboard, test mode.

## Local preview without Stripe

From `employees/website-designer-employee/member-projects/bouke/dist`:

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/shop.html`. The grid, detail, and cart work. Checkout stays on "coming soon" because the API and keys are not there. That is expected.

Full checkout locally needs the Vercel CLI (`vercel dev`) with the same env vars in a gitignored `.env`. This repository does not require that for the tests. The tests mock Stripe.
