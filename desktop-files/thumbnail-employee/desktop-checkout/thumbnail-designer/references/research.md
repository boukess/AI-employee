# Build and maintain the member's thumbnail reference corpus

This is the operating procedure for researching comparable content. Read it when beginning research, resuming an incomplete corpus, expanding coverage, or refreshing old references. The corpus is a collection of source evidence used at inference time. It does not train, fine-tune, or permanently change the image model.

## Outcome and default scope

Build a substantial, member-specific corpus of **300 verified, unique, visually inspected thumbnails**, drawn from **at least 20 relevant creators** and **at least 5 useful topic clusters**, where the niche and accessible sources support that coverage. These are the default completion criteria, not a claim about evidence that already exists. Offer a larger corpus if the member requests one; do not require them to choose a size during onboarding.

The first **30 qualifying references** are a useful progress checkpoint. Summarize what they show and keep researching toward the full target automatically. Do not turn that checkpoint into an approval gate or mark the corpus complete at 30. Do not silently replace the default with a smaller sample because research takes effort, a tool has a per-call limit, or the context is getting long. Work in bounded batches and save progress between them.

An explicit member request for a quick start or smaller corpus may change the target. Record the requested target and its reason. If they ask for a thumbnail before research finishes, use the verified evidence available, label the corpus as partial, and preserve the outstanding research work. A small niche, inaccessible platform, or exhausted research budget is a limitation to report, not permission to invent evidence or claim completion.

## Files and persistence

All member data belongs in `workspace/`, relative to the downloaded project root:

| File | Purpose |
| --- | --- |
| `workspace/profile.json` | Member's niche, audience, platforms, channel URLs, content formats, preferences, competitor constraints, and known uncertainties. |
| `workspace/state.json` | Current phase, corpus target, progress counts, last saved batch, remaining work, and active limitations. Preserve unrelated state keys. |
| `workspace/corpus/competitors.jsonl` | Discovered or supplied creators with source URLs and reasons for inclusion or exclusion. |
| `workspace/corpus/candidates.jsonl` | Discovery queue, including candidates awaiting source verification or visual inspection. |
| `workspace/corpus/references.jsonl` | Normalized reference rows using the contract below. Only qualifying rows count toward completion. |
| `workspace/corpus/images/<id>.<ext>` | Local image copies when retrieval is possible and allowed by the available tool. |
| `workspace/corpus/patterns.md` | Evidence-backed findings, coverage report, retrieval guidance, and gaps. |
| `workspace/corpus/research-log.md` | Queries, visited sources, batch checkpoints, blockers, and the exact next research step. |

Never ship another member's profile, face references, or collected corpus as this member's research. The downloadable employee starts with empty member data. If the environment cannot write files, maintain equivalent structured artifacts in the conversation and export a checkpoint when possible. State the persistence limitation and never claim that a file was saved unless it was created. Do not treat conversation memory as durable storage for hundreds of research rows.

## Establish the research brief

Read `profile.json` and the current `state.json` before searching. Use only memories and uploaded material actually available in this session. Do not claim to inspect hidden memories, private analytics, account history, or a channel that the tool cannot access.

Translate the member's content into a brief covering:

- The intended viewer, niche, language, and level of expertise.
- The platform and intended asset: for example, a long-form video thumbnail or a vertical video cover. Preserve platform and format differences during analysis.
- Repeated content formats, such as tutorials, comparisons, transformations, commentary, case studies, or product demonstrations.
- Five or more useful topic clusters where feasible, drawn from their actual catalog, transcript, planned topics, or explicit description.
- The viewer promise in each cluster: a result, discovery, comparison, explanation, or unresolved question.
- Any supplied competitors and whether the member explicitly requested an exclusive list.

The optional competitor upload is **additive by default**. Normalize names, handles, and links; discover other relevant creators as needed. If the member explicitly limits research to their list, respect that boundary and report when it prevents the default creator or topic coverage. A missing competitor list never blocks research. Likewise, a face reference is not needed for this phase.

If profile evidence is thin, begin with a provisional brief and label its assumptions. Improve it from accessible public content. Ask only for information that materially changes the research direction and cannot be inferred. A blocked social link may be replaced by the member's description, accessible examples, screenshots, or another relevant public source.

## Research in saved batches

### 1. Discover creators and candidate content

Search by the niche, audience problem, topic cluster, content format, and recognizable comparable titles. Mix direct competitors with adjacent creators whose *specific videos* address the same viewer need. Name recognition alone is insufficient. Prefer varied sources and creators rather than letting one large channel dominate.

For each competitor, store a JSONL object containing at least `creator`, `platform`, `creator_url`, `origin` (`member` or `discovered`), `relevance`, `status` (`included`, `excluded`, or `pending`), and `evidence_notes`. An excluded creator's reason should make sense from the research brief. Preserve the member's original supplied names or links in notes when normalization changes them.

Queue candidate content before counting it. Candidate objects should contain a stable `id`, `platform`, `creator`, `source_url`, `title` when known, `topic_tags`, `content_format` when known, `discovered_at`, `status`, and `evidence_notes`. Use statuses such as `queued`, `source_verified`, `needs_image`, `ready`, `rejected`, or `duplicate`; retain a rejection reason. Unknown fields may be null or empty rather than guessed. Write discovery queries and relevant source links to the research log.

Build batches of roughly 20–30 candidates, or fewer when tool limits require it. Each batch should address an explicit coverage gap. Start broadly enough that the first 30 do not all come from one creator or one narrow topic. Across the full corpus, aim for no creator to provide more than about 10% of qualifying references, unless the member's constraints or niche make that impractical; disclose the concentration when it occurs.

### 2. Verify the underlying content and its image

Open the content page or another attributable source and verify the creator, title, platform, and connection between the content and the image. Search results can provide candidates; they do not automatically verify the content, performance metrics, or image provenance. Record the public content URL in `source_url`, not merely a search query URL.

Retrieve the actual associated thumbnail or cover when possible. Store both its original image URL and the underlying content URL. Prefer a source that clearly identifies the content. Do not infer a thumbnail URL from an identifier and count the result without opening and checking it. Do not silently replace a cover with a profile picture, an unrelated image, a generated proxy, a broken-image response, or a default placeholder.

Save an accessible image as `workspace/corpus/images/<id>.<ext>` and verify that the bytes decode as an image. Match the extension to the actual format. Retain the best available resolution that supports useful visual analysis without claiming it is the creator's original upload. Use a tool suited to opening images to view it. A successful download, an HTML image tag, text-only search result, or filename does **not** count as visual inspection.

If downloading is unavailable but a browser or image tool can display the actual image, inspect it there. Record the tool and method, keep `local_path` null, and flag the missing local copy. Such a row may count as visually inspected if its source is verified, but the coverage report must distinguish remote-only evidence from the reusable local image collection. Prioritize obtaining local copies in later batches when feasible. Never claim all images are local when some are not.

For a contact sheet or source page containing several thumbnails, count only images large enough to read and attribute unambiguously. Record the page URL and identifying location in `inspection_method` or notes. Reopen individual images when small type, facial expression, composition, or attribution is unclear.

If a social platform is inaccessible, record that limitation and the affected source. Do not invent posts, creators, cover images, or metrics for Instagram, TikTok, YouTube, or any other service. Use member-provided screenshots with stated provenance or accessible comparable sources, and preserve the platform difference in the analysis. Never bypass a login, paywall, or access control to reach private content.

### 3. Inspect and annotate

Actually view the image before writing visual observations. Distinguish directly observed features from interpretations:

- **Hook:** What visible contrast, promise, question, result, or unusual detail creates interest? If the inferred emotion or promise is uncertain, label it as an interpretation.
- **Composition:** Subject placement, negative space, layers, framing, directional cues, and how the eye moves through the image.
- **Text:** Legible words verbatim, their role, and approximate placement; distinguish no text from text that cannot be read. Do not invent unreadable wording.
- **Face presence:** None, one, multiple, or unclear; describe expression only when visible. Do not infer identity or personal attributes.
- **Palette and focal point:** The main visible colors and the strongest point of attention. Use qualitative color names unless sampled values were actually measured.
- **Relevance:** Why this specific reference compares to the member's viewer, topic, promise, or format.

Preserve timestamps and missing values honestly. `published_at` must be null if an exact publication date is unavailable. A relative age can be retained in `evidence_notes` without inventing a precise date. Record public view counts or other metrics only when directly observed and attributable, along with their observation date and source. Do not treat likes, views, or follower counts as CTR, impressions, retention, or proof that a thumbnail caused success.

### 4. Deduplicate and qualify

Deduplicate by canonical content URL and image hash where available. Remove tracking parameters when doing so is safe, but keep the URL that actually resolves to the content. Do not count alternate resolutions, crops, file formats, CDN URLs, or repeat appearances of the same thumbnail as additional unique evidence. A cryptographic hash catches identical bytes, not visually identical re-encodings; visually check likely duplicates as well.

If the same exact artwork is reused across multiple videos, preserve that information in notes but count the artwork once toward the 300 unique-thumbnail target. If materially different thumbnail versions exist for one video, preserve version history without inflating the default count: select one current or clearly attributable primary reference per content item unless the user explicitly requests version analysis.

A row counts toward the target only if:

1. Its underlying content and creator are attributable to a source.
2. Its actual associated image was visually inspected and is neither a placeholder nor an unrelated proxy.
3. It is unique under the rules above.
4. It is relevant to the research brief and contains usable visual annotations.

Move rejected candidates out of the active queue with a reason rather than deleting the history. Keep uncertain or unviewed records as pending evidence; never include them in verified counts or pattern conclusions.

### 5. Save, report, and resume

After every batch, persist the rows and local assets that were actually created. Update counts from the saved rows rather than estimating from search results or relying on memory. Update `state.json`, `patterns.md`, and `research-log.md` with a short checkpoint. At the 30-reference checkpoint, tell the member what has been learned and continue automatically.

Each checkpoint records the current target, qualifying count, distinct included creators, represented topic clusters, platform/format distribution, local-image count, remote-only inspected count, pending count, duplicate/rejection counts, blocked sources, and next batch focus. Log the last completed batch, unprocessed candidate IDs, and the next query or source to inspect. Preserve source-specific blockers so a resumed session does not retry the same inaccessible page indefinitely.

If a tool, time, rate, or context limit prevents continued research, finish the current safe write and save a resumable checkpoint. Report the precise progress and limitation. Set `research_status` to `partial` and record the blocker separately; **do not mark the corpus complete**. The supported status values are `not_started`, `in_progress`, `partial`, and `complete`. In a later session, load the checkpoint, reconcile counts with the actual files, and continue from the queue and gaps. Changing tools or opening a new session must not restart the corpus or erase completed work.

Completion means the recorded target and coverage criteria were actually met, or the member explicitly changed them and the revised criteria were met. If the niche genuinely cannot support the target after varied searches, show the scope explored and remaining gap; leave the limitation visible. Do not manufacture irrelevant additions merely to hit a number.

## Reference row contract

Store one JSON object per line in `workspace/corpus/references.jsonl`, encoded as UTF-8. IDs must be stable, unique, and safe as filenames, for example `ref-000001`. Saved JSON paths are relative to the member data root, `workspace/`: use `corpus/images/<id>.<ext>` for an image's `local_path`. The helper's `--workspace workspace` argument selects that data root. Do not store invented example rows as if they were member research.

Every row includes the following keys:

```json
{
  "id": "ref-000001",
  "platform": "<platform>",
  "creator": "<verified creator name>",
  "creator_url": "<creator profile URL>",
  "source_url": "<underlying content URL>",
  "title": "<observed title or caption excerpt>",
  "topic_tags": ["<cluster>", "<specific topic>"],
  "content_format": "<comparable format>",
  "published_at": null,
  "observed_at": "YYYY-MM-DD",
  "metrics": {},
  "image": {
    "source_url": "<actual image URL, or null when no image URL is exposed>",
    "local_path": "corpus/images/ref-000001.jpg",
    "inspection_status": "viewed",
    "inspection_method": "<tool and how the actual image was displayed>",
    "inspected_at": "<ISO 8601 timestamp>",
    "sha256": null
  },
  "visual": {
    "hook": "<observed hook and any explicitly qualified interpretation>",
    "composition": "<observed layout>",
    "text": "<legible text and placement, or explicit no-text/unreadable note>",
    "face_presence": "none",
    "palette": ["<observed color>"],
    "focal_point": "<observed focal point>"
  },
  "rationale": "<why this specific content and image are comparable>",
  "evidence_notes": "<source verification, uncertainties, missing assets, or other limits>"
}
```

The example is a shape illustration only. Replace every placeholder with verified information when creating real rows.

- `platform`, `creator`, `creator_url`, `source_url`, `title`, `content_format`, `rationale`, and `evidence_notes` are nonblank strings. `creator_url` and `source_url` must be attributable HTTP(S) URLs. If the source has no title, use an observed caption excerpt and say so in notes; never invent a title. A screenshot with no attributable public source belongs in member-supplied inspiration or pending candidates rather than the qualifying public corpus.
- `topic_tags` is a nonempty array of strings using consistent cluster names. Put the primary topic cluster first, followed by optional specific tags. Count primary clusters for the five-cluster coverage criterion; synonymous tags or several tags on one reference do not establish separate cluster coverage.
- `published_at` is an ISO date or timestamp when verified, otherwise null. `observed_at` is the ISO date on which this source was checked.
- `metrics` is an object. Use `{}` if nothing was verified. For any recorded metric, prefer `{ "value": 12345, "observed_at": "YYYY-MM-DD", "source_url": "https://…", "qualifier": "exact or displayed approximation" }`. Do not derive private metrics. Preserve approximate public displays as approximate.
- `image.source_url` and `image.local_path` are strings or null. `image.source_url` may be null only when a local image copy exists. A member-supplied image can have a local path without a public image URL; identify its origin and verification limits in notes, while retaining the underlying public content URL. If a browser-displayed image has no exposed image URL, obtain a local image or screenshot before promoting the row. At least one inspectable image provenance route must exist for a qualifying row.
- `image.inspection_status` is exactly `viewed` or `unviewed`. `inspection_method` and `inspected_at` are null when unviewed. Use an ISO timestamp for `inspected_at` when viewed. A URL retrieval or text extraction is not a valid inspection method by itself.
- `image.sha256` is the SHA-256 of the actual saved image bytes, or null if not computed or not locally available. Never invent a hash.
- For viewed rows, `visual.hook`, `composition`, `text`, and `focal_point` are nonblank strings; `palette` is a nonempty array of observed color descriptions. Use an explicit `none` or a no-text statement when no text appears; use an explicit unreadable-text note when needed. Leave observations null or empty for unviewed images. `face_presence` is `none`, `one`, `multiple`, or `unclear`; use null while unviewed.
- Rows marked `unviewed` may be persisted to preserve provenance, but they do not count toward the target, support visual findings, or enter a generation shortlist. Prefer keeping incomplete work in `candidates.jsonl` until ready.
- `evidence_notes` must identify any uncertainty affecting comparability, provenance, image availability, metrics, publication date, or duplication. Add optional fields only when they serve a clear purpose and remain compatible with this required core.

## Coverage report and pattern synthesis

Maintain a readable coverage report at the top of `patterns.md`. Report actual counts, the target, completion/partial status, and the observation period. Include tables of qualifying references by creator, cluster, platform, and content format. Show how many images are local, how many were inspected remotely, and how many remain unviewed. State gaps, concentrated sources, stale coverage, and any explicit user constraint that limits the research.

Synthesize patterns only from qualifying, visually inspected rows. Every substantive pattern must cite supporting reference IDs and explain its boundaries. Useful pattern categories include:

- Topic and viewer promise: what the image implies and how that relates to the title.
- Composition: subject scale, framing, negative space, contrast, and focal hierarchy.
- Text: common amount, type size, semantic role, and title overlap.
- Human presence: when faces, hands, objects, or interfaces carry the story.
- Asset needs: repeated use of real logos, authentic interface captures, product details, or other elements requiring source assets.
- Exceptions: relevant examples that use a different solution, and when that solution might suit the member.

State each finding as an observed pattern, not a universal rule or promise of results. A frequently observed style is not automatically effective. Public popularity may be context, but never say a style has high CTR, boosts retention, or caused a video's views unless the member supplies evidence that directly supports that claim. Even supplied results may be confounded by topic, timing, audience, and distribution; keep causal language calibrated.

Avoid flattening a niche into one template. Preserve differences by topic, format, audience sophistication, platform, and presence of a person. Separate direct observations from hypotheses worth testing. Derive useful design principles rather than reproducing another creator's distinctive thumbnail.

## Retrieve evidence for a new thumbnail

When the member supplies a transcript, topic, or title, extract the actual viewer promise, topic cluster, format, key objects, and whether a person is relevant. Shortlist about **8–15 qualifying references** from the corpus, selecting primarily for topic and format comparability, then viewer promise, audience, and visual requirements. Use at least three creators where feasible and include more than one composition approach. Popularity alone is not a retrieval criterion.

Prefer local images and reopen the best **3–5 actual images** from the shortlist before choosing a design. Reuse saved annotations for discovery, but do not pretend an earlier text summary is a freshly viewed reference. If a remote-only source no longer loads, replace it or explicitly omit visual claims that cannot be checked. An unviewed row is never an image reference.

Record the chosen IDs, the design principles taken from them, and the connection to the member's content in the generation brief. Combine broad principles—such as a readable focal object, a clear contrast, or a compact outcome phrase—into an original composition. Do not trace, duplicate, or make a near-copy of a competitor's complete layout, proprietary character, or distinctive artwork. Do not add a competitor's face or branding merely because it appeared in the research.

Use the corpus to identify when authentic assets are needed. The generation workflow handles requesting or finding the member's face reference, real logos, product photos, or UI screenshots. Research thumbnails are evidence about design; they are not automatically authorized source assets for the final artwork.

If the new topic or platform falls outside the existing coverage, research a focused batch for that gap before claiming the corpus supports it. Append new verified rows, refresh the synthesis, and preserve the earlier evidence. Refresh older references when the member's niche, branding, audience, or content format changes, or when unavailable sources weaken the selected shortlist. Never delete useful history merely because a new topic arrives.
