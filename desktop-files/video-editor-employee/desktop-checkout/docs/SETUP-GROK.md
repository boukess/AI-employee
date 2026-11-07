# Set up with Grok Bot

1. Keep this kit reachable (repo: `employees/video-editor-employee`). The desktop pack stays at `C:\Users\blood\AI Video Editor` on IBP_Desktop.
2. Open the Video Editor chat (Grok Bot teammate) with desktop tools, on the PC that has the footage.
3. For a talking-head short, drop one vertical MP4 or MOV in the pack `inbox` and say **Edit my video**. The pack must be in free mode (`resolve_edition` `free`). It writes FCPXML and renders with FFmpeg.
4. For a launch film, explainer, product demo, matched animation, or sound pass, the employee reads `INTEGRATIONS.md` and checks the tool out with `git submodule update --init --recursive integrations/<name>` before it runs anything.
5. `node scripts/integration-check.mjs` shows which pinned folders are present. It does not install them.
6. Do not publish the export unless you name that action.

Host fleet site: https://ai-employee-bouke1.vercel.app

What is still missing on the Windows PC is listed at the bottom of `INTEGRATIONS.md`.
