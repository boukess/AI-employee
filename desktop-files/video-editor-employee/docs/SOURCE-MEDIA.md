# Real source media is part of the style

The corpus combines authored motion graphics with actual brand assets, product screenshots, recordings, demos and launch films. New edits must do both. Do not substitute a generic drawn app or an approximated logo when the real relevant asset can be obtained.

## Before scene design

1. Extract the named products, features, claims and actions from the recording. Find the official announcement or product page for this exact topic/date. Use the user's supplied recordings and screenshots when available.
2. Collect the real logo from the brand/site, an authentic screenshot or browser capture, and relevant official demo/launch footage when it helps explain the speech. Prefer a few strong assets tied to the narration over an arbitrary quota. For abstract points, keep custom diagrams.
3. Inspect the moving footage, not just its thumbnail. Select actual source time ranges that show the noun/action being discussed. A current app screen may differ from the version being discussed; preserve that distinction.
4. Store media under `public/assets/<job-or-topic>/`. Record each file's source URL, retrieval date, transformations/crop, intended use, and SHA-256 in `sources.json`. Set the plan's `asset_manifest` to its path. `prepare` and `motion` verify these records and file hashes.
5. Use `src/corpus/SourceMedia.tsx` to render local images or muted video inside the corpus card geometry. Author motion around the real asset: crop, restrained zoom, pan to a detail, spotlight a control, reveal a callout, connect a screenshot to a diagram. Keep the screenshot's own text and state intact. Use the actual logo paths and proportions.

Browser page-asset inventory/bundling is useful for site assets; browser screenshots capture a real page state. Direct official asset URLs can be downloaded when available. Official launch-film excerpts can be acquired for the requested edit through ordinary supported media access. If acquisition fails, use an available official screenshot or product asset, record the gap, and continue; do not fabricate a screenshot or bypass access restrictions.

Mute acquired video by default so the user's voice remains continuous. Preserve provenance in project files only. Do not render source credits, URLs, citation footers, attribution labels or small gray sourcing text in the video. These overlays disrupt the house style. Keep the user's raw recording local. Sourcing public media does not authorize uploading or publishing the user's video.

