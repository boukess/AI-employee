---
name: cardboard-video
description: Edit videos with Cardboard, the agentic AI video editor, through its MCP server. Use when the user or a hired employee (most often the Social Media employee) wants a video cut, trimmed, reordered, captioned, titled, voiced over or exported, or wants a rough cut from raw clips or a link. Works alongside the effect briefs in docs/video-effects. It drafts the edit and hands back a preview. It never publishes or posts anything.
---

# Edit Video with Cardboard

Cardboard is a hosted AI video editor. It makes editing decisions the way a human editor would: it cuts, trims, reorders clips, adds titles and captions, and uses generation only where needed, such as a voiceover. This plugin connects to it through the MCP server declared in `.mcp.json` at the plugin root:

```
https://mcp.cardboard.ai/mcp
```

The user needs their own Cardboard account. The first time a Cardboard tool is used, Claude Code asks them to sign in. You never ask for, type or store their password or any token.

## 1. Check the connection

Before anything else, look for tools whose names start with `mcp__cardboard` (or `mcp__plugin_ai-employees_cardboard`). If they are deferred, load them with ToolSearch using the query `cardboard`.

If no Cardboard tools exist, or they report that authentication is needed, stop and tell the user:

> Cardboard is not connected yet. Run `/mcp` in Claude Code, pick `cardboard`, and sign in with your Cardboard account. Then ask me again.

Do not fall back to another editor without asking.

## 2. Read the tools, do not guess them

Cardboard owns its tool list and can change it. Read the names and descriptions you loaded and use those. Do not invent tool names or parameters. If a step below has no matching tool, tell the user what is missing instead of improvising.

## 3. Get the footage in

Ask which footage to use if it is not clear. Cardboard accepts:

1. Files on the user's computer or phone, uploaded through Cardboard's upload flow.
2. A link to a video.

Only use footage the user named. Never pull clips from a folder or link they did not point you at.

## 4. Brief the edit like an editor

Turn the request into a short, concrete brief before calling the edit tool:

1. **Goal and platform.** For example, a 30 second vertical reel for Instagram, or a 9:16 TikTok.
2. **Length and pacing.** Target duration, and whether to cut dead air and filler words.
3. **Structure.** Hook in the first 2 seconds, then the order of beats.
4. **Text.** Titles, captions on or off, brand colours if known.
5. **Audio.** Keep original audio, add music, or add a voiceover.

If the user wants specific motion graphics (checklists, charts, orbits and similar), use the briefs in `docs/video-effects/HOW-TO-ASK-GROK-FOR-EFFECTS.md` for wording, and tell the user which effects Cardboard can and cannot do.

When the brief is ambiguous on goal or length, ask one question. Otherwise proceed.

## 5. Review, then iterate

After Cardboard returns an edit, give the user the preview or project link and a three line summary: what was cut, the final length, and what was added. Then offer the obvious next adjustments in plain words, for example tighter pacing, bigger captions, or a different hook.

Apply corrections exactly as given. If a hired employee is running this, log each correction the same way the kit logs any other correction so the employee improves from it.

## 6. Export and hand over

Export only when the user says the edit is final. Return the export link or file. Do not post, schedule or publish the video anywhere. Publishing is the user's last click, the same rule every AI Employee follows.

## Cost note

Cardboard is a paid service billed by Cardboard, not by this plugin. Long exports and generated voiceovers may use more of the user's plan. Mention this before running a large batch.
