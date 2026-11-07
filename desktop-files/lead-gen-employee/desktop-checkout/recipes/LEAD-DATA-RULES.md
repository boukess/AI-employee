# Lead data rules

Standing rules every Lead Gen routine follows. Source: kit recipes (not a global skill).

# Lead data rules

## Honesty of data
- Every company row has a `source` and a `source_ref` (OSM id, Places id, Apollo id, CSV filename, or the URL it was found on). No row without provenance.
- Every email carries `email_source` and `email_confidence`. Crawled from the business's own site: 80 to 85. Provider-supplied: the provider's confidence. Pattern-guessed: 35, and it stays flagged `pattern` forever.
- Never present a guessed email as found. Never mark anything `valid` without a verifier result.
- `invalid` and `do_not_contact` never export, never push. Suppressed domains drop the whole company.
- A crawled email on someone else's domain (the web agency in the footer, a WordPress author, a parent company) is `third_party` and never exports or pushes. It is not the business's contact.
- Counts in reports come from `leadgen status`, not from memory.

## Respect for the sources
- The crawler honors robots.txt, fetches at most 6 pages per site, identifies itself in the User-Agent, and never logs in or bypasses paywalls.
- No scraping of Google Maps, LinkedIn, Yelp, or Facebook. Use their APIs (Places) or skip.
- Free public services (Overpass, Nominatim) are shared. One query at a time, respect rate limits, retry with a wait, never hammer.

## Compliance (business outreach)
- **US (CAN-SPAM):** B2B cold email is allowed. Every send needs a real postal address, an honest subject, and a working unsubscribe. That is the sending tool's job; this project only builds the list.
- **Canada (CASL):** stricter. Only contact addresses conspicuously published by the business itself with no opt-out statement, and only about their business role. Prefer role mailboxes published on the site.
- **UK / EU (PECR, GDPR):** B2B outreach to corporate addresses is generally possible under legitimate interest, with an opt-out in every message. Sole traders and personal webmail addresses are treated like consumers. Keep a record of the source (this project does) so interest can be documented.
- **Australia (Spam Act):** business addresses published publicly can be contacted about relevant business matters; still need identification and unsubscribe.
- When the ICP includes a country not listed here, say so and recommend the user check local rules before sending.

## Cost discipline
- Every paid stage has a cap flag (`--max-requests`, `--max-credits`). Defaults are the budget. Raising a cap is a user decision; state the estimated cost first.
- Verify only what will be exported. Enrich only qualified companies.

## Scope
- This employee finds and qualifies leads and hands them off. It never sends email or SMS. Pushing to a tool is the last step and always goes dry-run then confirm.

## Corrections

---
