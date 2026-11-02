# QA — BOUKE member site

Date: 2026-10-27 (America/New_York)

## Form backend limitation (publishable truth)

Forms are **not connected** to email, CRM, or any server. Submitting downloads a local `.txt` note or copies text to the clipboard. The UI must **never** claim a message was sent. Contact email is **Unknown** — not invented. Connect a real destination later (mailto with member-supplied address, form service, or fleet inbox) only when the member provides it.

## Checks

| Check | Result | Notes |
| --- | --- | --- |
| Files present under `dist/` | Pass | index.html, styles.css, app.js |
| Required sections present | Pass | Hero, content, ways we help, need-help, business questionnaire, footer |
| No invented proof | Pass | No testimonials/metrics/case studies |
| Form fake-success avoided | Pass | Status copy states download/copy only |
| Local preview server | Pass | See PROJECT-STATUS for URL |
| Desktop visual browser pass | Untested | No headed browser screenshot captured in this install pass; static structure verified by file review |
| Phone / narrow layout | Untested | CSS includes ≤860px single-column rules; not visually verified in a device emulator this pass |
| Motion / reduced-motion | Untested visually | `prefers-reduced-motion` disables chip animation in CSS; not observed in a live browser this pass |
| External font load | Untested offline | Depends on Google Fonts network |
| Publish / production URL | Not deployed by the shop change | Vercel project is the repo root. Root `vercel.json` maps `/` to this `dist/`. Production deploys were blocked on the account as of 2026-11-02. See STORE-SETUP.md |
| Shop pages | Pass, file review plus local render | `shop.html`, `success.html`, `cancel.html`. Example products only |
| Checkout without Stripe keys | Pass, unit test | Friendly coming soon state. No stack trace |
| Server price, not client price | Pass, unit test | `store/store.test.mjs` mocks Stripe |

## Defects found and fixed this pass

- None beyond intentional unfinished form backend (documented, not a defect).
