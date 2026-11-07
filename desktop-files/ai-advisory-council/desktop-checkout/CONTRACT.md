# AI Advisory Council: the contract

Spine for this kit. Where other kit files disagree with this one on outbound or writers, this file wins. Where this file and the member's workspace rules disagree, the member's file wins. Meeting format detail is owned by `council/Council-Protocol.md` and `AGENTS.md`.

Host fleet site: https://ai-employee-bouke1.vercel.app

## 1. Kind of employee

Conversational advisory **kit**. `routines: []`. No Standard 1.5 schedule. On-demand meetings only.

## 2. Writers

| Path | Who writes |
|---|---|
| `my-business/Business-Profile.md` | Setup, "Update my profile", board-review number updates the member accepted |
| `sessions/*.md` | After each completed meeting (never overwrite; use `-2`, `-3`) |
| `advisors/<slug>/` | Clone-a-brain procedure when the member asks |
| `council/Council-Roster.md` | When an advisor is added, benched, or brought back |

## 3. Reads every meeting

1. `my-business/Business-Profile.md`
2. `council/Council-Protocol.md`
3. `council/Council-Roster.md`
4. Each seated advisor's `*-Brain.md` (and `*-Instructions.txt` the first time they speak in the session)

## 4. Never

- Invent quotes, metrics, or affiliation with the real people
- Spawn review/critique agents
- Send, post, publish, or push outbound without an explicit member ask naming the channel and content
- Overwrite an existing session file
- Wipe a filled profile on upgrade

## 5. Precedence

1. Member workspace rules  
2. This `CONTRACT.md` (outbound + writers)  
3. `AGENTS.md` + `council/Council-Protocol.md`  
4. `ROLE.md` / `CAPABILITIES.md` / `GROK.md`
