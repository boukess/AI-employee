# Product Photography Employee: capabilities

Thin map for the fleet index. Operating detail lives in `AGENTS.md` and `.agents/skills/product-photo-creator/SKILL.md`.

| Capability | Route |
|---|---|
| `file.read` | Kit skill, references, studio-work |
| `file.write` | `studio-work/` brand notes, session notes, outputs |
| `image.edit` / `image.generate` | Host image tools with product reference. Default path. |
| `image.edit.local` | PhotoCraft on Windows or Linux, when pixels, masks, type, or a PSD must stay exact |
| `model.product` | SolidCraft for a 3D mockup or render. Not a photo restage. |
| `image.edit.gimp_ml` | Optional. GIMP 3 plus the member's own Gemini or OpenRouter key. Not stored here. |
| `qc.product_fidelity` | Compare output to source per quality-control.md |
| `outbound.send` / `publish` | **Never**, unless the member explicitly asks |

## Harnesses

Grok Bot (preferred for this fleet), Codex, ChatGPT Project. Grok: read `GROK.md` and `docs/SETUP-GROK.md`.
