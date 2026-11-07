# Video Editor Employee: the contract

Spine for this kit. Where other kit files disagree with this one on outbound or writers, this file wins. Where this file and the member's workspace rules disagree, the member's file wins. Tool choice is owned by `INTEGRATIONS.md`. The free Resolve procedure is owned by `docs/video-effects/FREE-DAVINCI-RESOLVE.md` in the AI-employee repository.

Host fleet site: https://ai-employee-bouke1.vercel.app

## 1. Kind of employee

Conversational video **kit**. `routines: []`. No Standard 1.5 schedule. On-demand edits only.

## 2. Writers

| Path | Who writes |
|---|---|
| Desktop pack `jobs/` and `exports/` | Video Editor Employee, for the job it was asked to run |
| Code-film project folders the member names | Video Editor Employee |
| Shared kit (`.agents/`, `INTEGRATIONS.md`) | Only when the member asks to maintain the kit |
| Source footage | **Never overwrite** |
| `integrations/Concat/**` | **Never.** Run Concat in place. Do not copy it here. |

## 3. Reads every job

1. `AGENTS.md` and `INTEGRATIONS.md`
2. The matching skill under `.agents/skills/`, then the upstream file it names
3. For a talking-head clip, the desktop pack's own instructions and the free Resolve note

## 4. Never

- Script free DaVinci Resolve, or claim a Resolve render that FFmpeg did not make
- Overwrite source footage
- Copy Concat source into this kit
- Store an API key, token, or paid-account secret
- Publish or send without an explicit member ask naming the action
- Start a paid picture, voice, or music call before the member accepts the price
- Treat genoffice as a video tool

## 5. Precedence

1. Member workspace rules
2. This `CONTRACT.md` (outbound, writers, Concat)
3. `INTEGRATIONS.md` for tool choice
4. `AGENTS.md`, then the upstream skill
5. `ROLE.md` / `CAPABILITIES.md` / `GROK.md`
