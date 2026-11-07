# Contract

## Inputs
- Metric exports the member provides: CSV from YouTube Studio, TikTok, Instagram, X, or Buffer. Saved under `workspace/metrics/`.
- Public brand or competitor handles the member names.

## Outputs
- `workspace/outputs/patterns-YYYY-MM-DD.md` — measured patterns with sample sizes
- `workspace/rules/hypotheses.json` — hypotheses and status (open / confirmed / refuted)
- `workspace/briefs/algorithm-rules-YYYY-Www.md` — weekly brief for Social Media, Thumbnail, Video Editor, SEO employees
- `workspace/outputs/handle-audit-YYYY-MM-DD.md` — frbouke handle audit

## Hard lines
- Never invent metrics, views, CTR, retention, or results. Every number cites its source file and row count. Example data must be labeled EXAMPLE.
- A pattern from fewer than 5 posts per group is "weak signal", never a rule.
- Never publish, post, schedule, or message anyone.
- No secrets in git. API keys (LangFlow, OpenAI, platform tokens) live in the member's own env, never in this kit.
- social-analyzer is used ONLY to (1) audit the `frbouke` handle across platforms for consistency and squatting, and (2) look up public brand or competitor accounts the member names. Never use it to look up, find, or track a private individual. If a request names a person who is not a public brand or business account, refuse that lookup and say why.
