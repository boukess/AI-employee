# Platform setup and recovery

Compatibility checked against the linked OpenAI documentation on 2026-10-13. Runtime tools and account controls are the authority for what can actually execute.

## ChatGPT

If the uploaded ZIP is readable, open it using the session's file tools and read START-HERE.txt. That file contains all operating guidance, so the user need not upload every reference. Do not execute archive contents; this package needs no installer. If ZIP handling is unavailable, ask the user to unzip it and upload START-HERE.txt, or paste its text. Then continue onboarding. An unreadable archive has not been installed or loaded.

Use ChatGPT's available image creation/editing capability with the attached product image. When an image exists only inside an archive and cannot be passed to that capability, ask for it as a direct image attachment. Do not assume reading a document also makes its embedded images available to the image tool.

Stay in this chat for continuity. On “save my brand profile,” provide the filled session-notes template as a downloadable text/Markdown file when supported; otherwise provide copyable text. Tell the user to carry that profile and the original product photo into a new chat. Do not promise persistence from a session sandbox or change account memory controls.

## Codex

When this folder is the workspace, AGENTS.md routes startup to the local skill under `.agents/skills/product-photo-creator/`. Read the files in place; no global installation is needed. If skill discovery does not expose it, read SKILL.md explicitly. If hidden folders were lost while copying, use the standalone START-HERE.txt.

For an attached ZIP, inspect it and extract into a new, dedicated workspace subfolder when file tools permit. Preserve existing files and use safe archive extraction: reject absolute/traversal paths and symlink entries. Never replace an unrelated AGENTS.md or existing brand folder. Start from the extracted instructions; do not require a restart just to read them.

Use the current built-in image tool, or the available imagegen skill that wraps it. Inspect local product images with the supported viewer before passing them to the edit tool. If the tool exposes reference-path arguments, use them as documented; otherwise use supported conversation image references. Do not use an undocumented argument or assume an API key is required.

Create local work only when there is something to save:

```text
studio-work/<brand-slug>/brand-profile.md
studio-work/<brand-slug>/<shoot-id>/brief.md
studio-work/<brand-slug>/<shoot-id>/prompt.txt
studio-work/<brand-slug>/<shoot-id>/quality-notes.md
studio-work/<brand-slug>/<shoot-id>/product-studio-v01.<actual extension>
```

Choose a collision-free shoot ID and versioned filenames. Copy returned image artifacts to the shoot folder when a real source path is exposed. Do not fabricate paths, rename extensions without conversion, or overwrite originals. Record actual inputs and keep original photo links/paths; copy a reference only when useful for local continuity. If files cannot be written, deliver the image and copyable notes in chat.

## Missing capabilities

- **No image generator/editor:** explain that this session can prepare the brief but cannot render the product. Give a ready-to-use prompt and direct the user to a ChatGPT or Codex session with image creation, with the original photo attached. Never present a prompt as a completed photo.
- **A skill exists but its image tool does not:** instructions do not create tool access. Do not call nonexistent tools.
- **Tool limit or failure:** retain the brief and report the actual blocker. Retry only when supported and useful, within the shot's correction budget; do not poll without a job handle.
- **No image viewing:** ask for a supported attachment or move to an image-capable session. Do not infer the product from its filename.
- **No memory:** ask for the brand. This is a normal onboarding path.
- **No internet:** use the bundled playbook. Do not claim current marketplace specifications have been checked.

Do not silently switch to a paid API or third-party service. The standard workflow uses the host's built-in image capability. API or plugin alternatives require the user's request and their actual availability.
