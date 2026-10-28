# AI Ad Copywriter

An AI employee that writes Meta ad copy (primary text, headline, description) for your own ad creatives. It bases the copy on the ads already running in your niche, and gives you three variations with different angles.

Runs in **Claude Code**, **Codex**, or **ChatGPT**. New here? Read **START HERE.md**.

## The workflow

```
"go"
  -> Interview        your business, offer, audience, voice         workspace/brand.md
  -> Research         real ads from the Meta Ad Library               workspace/corpus/CORPUS.md
  -> Study            what the long-running ads have in common        workspace/corpus/PATTERNS.md
  -> Your creative    image or video, read frame by frame             (creative read)
  -> Copy             3 variations, checked against Meta's rules      workspace/copy/<date>-<name>.md
```

## What's in the folder

| Path | What it is |
|---|---|
| `AGENTS.md` | The AI employee's job description and rules. Codex and ChatGPT read this. |
| `CLAUDE.md` | Claude Code's entry point. It loads AGENTS.md. |
| `docs/` | Step-by-step instructions the AI follows, the Meta playbook, and the setup guides. |
| `scripts/adlibrary.py` | Turns copied Ad Library pages into a ranked, de-duplicated corpus, with statistics. |
| `scripts/creative.py` | Pulls frames, a contact sheet and a transcript from video ads, and reads image sizes. |
| `scripts/checkcopy.py` | Checks copy for length, hook placement, policy risks, machine-sounding phrases, too-similar variations, and copying from competitors. |
| `prompts/` | Ready-to-paste prompts (the ChatGPT kickoff and others). |
| `examples/ai-employee-lab/` | A worked example for a real business: the brand file and a video creative read. |
| `workspace/` | Your data. Starts empty. |

The scripts use only Python's standard library (3.8 or newer) and make no network calls. Video frames use ffmpeg if it's available, and transcripts use a speech-to-text package if one is installed. Both are optional.

## How the research works

The Meta Ad Library (facebook.com/ads/library) is public and shows every active ad on Facebook and Instagram. The copywriter gets ads from it in one of these ways:

- **Its own browser**, if your AI tool has one (for example Claude in Chrome, or ChatGPT Agent mode). It opens the searches the way a person would.
- **Copy and paste.** It gives you the search links. You open each one, select all, copy, and paste. About a minute per link.
- **Your own swipe file**, if you already keep one.

It ranks ads by how long they've been running, because advertisers don't keep paying for ads that don't work. It treats anything running 30+ days as proven.

## Honest limits

- The Ad Library shows ad text and dates, not results. "Running a long time" is a strong sign an ad works, not proof.
- Copy is half the ad. The creative usually matters more. This tool makes your copy match your creative and the niche. It can't fix a weak creative.
- Video transcripts need a speech-to-text package. Without one, it asks you for the script.
- Meta's rules and placements change. The playbook in `docs/meta-playbook.md` was last reviewed in October 2026.

## Grok Bot (BOUKE fleet)

Prefer `GROK.md` and `docs/SETUP-GROK.md`. Member work stays in `workspace/`.
Host: https://ai-employee-bouke1.vercel.app
