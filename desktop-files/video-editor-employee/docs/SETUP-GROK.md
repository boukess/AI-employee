# Set up with Grok Bot

1. Keep **AI Video Editor** at a permanent path on this computer (recommended: `C:\Users\blood\AI Video Editor`).
2. In Grok Bot, work in the chat that can run Shell on **IBP_Desktop** (local computer). Ordinary web-only chat cannot drive DaVinci Resolve on your machine.
3. Paste `prompts/01-SETUP.txt` (or say “Set up AI Video Editor in C:\Users\blood\AI Video Editor”). Grok reads GROK.md and AGENTS.md.
4. Install or open apps only when Grok says so: DaVinci Resolve **Studio 21.1+**, Node.js **22+** (already installed at `C:\Users\blood\Tools\node-v24.22.1-win-x64`), Python **3.12**. In Resolve: Preferences → System → General → External scripting → **Local**.
5. Put a raw vertical recording in `inbox` and say **“Edit my video.”** Finished MP4 lands in `exports`.

Grok must read/write this folder, run shell on the desktop, view frames, and research product media. The package does not need a separate API key. Windows setup is supported; end-to-end Resolve render was verified by the pack authors on macOS first.

Host fleet site: https://ai-employee-bouke1.vercel.app
