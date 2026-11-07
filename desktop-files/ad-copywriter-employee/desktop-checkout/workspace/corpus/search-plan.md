# Meta Ad Library search plan — BOUKE

Country default: US. Active ads, all media. Generated 2026-10-28.

| # | Lens | Query | Why |
|---|---|---|---|
| 1 | Niche | `AI employee` | Phrase ads in this space actually say |
| 2 | Niche | `AI employees` | Plural variant used in BOUKE copy |
| 3 | Offer type | `join the community` | Low-ticket membership / community framing |
| 4 | Offer type | `freelance help` | Matches BOUKE freelance lane |
| 5 | Problem / desire | `hire an AI` | Audience desire language |
| 6 | Problem / desire | `content creation for business` | Content lane |
| 7 | Adjacent | `Claude Code` | Tool-adjacent course/community ads |
| 8 | Adjacent | `AI agents for business` | Nearby offer type (study structure, do not copy) |

## Links (generate with scripts/adlibrary.py)

Run from kit root:

```
python3 scripts/adlibrary.py links "AI employee" "AI employees" "join the community" "freelance help" "hire an AI" "content creation for business" "Claude Code" "AI agents for business" --country US
```

## Collection status

- Method A (automated browse/fetch of Ad Library): **not completed this run** — Facebook Ad Library often blocks headless/fetch providers; do not bypass login/captcha.
- Method B (member paste): **ready** — use the links from `adlibrary.py links` output. Save each paste to `workspace/corpus/pasted/NN-<short-name>.txt`, then `python3 scripts/adlibrary.py parse …`.
- CORPUS.md / PATTERNS.md: **blocked** until pastes or successful browser collection exist. Do not invent ads.

## Method A attempt (2026-10-28)

WebFetch of an Ad Library keyword URL returned the Ad Library chrome + country picker + “Log in” / ad-blocker interstitial — **no ad creatives in the response**. Treat Method A as blocked for automated fetch. Use **Method B** (member paste) with links in `ad-library-links.txt`.
