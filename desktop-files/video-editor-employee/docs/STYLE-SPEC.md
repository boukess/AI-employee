# Corpus visual specification — v1

The corpus is the target style. This profile implements the dominant white/cream split-presenter and white-cutaway formats seen in the supplied aifornontechies clips. It is not a new design system inspired by them.

## Included reference library

The member package contains 38 motion segments from four source videos, selected from the supplied corpus. Inspect the actual clips under `references/corpus` and the reference gallery. These are style references only; never place the reference presenter or audio in a member export.

| Anchor | What must carry over |
|---|---|
| `DctAocQFClP`, 13.2s / `03_split` | White canvas; compact UI above; short tightly spaced black sans caption; rounded camera card; subject's head alpha extends above the card |
| `DctAocQFClP`, 2.9s / `01_cutaway` | White fullscreen graphic with large negative space; small logo/nodes; one short bold italic serif phrase below |
| `DctAocQFClP`, 0.65s and 8.7s | Warm cream canvas, soft abstract plant shadow, rounded product card, lower presenter composite |
| `Dc0vBUOjyoQ`, 5.5s | Product UI in a restrained rounded card, thin edge/shadow, serif emphasis above presenter |
| `DcTQsXDlbY8`, 13.7s | Compact icon diagram above a lower presenter, one-word black sans caption |
| `Db8FiLTiMS_`, 18.3s | UI panel scale/spacing, occasional colored italic emphasis without changing the whole layout |

## Coordinates at 1080 × 1920

- White page: sampled reference corners are approximately RGB 253,253,253. Cream branch corners around RGB 252–253,239,228; it varies across the soft background.
- Split camera card: approximately x76–1004, top y1170, extends below the frame. Top corner radius around 80–90px. It retains the source room/camera image.
- Head: foreground alpha rises to around y990, overlapping the top edge of that card. Hair must remain, including soft flyaways. Use the same transform for the foreground and background camera plate so there is no seam or doubled face.
- Split graphic: content broadly within x80–1000, y230–820. Small logo around y230–300; UI/diagram around y350–800. Keep room for the short caption and head below.
- Split caption: center around x540/y940, generally one or two words, roughly 75–85px, tight tracking, black. No box, backing pill or colored karaoke word.
- Fullscreen cutaway: white page; graphic/logo/diagram generally y200–1050; short caption centered near y1250. Bold italic serif, usually uppercase, about 100–115px, fitted to phrase length. Preserve the reference's large negative space.
- Product cards: roughly 2px light-gray edge, radius 25–35px, low-opacity diffuse shadow. Node connections are thin and light. Brand color is localized to logos, selected controls and emphasis.

The numbers are measurements/working approximations from rendered reference pixels, not recovered source-project settings. The original font files are not included in the corpus; the current matched setup uses locally available Poppins ExtraBold with tight tracking for split captions and Times New Roman Bold Italic for cutaway emphasis. Adjust against reference pixels if the user requests a closer type match.

## Motion grammar

- Explain the noun/action being spoken: a panel appears, a node activates, a line connects, text types, an interface state changes, two panels combine. Time the action to the corresponding phrase.
- Entrances are short and restrained. Small scale/position settling is appropriate. Avoid constant floating/rotating decorations.
- After an entrance, hold the finished state long enough to understand it. Keep a stable arrangement as the speaker explains it.
- Use cuts between split and fullscreen views at meaningful beats. Return to the presenter. Do not turn the whole clip into a slide deck.
- Preserve the style while changing the specific diagram/UI content. Keep one recognizable visual identity across edits.

## No on-screen source labels

Do not add small gray source text, credits, URLs or citation footers beneath media or elsewhere in the finished video. Source documentation belongs in the project files only. This is a standing user preference for future exports.

## Real footage and screenshots

Match the corpus's use of real source material as well as its animation. Actual logos, app screenshots, terminal/screen recordings and launch films belong inside these same restrained cards. Use animated crops, callouts and diagrams to explain the real asset. Do not replace all available source imagery with drawn UI. See SOURCE-MEDIA.md.

