# Product Photography Employee: the contract

Spine for this kit. Where other kit files disagree with this one on outbound or writers, this file wins. Where this file and the member's workspace rules disagree, the member's file wins. Workflow detail is owned by `AGENTS.md` and `.agents/skills/product-photo-creator/SKILL.md`.

Host fleet site: https://ai-employee-bouke1.vercel.app

## 1. Kind of employee

Conversational product photography **kit**. `routines: []`. No Standard 1.5 schedule. On-demand shoots only.

## 2. Writers

| Path | Who writes |
|---|---|
| `studio-work/*` | Product Photography Employee for brand notes and outputs |
| Shared kit (`.agents/`, START-HERE) | Only when the member asks to maintain the kit |
| Source product photographs | **Never overwrite** |

## 3. Reads every shoot

1. `AGENTS.md` and `product-photo-creator/SKILL.md`
2. `INTEGRATIONS.md` when a local editor, a 3D mockup, or GIMP-ML is considered
3. Existing studio-work brand notes when present
4. The uploaded product image (required)

## 4. Never

- Generate a product without an uploaded source image
- Overwrite source photographs
- Invent claims, logos, or accessories not in the source
- Publish or send without an explicit member ask naming the action
- Wipe an existing `studio-work/` on upgrade
- Store an API key in this kit
- Claim Compositor or PixPic ran on Windows or Linux
- Treat genoffice as a photography tool

## 5. Precedence

1. Member studio-work rules  
2. This `CONTRACT.md` (outbound + writers)  
3. `AGENTS.md` + `product-photo-creator/SKILL.md` + `INTEGRATIONS.md`  
4. `ROLE.md` / `CAPABILITIES.md` / `GROK.md`
