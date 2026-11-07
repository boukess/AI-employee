# Video Editor add-ons (Grok)

Extra packs living under this folder on IBP_Desktop. Prefer the main Resolve/Remotion AI Video Editor flow for talking-head edits (`Edit my video`). Use these when the request matches.

Pinned creative tools (explainroo, huashu-motion, take-one, argo, video-director, reanimate, rossark-motion-skill, earshot, Concat) are documented in `employees/video-editor-employee/INTEGRATIONS.md`. Use that file to choose one. Do not copy Concat into this pack.

## tools/Split-Screen-Editor
Remotion split-screen vertical editor. Drop footage in `inputs/`, follow `START_HERE.md` / `Editing Prompts.txt`, export to `renders/`. Quick start: `docs/SPLIT-SCREEN-EDITOR-QUICK-START.txt`. Node 22+.

## tools/brand-motion-studio
Brand / logo / promo motion designer (Python + Skia). Read `SKILL.md`. Triggers: "Make me a brand video", "Animate my logo", "Turn this clip into a Reel".

## skills/ (Remotion effect skills)
Read each `SKILL.md` when the request matches the frontmatter description.

| Skill | Use when |
|---|---|
| `github-callout` | Speaker mentions a GitHub repo; animated README overlay |
| `headline-highlight` | Animated headline highlight treatment |
| `glow-intro-caption` | Glow intro caption treatment |
| `high-quality-captions` | Higher-end caption styling pass |
| `motion-promo` | Voiceover → slick motion-graphic promo/ad (no talking-head required) |

One editing agent only. No review/critique agents. Never publish or send unless asked. Grok Bot local Shell on IBP_Desktop.
