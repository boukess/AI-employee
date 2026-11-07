# AI Ad Copywriter: start here

This is an AI employee that writes your Facebook and Instagram ad copy.

You give it your ad creative (an image or a video). It gives you back **three variations** of the primary text, headline and description. Each one takes a different angle, and each one is based on real ads already running in your niche.

## How it works

1. **It interviews you** about your business, your offer, and how you sound. (About 3 minutes.)
2. **It studies your niche** in the Meta Ad Library: the ads your competitors are running right now, and which ones have been running long enough to be working. (About 5 to 10 minutes. You may need to copy and paste a few pages for it.)
3. **It writes your copy.** Drop in a creative and get three checked, ready-to-paste variations. (About 2 minutes per creative.)

You only do steps 1 and 2 once. After that, it's just: drop a creative, get copy.

## Set it up (pick your tool)

| You use | Open this guide | The short version |
|---|---|---|
| Claude Code | `docs/SETUP-CLAUDE.md` | Open this folder in Claude Code, then type **go** |
| Codex | `docs/SETUP-CODEX.md` | Open this folder in Codex, then type **go** |
| ChatGPT | `docs/SETUP-CHATGPT.md` | Upload the zip, paste the prompt from `prompts/chatgpt-go.txt` |

Prefer clickable instructions? Open **START HERE.html** in your browser.

## Want to see an example first?

Open `examples/ai-employee-lab/`. It shows two steps for a real business: the brand file the interview produces, and how the copywriter reads a 47-second video ad (frames, transcript and creative read). Or type **show me the example** after you start.

## Good to know

- Your business info stays in the `workspace/` folder on your computer (or in your chat, in ChatGPT).
- It never makes up numbers or reviews. If it needs a fact, it asks you.
- It checks every variation against Meta's length limits and ad policies before you see it.
