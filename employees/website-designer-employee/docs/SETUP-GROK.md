# Set up with Grok Bot

1. Keep **Website Designer Employee** at a permanent path (repo kit: `employees/website-designer-employee`, or a desktop copy such as `C:\Users\blood\Website Designer AI Employee`).
2. Open the Website Designer Employee chat (Grok Bot teammate) or open this folder as the local project.
3. Paste `prompts/01-SETUP.txt`, or say **Build my website** / paste the launch prompt from `START-HERE.md` with your brand details filled in.
4. SCENE reads `AGENTS.md` → `scene-website-director/SKILL.md`, learns from conversation and authorized sources, asks only for essential missing facts, and builds in `member-projects/<your-brand>/`.
5. Preview the site from `member-projects/<brand>/dist/` (local static server). Review briefs and `QA.md` with the project.
6. For revisions: normal feedback (“Tighten the hero”, “Add a services section”). SCENE updates the same member project and refreshes records.

Optional library scenes: `library/`. Optional cinematic starter: `starters/cinematic-workbench/` — adapt identity, palette, copy, and subjects; do not ship the Lab demo branding. Optional MCP bridge: `mcp-server/` (read-only library scenes only).

Host fleet site: https://ai-employee-bouke1.vercel.app
