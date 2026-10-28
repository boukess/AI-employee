# Step 3: Study the corpus

Goal: turn the corpus into rules you can write from. `PATTERNS.md` is your training. Everything you write later cites it, so make it specific to this niche. Generic advice like "use a strong hook" doesn't count.

## How to study

1. Run `python3 scripts/adlibrary.py stats`. Keep the output open.
2. Read `workspace/corpus/CORPUS.md` from the top. The best evidence comes first. Read every **PROVEN** ad closely and skim the rest.
3. Spend most of your attention on what the proven ads share that the short-lived ones don't.
4. Cite your examples by Library ID, so you (and the member) can open them later: `https://www.facebook.com/ads/library/?id=<ID>`.
5. Quote short fragments only (a hook, a headline). Never paste whole ads into PATTERNS.md.

## What to look for

- **Hooks.** The first line, which is all most people read before "See more". Sort them by type: question, bold claim, callout of who it's for, number or result, story opener, contrarian take, "POV", direct offer, curiosity gap.
- **Structure.** The order the body goes in. For example: hook, then problem, then what it is, then a list of benefits, then proof, then offer, then CTA. Or: story, then lesson, then offer. Find 3 to 5 skeletons and count how often each shows up.
- **Length.** Short, medium or long. Which does the niche use, and which do the proven ads use?
- **Headline formulas.** Offer plus price, outcome plus timeframe, "Join [N] [people]", a question, a product name. What length?
- **Descriptions.** Are they used at all? If so, for what: price, risk reversal, format, or a social proof line?
- **Offer framing.** How the price is presented, what's included, what's free, and how urgency is handled.
- **Proof devices.** Numbers, testimonials in the copy, founder credibility, "as seen in", user counts.
- **Language.** The words and phrases the niche uses (`stats` lists the repeated ones), and the words the audience uses.
- **Format and voice.** Emojis, line breaks, lists, caps, first person ("I") vs brand voice ("we").
- **Buttons.** Which call-to-action buttons show up most.
- **Clichés.** What every ad says, which now blends into the feed.
- **Gaps.** What nobody says that this member can honestly say. These are usually the best angles.

## PATTERNS.md template

Save to `workspace/corpus/PATTERNS.md`:

```markdown
# What's working: [niche] on Meta

Studied YYYY-MM-DD. [N] ads from [M] advertisers, [K] proven (30+ days).

## The numbers
(Key lines from `stats` for all ads vs proven ads. Note where they differ.)

## Hooks that open the proven ads
| Type | Example fragment | Ad |
|---|---|---|
| ... | "..." | ID |
(8 to 12 rows, then one line on which types win most.)

## Body structures
1. **[Name]**: hook, then ..., then ... ([count] ads, e.g. ID, ID)
2. ...

## Headline formulas
- [Formula]: "example" (ID). Typical length: ...

## Descriptions
(How and whether they're used.)

## Offer and CTA framing
## Proof devices
## Language bank
(Niche phrases and audience phrases worth echoing. Short fragments only.)

## Clichés to avoid or flip
## Gaps (angles nobody is running)
- [Angle], because [why it's true and credible for this brand]

## Rules for [brand] copy
(5 to 8 rules, each one specific and tied to evidence above. For example:
"Open with the result in the first 60 characters. 9 of 14 proven ads do.")

## Angle menu for this brand
(6 to 10 angles you could write, each one a line: the angle, the hook type, and the proof it needs.)
```

## Report to the member

Show 3 to 5 lines with the most useful findings. Then ask for the creative:

> Here's what's working in your space:
> - [finding 1]
> - [finding 2]
> - [gap you can own]
>
> Ready when you are. Drop your ad creative here (an image or a video). If you're in Claude Code or Codex, you can also put it in `workspace/creatives/`.
