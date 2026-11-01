# Method B — Meta Ad Library paste checklist (BOUKE)

Date: 2026-10-28 (America/New_York)

Automated fetch (Method A) still returns Ad Library chrome + “Log in” / “Turn off ad blocker” with **no ad creatives**. Use member paste. Save each paste unchanged to `workspace/corpus/pasted/NN-<short-name>.txt`, then:

```
python3 scripts/adlibrary.py parse workspace/corpus/pasted/NN-<short-name>.txt --query "<exact search phrase>"
```

## How to paste (about 1 minute per link)

1. Open the link in your normal browser (not an ad-blocked / headless session if possible).
2. Scroll down 3–4 times so more ads load.
3. Select all (`Cmd+A` / `Ctrl+A`), copy, paste into chat (or drop the text into the `pasted/` file).
4. Messy paste is fine. Need lines that look like Library IDs / ad cards.

Do **3–6 links** in the first batch (batch A). Batch B after those are parsed.

## Batch A (start here)

| # | File slug | Query | Link |
|---|-----------|-------|------|
| 01 | `01-ai-employee.txt` | AI employee | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=AI%20employee&search_type=keyword_unordered |
| 02 | `02-ai-employees.txt` | AI employees | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=AI%20employees&search_type=keyword_unordered |
| 03 | `03-hire-an-ai.txt` | hire an AI | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=hire%20an%20AI&search_type=keyword_unordered |
| 04 | `04-ai-agents-for-business.txt` | AI agents for business | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=AI%20agents%20for%20business&search_type=keyword_unordered |
| 05 | `05-claude-code.txt` | Claude Code | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=Claude%20Code&search_type=keyword_unordered |
| 06 | `06-content-creation-for-business.txt` | content creation for business | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=content%20creation%20for%20business&search_type=keyword_unordered |

## Batch B (after Batch A)

| # | File slug | Query | Link |
|---|-----------|-------|------|
| 07 | `07-freelance-help.txt` | freelance help | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=freelance%20help&search_type=keyword_unordered |
| 08 | `08-join-the-community.txt` | join the community | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=join%20the%20community&search_type=keyword_unordered |

## After pastes

1. `parse` each file (command above).
2. Spot-check 3 ads in `workspace/corpus/raw/` vs paste.
3. `python3 scripts/adlibrary.py advertisers` → fill `exclude.txt` for off-target.
4. `python3 scripts/adlibrary.py build` then `stats`.
5. Write `PATTERNS.md` (Step 3). Do not invent ads or proof.

## Still needed from member (not inventable)

- Single offer for first ads + landing URL (asked in chat; widget pending)
- Price/terms if any
- First creative (image/video) before Steps 4–5 copy
