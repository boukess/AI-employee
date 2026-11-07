# Website Designer Employee: capabilities

Thin map for the fleet index. Operating detail lives in `AGENTS.md` and `scene-website-director/SKILL.md`.

| Capability | Route |
|---|---|
| `file.read` | Kit skill, library, starters, templates, member briefs |
| `file.write` | `member-projects/<brand>/` site + briefs + QA/status |
| `site.build` | Original HTML/CSS/JS (or adapted starter) under member `dist/` |
| `site.preview` | Local static server; record URL in QA |
| `site.review` | Desktop/phone layout and motion checks tools allow; mark untested otherwise |
| `outbound.send` / `publish` | **Never**, unless the member explicitly asks for a named publish/send |

## Harnesses

Grok Bot (preferred for this fleet), Claude Code / Cowork, Codex, Claude Project, ChatGPT Project. Grok: read `GROK.md` and `docs/SETUP-GROK.md`. Claude: `CLAUDE.md` → `AGENTS.md`.

No paid API is required for a static original site. Optional MCP (`mcp-server/`) is read-only library access. Image generation, domains, and hosting are separate and need explicit member authorization.
