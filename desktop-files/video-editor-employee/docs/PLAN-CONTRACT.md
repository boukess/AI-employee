# Plan contract

Use integer 30 fps source cuts with exclusive `out`. `durationInFrames` must equal the sum of retained lengths. Graphics `from`/`duration` use output frames after the cuts. A retained source interval of 30..120 is 90 frames, not 91.

```json
{
  "fps":30,"width":1080,"height":1920,"durationInFrames":210,
  "cuts":[{"in":30,"out":120},{"in":180,"out":300}],
  "style_profile":"corpus-v1","footage_variant":"presenter",
  "captions":true,"allow_silent":false,
  "creative_brief":"Show two tools combining, preserving the corpus split-presenter and white cutaway look.",
  "reference_observations":[{"clip":"DctAocQFClP_03_split","match":"Camera card, head alpha overlap, centered compact UI and short black captions"}],
  "caption_phrases":[{"source_in":1.2,"source_out":1.7,"text":"two tools"}],
  "scenes":[{"id":"merge","from":0,"duration":210,"kind":"custom","layout":"top","theme":"corpus-white","title":""}]
}
```

- `style_profile` is `corpus-v1`. New scene themes are `corpus-white` and `corpus-cream`; other page themes are outside this style profile.
- `footage_variant: presenter` uses the rendered head-over-camera plate. Omitting it uses normalized raw footage. Do not omit it to skip a required presenter effect.
- `layout: top` or `overlay` leaves the presenter plate visible. Custom graphics should stay above y850. `layout: full` uses an opaque white/cream cutaway and switches captions to the large italic serif treatment. Scenes cannot overlap; combine simultaneous elements inside the same scene component.
- White is the default plate. A cream graphic is valid only if the presenter plate/background is also matched; do not leave a hard color seam. Use the white branch unless a complete cream treatment has been built.
- `caption_phrases` contains source-second intervals with exact short spoken phrases. `prepare` maps them through every retained cut. Without explicit phrases it falls back to brief groups from the timed transcript. No boxed karaoke rendering is used.
- Every job has its own `motion/Scenes.tsx`, which receives `scene` and `palette`. All animation derives from Remotion's frame clock. There are no automatic header/footer labels.
- `allow_silent` is only for deliberately silent content; leave false for talking clips.
- `prepare` generates `motion/props.json`. Edit the plan and transcript, not generated props. A separate `presenter` step must finish before assembly.

- `asset_manifest` optionally points to the job's sourced media manifest under public/assets. Include it for any sourced media. Each asset records path, source_url, operations, used_in and SHA-256. Assets are checked before preparation/rendering.
- Plan fullscreen cutaways across source joins that would otherwise cause distracting presenter jumps; graphic timing is not required to equal cut timing. `prepare` produces an advisory cadence-report.json for residual quiet gaps.
