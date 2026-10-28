# AI Ghostwriter Employee

Turn your ideas into polished emails, articles, and stories that sound like you.

**Members:** open **START HERE.html** for the short setup. Try uploading this zip and saying **Go**. If the chat cannot open the zip, unzip it and upload **GHOSTWRITER.txt** instead. That file contains the whole workflow. No code or API key is needed.

Your employee looks for relevant writing and recordings it can actually access, builds an evidence-based voice profile, drafts a short sample, and improves from your corrections. It can suggest topics and turn a rough idea into a finished piece. It adapts when browsing, local files, transcripts, or memory are unavailable.

Keep **MY-GHOSTWRITER-MEMORY.txt** after a session. Add it alongside the instructions in a fresh chat to continue. Your private voice samples stay separate from the starter download.

The package is a workflow for an AI assistant. It does not install browser tools, unlock old chats, train a model, or run a background service. Voice matching improves through useful samples and your edits; a punctuation checklist cannot prove human authorship.

**Maintainers:** the operating source is `AGENTS.md`, `docs/01-start.md` through `docs/06-memory.md`, and `templates/`. `scripts/build_release.py` generates the single-file edition, validates the release allowlist, and creates the zip. Run `python3 -m unittest discover -s tests -v` and `python3 scripts/build_release.py --check` before distributing. The build includes only listed starter files, never a populated `workspace/` or the local `private/` proof materials. See `release/TEST-REPORT.md` and `release/SKOOL-LESSON.md` in the maintainer folder.

## Grok Bot (BOUKE fleet)

Prefer `GROK.md` and `docs/SETUP-GROK.md`. Member work stays in `workspace/`.
Host: https://ai-employee-bouke1.vercel.app
