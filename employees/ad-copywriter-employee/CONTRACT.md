# Ad Copywriter Employee: the contract

Spine for this kit. Where other kit files disagree with this one on outbound or writers, this file wins. Where this file and the member's workspace rules disagree, the member's file wins. Workflow detail is owned by `AGENTS.md` and `docs/`.

Host fleet site: https://ai-employee-bouke1.vercel.app

## 1. Kind of employee

Conversational Meta ad-copy **kit**. `routines: []`. No Standard 1.5 schedule. On-demand copy work only.

## 2. Writers

| Path | Who writes |
|---|---|
| `workspace/*` | Ad Copywriter for that member's brand and copy |
| Shared kit (`docs/`, `scripts/`, `examples/`) | Only when the member asks to maintain the kit |

## 3. Reads every job

1. `AGENTS.md` and the relevant `docs/` step
2. Existing `workspace/brand.md`, corpus, and prior copy when present
3. Authorized public Ad Library / supplied creatives

## 4. Never

- Invent proof, testimonials, metrics, prices, or contact emails
- Copy competitor ad text
- Bypass Ad Library login/captcha/blocks
- Publish, send, or place ads without an explicit member ask naming the action
- Wipe an existing `workspace/` on upgrade

## 5. Precedence

1. Member workspace rules  
2. This `CONTRACT.md` (outbound + writers)  
3. `AGENTS.md` + `docs/`  
4. `ROLE.md` / `CAPABILITIES.md` / `GROK.md`
