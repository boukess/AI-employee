# Step 5: Write, check, deliver

Goal: three ready-to-paste variations of primary text, headline and description for one creative. Each takes a clearly different angle, and each is grounded in what's working in the corpus.

Read `docs/meta-playbook.md` before your first write in a session.

## 1. Pick three angles

Pull angles from the "Angle menu" in `workspace/corpus/PATTERNS.md`. The three variations must differ on **all** of these:

| | Variation 1 | Variation 2 | Variation 3 |
|---|---|---|---|
| Angle | Continues the creative's own angle | A different angle | A third angle |
| Hook type | e.g. demo or result | e.g. problem or question | e.g. offer or contrarian |
| Length | Match the proven norm | Long (400+ characters) or medium | Short (about 150 characters or less) |
| Reader | Main audience | A specific slice of the audience | Another slice, or the skeptic |

Angle ideas: the result, the pain, the objection flipped, proof or social proof, a story (founder or customer), the offer or value stack, identity ("for people who..."), contrarian, comparison with the usual alternative, specificity (one concrete detail), curiosity, and real timeliness (a launch, a new feature).

Prefer angles from the "Gaps" section when the brand can back them up. Those are the ones competitors aren't running.

## 2. Write

**Primary text**

- The first 125 characters must work on their own, because that's all that shows before "See more" in feed. For 9:16 video in Reels, assume only about 70 characters show. The hook goes first, always.
- After the hook: one idea per line, with blank lines between short paragraphs. People skim on phones.
- Be specific: real numbers, names and details from `brand.md`. Specifics beat adjectives.
- Talk to one person ("you"). But never assert something about the reader's health, money, body, religion, age or relationships (see the playbook).
- End with one clear next step that matches the button and the page the click lands on.
- Use emojis, check-mark lists and caps only if the brand voice allows them **and** the corpus uses them.

**Headline** (shows under the creative, next to the button)

- 40 characters at most. Aim for 27 or less when you can.
- It closes the sale: the offer, the outcome, or the price.
- It must work with **any** of the three primary texts, because Meta mixes and matches text options. No "As I said above...".

**Description** (shows under the headline on some placements only)

- 30 characters at most. Aim for 27 or less.
- It supports the headline: the price, a risk reversal ("Cancel anytime"), the format, or a short proof line.
- Never put critical information only in the description, because many placements hide it.

**Button**: suggest one of Meta's call-to-action buttons (Learn more, Sign up, Shop now, Subscribe, Get offer, Book now, Download, Apply now, Contact us, and so on). Match what the landing page does.

## 3. Self-edit before you run the checker

- **Fact check:** every number, price and claim appears in `brand.md`, or is marked `[NEED: ...]`.
- **Read it out loud** in the member's voice. Rewrite anything they wouldn't say.
- **Cut about 20%.** Keep a line only if removing it would lose something.
- **Diversity:** the three first lines should feel like three different ads, not three edits of one ad.
- **Corpus:** borrow the structure, not the words.

## 4. The copy file

Save to `workspace/copy/YYYY-MM-DD-<creative-name>.md`. Use exactly this shape, because `checkcopy.py` reads it:

````markdown
# Ad copy: <creative name>

Brand: <name> | Written: YYYY-MM-DD | Corpus: <N> ads, <K> proven

## Creative read
- **File:** ...
- (the rest of the creative read from docs/4-creative.md)

## Variation 1: <angle name>
*Hook type:* ... | *Reader:* ... | *Borrowed from the corpus:* <pattern> (ad <ID>, ad <ID>)

**Primary text**
```text
...
```

**Headline**
```text
...
```

**Description**
```text
...
```

**Button:** Learn more

**Why this should work:** one or two lines tied to the corpus evidence.

## Variation 2: <angle name>
(same shape)

## Variation 3: <angle name>
(same shape)

## Setting it up in Ads Manager
(paste the setup note below)

## Notes
- Checker warnings you kept, and why.
- Facts to confirm with the member.
````

## 5. Check

```
python3 scripts/checkcopy.py workspace/copy/YYYY-MM-DD-<creative-name>.md
```

- **ERROR:** must fix. Over-length headlines, em dashes, placeholders, missing fields, or copying 8+ words from a corpus ad.
- **WARNING:** fix it, or write in the Notes why it's fine. For example: "Mentions $9/month, which is the real price, not an income claim."
- Run it again until it says `RESULT: PASS`.

## 6. Deliver in the chat

Keep it tight. Show the three variations so they're easy to copy, then the setup note:

> Here's your copy for **[creative name]**. All three passed the checks.
>
> **Variation 1: [angle]**
> (primary text, headline, description, and button, each in its own copy block)
>
> **Variation 2: [angle]** ...
>
> **Variation 3: [angle]** ...
>
> (setup note)
>
> Saved to `workspace/copy/[file].md`. Want more variations, shorter versions, or copy for your next creative?

## The setup note (paste into the copy file and the chat)

> **How to load these in Ads Manager**
>
> **Recommended: one ad, three text options.** In the ad, under Primary text, click "Add text option" until you have all three primary texts. Do the same for the headlines and the descriptions. Meta tests the combinations and shows each person the version most likely to work for them. Every headline here works with every primary text, so any mix reads right.
>
> **Testing angles head to head?** Run three separate ads with the same creative, one variation each. Give them 7 days before you judge. Meta may treat ads that share a visual as near-duplicates, so new visuals (not new copy) are what add real creative diversity to an ad set.
>
> **Check the text enhancements.** Meta's Advantage+ creative options can rewrite or rearrange your text. If you want these exact words to run, review the text-related enhancements on the ad before you publish.
