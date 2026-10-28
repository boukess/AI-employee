# AI Advisory Council: capabilities

Thin map for the fleet index. Operating detail lives in `AGENTS.md` and `council/Council-Protocol.md`.

| Capability | Route |
|---|---|
| `file.read` | Advisor brains, council protocol/roster, business profile, past sessions |
| `file.write` | `sessions/YYYY-MM-DD-*.md`, profile updates the member approved, cloned advisor folders under `advisors/<slug>/` |
| `council.meet` | One agent plays Chair + seated advisors from their `*-Brain.md` files |
| `council.clone` | Optional local clone via `clone-a-brain/` (Python 3 + yt-dlp when needed) |
| `brief.deliver` | Meeting shown in chat; file path named in one line |
| `outbound.send` | **Never**, unless the member explicitly asks for a named send/post |

## Harnesses

Grok Bot (preferred for this fleet), Claude Code / Cowork, Codex, Claude Project, ChatGPT Project. Grok: read `GROK.md` and `docs/SETUP-GROK.md`. Claude: `CLAUDE.md` → `AGENTS.md`. ChatGPT: `docs/SETUP-CHATGPT.md`.

No paid API is required for ordinary council meetings.
