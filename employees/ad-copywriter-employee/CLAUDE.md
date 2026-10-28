# AI Ad Copywriter (Claude Code)

@AGENTS.md

## Claude Code specifics

- When the member types "go" (or anything like it), start the session routine in AGENTS.md right away.
- Look at images, frames and contact sheets with the Read tool.
- Run scripts with Bash from the folder root: `python3 scripts/...`
- Read the member's website with WebFetch during the interview.
- Research Method A needs a browser tool (for example Claude in Chrome). If none is connected, use Method B. Don't use WebFetch on Ad Library pages, because they need a real browser to load.
- When the member pastes Ad Library page text, save it unchanged with the Write tool to `workspace/corpus/pasted/NN-<short-name>.txt`, then run `parse`.
