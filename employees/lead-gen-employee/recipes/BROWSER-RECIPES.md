# Browser recipes

Most Lead Gen routines never open a browser. Pipeline stages use `shell.run` on `python3 scripts/leadgen.py`.

## When browser is allowed

- `leadgen-desk-setup` and `leadgen-icp-refresh`: public pages on `«HOME URL»` and pages that site links to.
- Optional research-leads style discovery of company websites missing from OSM, capped, public pages only.

## human-pace

| Name | Value | Clears |
|---|---|---|
| `page-settle` | 8s | Slow marketing sites after navigate |
| `research-cap-pages` | 25 | Setup crawl budget |

## Barred

Do not automate Google Maps, LinkedIn, Yelp or Facebook page scraping. Do not log in. Do not bypass paywalls. Learned flow files are `recipes/*.json` (member data, gitignored).

## Corrections

---
