# Step 2: Research (build the corpus)

Goal: collect real ads that are running right now from businesses like the member's. Aim for 60 to 200 unique ads from 8 or more advertisers, with at least 15 that are **proven** (still running after 30+ days). Advertisers don't keep paying for ads that lose money, so the long-running ones are your best evidence of what works.

Source: the public Meta Ad Library at https://www.facebook.com/ads/library/. It shows every active ad on Facebook and Instagram. No login needed.

## 1. Write the search plan

Ad Library keyword search matches words **inside the ads** (and advertiser names). So search for phrases an ad in this niche would actually say, not for how you'd describe the niche.

Plan 4 to 8 searches across these lenses, using `workspace/brand.md`:

| Lens | What to search | Example (online fitness coaching) |
|---|---|---|
| Niche | What the product is called in plain words | "online coaching", "workout program" |
| Offer type | How the offer is framed | "free training", "7-day trial", "join the community" |
| Problem / desire | The audience's words | "lose belly fat", "no time to work out" |
| Competitors | Names from the interview | "[competitor name]" |
| Adjacent | Same offer type, nearby niche | "nutrition coaching" |

Save it as `workspace/corpus/search-plan.md`: one line per search, with the lens and why.

Then get the links:

```
python3 scripts/adlibrary.py links "online coaching" "free training" "lose belly fat"
```

The links show active ads of every type in the member's country. Options: `--country GB` (or `ALL`), `--status all` (includes stopped ads), `--media video`, `--exact` (exact phrase).

## 2. Collect the ads

Use the first method this platform supports.

### Method A: your own browser (if you have a tool that opens web pages)

For each link:

1. Open it and wait for the results to load.
2. Scroll down 3 or 4 times. Each scroll loads about 30 more ads.
3. Get the full page text (for example a "get page text" or "read page" tool).
4. Save it unchanged to `workspace/corpus/pasted/NN-<short-name>.txt` (NN = 01, 02...).
5. Run `python3 scripts/adlibrary.py parse workspace/corpus/pasted/NN-<short-name>.txt --query "<what you searched>"`.

Rules: one page at a time, and no more than about 10 pages per research round. Never log in, never solve a captcha, and never try to get around a block. If the site asks for any of that, stop and switch to Method B.

### Method B: the member copies and pastes (works everywhere)

Send the member this, with the real links filled in. Send 3 to 6 links at a time.

> I need you to grab some ads for me. It takes about a minute per link:
>
> 1. Open this link: [link 1]
> 2. Scroll down 3 or 4 times so more ads load.
> 3. Select everything on the page: **Cmd+A** on Mac, **Ctrl+A** on Windows.
> 4. Copy it (**Cmd+C** or **Ctrl+C**) and paste it here.
>
> Then do the same for: [link 2], [link 3]...
> You can paste them one at a time. It's fine if the paste looks messy, because I only need the text.

For each paste:

1. Save the pasted text unchanged to `workspace/corpus/pasted/NN-<short-name>.txt`.
2. Run `parse` on it (same command as Method A).
3. Reply in one line, for example: "Got 41 ads from 'free training'. Next link when you're ready."

If a paste has no "Library ID" lines, the member probably copied the wrong page. Ask them to open the link again and select all.

### Method C: the member already has ads saved

Swipe files, screenshots, a spreadsheet, or a list of ads they like. Read them and write them as JSON lines (see "Hand-written records" below), then run `add`.

### Check the first parse

After the first `parse`, compare 3 ads in the output file (`workspace/corpus/raw/...jsonl`) against the pasted text. Check that the primary text, headline and description landed in the right fields. If the parser got them wrong, or flagged several ads "confidence low", fix those ads by hand, or write them as hand-written records and run `add`.

## 3. Go deeper on the closest advertisers

```
python3 scripts/adlibrary.py advertisers
```

Pick 3 to 6 advertisers whose offer, audience or brand is closest to the member's. Prefer the ones with proven ads. Pull every active ad each one is running:

- **Method A:** type the advertiser's name into the Ad Library search box and pick them from the dropdown list (the entry with their logo). Then scroll, get the page text, save it, and parse with `--query "advertiser: <name>"`.
- **Method B:** send the member the same steps: "Type **[name]** in the Ad Library search bar, pick it from the dropdown, scroll, select all, copy, paste."

## 4. Remove what doesn't belong

Keyword searches pull in off-target advertisers: huge brands, other industries, unrelated uses of the same words. List them in `workspace/corpus/exclude.txt`, one advertiser name or Library ID per line, with an optional `# reason` after it:

```
Intuit QuickBooks        # enterprise software, different buyer
Google Workspace         # big brand, not comparable
```

Keep advertisers that sell something different but to the **same audience**, or that sell the **same kind of offer** in another niche. Their copy still teaches you something.

## 5. Build and measure

```
python3 scripts/adlibrary.py build
python3 scripts/adlibrary.py stats
```

`build` merges everything, removes duplicates, ranks the ads by how long they've run and how many copies or versions are live, and writes `workspace/corpus/ads.jsonl` and `workspace/corpus/CORPUS.md`. `stats` prints the numbers you'll use in Step 3.

**If the corpus is thin** (fewer than 60 ads, or fewer than 15 proven):

- Add searches from the "adjacent" lens. Same offer type, nearby niche.
- Add `--status all` to include ads that have stopped. An ad that ran 90+ days before stopping was usually a winner.
- Try other English-speaking markets (`--country GB`, `CA`, `AU`) or `--country ALL`.
- Ask the member for 2 or 3 more competitor names.

## 6. Report to the member

Keep it to 3 to 5 lines:

> Done. I studied **[N] ads from [M] advertisers** in your space. **[K]** of them have been running 30+ days, so they're probably working.
> The closest matches to you: [Advertiser 1], [Advertiser 2], [Advertiser 3].
> Now I'll break down what the winners have in common.

Then go to Step 3 (`docs/3-study.md`).

## Hand-written records

For `add`: one JSON object per line, in a `.jsonl` file. Only `primary_text` or `headline` is required. Fill in everything you can see.

```json
{"id": "1234567890", "page_name": "Advertiser name", "primary_text": "Full primary text.\n\nKeep the line breaks.", "headline": "Headline", "description": "Description", "cta": "Learn more", "domain": "example.com", "format": "video", "start_date": "Jun 22, 2026", "variants": 3}
```

- `id`: the Library ID shown on the ad. Leave it out if you don't have it.
- `start_date`: as shown ("Started running on Jun 22, 2026"). Without it, the ad can't count as proven.
- `variants`: the number in "N ads use this creative and text", if shown.
- `format`: image, video, carousel, or unknown.

```
python3 scripts/adlibrary.py add workspace/corpus/hand-01.jsonl --query "what this batch is" --kind manual
```
