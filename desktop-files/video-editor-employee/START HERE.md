# AI Video Editor

Your raw video. A finished short-form edit.

Drop in a vertical talking video. Your Grok editor selects the best takes, smooths the cuts, adds captions and custom animation, brings in real product visuals, creates the head-over-frame effect, and boosts your dialogue. You give feedback on the exported MP4.

## Start once

1. **Keep this folder** somewhere permanent, such as `C:\Users\blood\AI Video Editor`. Open `START HERE.html` for the visual guide.
2. **Use Grok Bot** with local tools on this same computer (not a cloud-only upload). See `docs/SETUP-GROK.md`. ChatGPT and Claude guides remain in `docs/` if you need them.
3. **Install the prerequisites:** DaVinci Resolve **Studio 21.1+** (or the **free** DaVinci Resolve with `"resolve_edition": "free"` in config/editor.json, see docs/FREE-RESOLVE.md; free mode needs no External scripting setting), Node.js **22+**, and Python **3.12**. Open Resolve; set Preferences → System → General → External scripting to **Local**. These apps are separate from the ZIP. Grok can guide the installation.
4. **Paste `prompts/01-SETUP.txt` into Grok.** It installs this folder's dependencies and checks the connection. First setup downloads a browser and model files.
5. **Drop one raw vertical video into `inbox`.** Paste `prompts/02-EDIT-MY-VIDEO.txt`, or say **“Edit my video.”**

When it finishes, open **`exports`** for your MP4. Keep Grok and Resolve running during an edit.

## Every video after that

Add a new raw clip to `inbox` and say “Edit my video.” No script, cut list, animation brief or manual timeline editing is required. If you have exact product links, pronunciation notes or brand assets, include them; otherwise the editor researches the visuals and decides.

For changes, reply with normal feedback: “Shorten the pause at 0:12” or “Use a real app screen in the second scene.” Previous exports stay intact.

## What you need to know

- **This is a local editing employee.** A web-chat upload alone cannot run this package or connect to Resolve on your computer. Use Grok with desktop Shell on IBP_Desktop. No API key is required by these scripts.
- **Mac verified; Windows adapter included.** The release was installed and rendered on Apple Silicon macOS with Resolve 21.1. Windows has setup/launch support but has not been rendered end-to-end by the pack authors. Use native Windows Local, not WSL, for the Resolve bridge.
- **Input:** one vertical MP4/MOV recording with spoken audio per edit.
- **Output:** 1080 × 1920, 30 fps, H.264 MP4 with AAC dialogue. No default watermark or added source-credit text.
- First setup and editing take real compute time. Leave about **20 GB free** for short clips.

The ZIP includes 38 style-reference motion clips, reusable graphics components, the Resolve/Remotion engine, setup prompts and troubleshooting.
