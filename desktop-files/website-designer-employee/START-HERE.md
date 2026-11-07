# Website Designer AI Employee

**Your employee is SCENE. Your business sets the direction.**

This downloadable employee runs inside Claude Code or Codex. It also runs with **Grok Bot** (see GROK.md). It brings a discovery process, original design starters, build instructions, review standards, and project records to your coding agent. It is not a separately hosted chatbot or a promise of an identical result on every machine.


## Grok Bot (this fleet)

This kit also runs as a **Grok Bot** teammate. Prefer **GROK.md** and **docs/SETUP-GROK.md**. Open the Website Designer Employee chat, or this folder as the local project. Member sites live under `member-projects/<brand>/`. The current BOUKE project is `member-projects/bouke/`.

## Start here

1. Unzip the whole `Website-Designer-AI-Employee` folder. Keep its contents together.
2. Optional: open `OPEN-WEBSITE-DESIGNER.html` for a friendly guide and links to the visual library.
3. Open the unzipped folder as the working project in Claude Code or Codex. Paste the launch prompt below and replace the bracketed details.

```text
Read START-HERE.md and AGENTS.md in this folder. Act as SCENE, my Website Designer AI Employee, using the included skill, original library, and cinematic starter when appropriate.

Learn from this conversation, the project materials I provide, and relevant public sources I authorize. Ask only for essential missing information. Build a complete, original website in member-projects/<my-brand>/ and keep the briefs, asset record, project status, and honest QA report with it.

My business or personal brand is [name].
We help [audience] with [offer].
Visitors should [primary action + destination, if known].
My current website and brand materials are [links or files].

Choose a visual direction that fits this brand. Implement the site, run it, inspect visible motion over time and on phones, and fix the problems you find. Tell me specifically if your tools cannot perform any part of the review. Give me the local preview and editable project when ready.
```

You can start with a brief answer and a website URL. The employee should use available context before interviewing you. It should explain which sources it used and ask only a few useful questions. You do not need to fill in all the templates yourself.

## What you get

| Included | What it does |
| --- | --- |
| `AGENTS.md` and `CLAUDE.md` | Point your agent to the complete employee instructions |
| `scene-website-director/` | Discovery, art direction, implementation, testing, and handoff |
| `library/` | Five original HTML scenes and an offline gallery with tailored build prompts |
| `starters/cinematic-workbench/` | Full scroll-driven Three.js website starter derived from the Lab demo, with generic content and original art |
| `templates/` | Brand/design briefs, asset provenance, QA, and project status |
| `PROMPTS.md` | Ready-to-use build, revision, review, publish, and maintenance requests |
| `mcp-server/` | Optional read-only bridge to the five single-file library scenes |

The cinematic starter includes editable source and a compiled preview. Open `starters/cinematic-workbench/dist/index.html` to explore it, or ask your employee to run a local preview server. Double-clicking a scene in `library/layers/` works directly. The MCP bridge is optional and does not deliver the multi-file cinematic starter.

## Your first build

Give the employee your real offer, audience, tone, photos or logo, and the intended action. It creates `member-projects/<your-brand>/` so your site stays separate from the reusable kit. Keep that folder for future updates. It should contain the site, brief, asset record, review report, and project status.

Choose one primary goal: book a call, join a community, view a portfolio, or buy an actual product. Buttons need real destinations. A contact form needs a connected service before it can receive messages. The bundled previews do not include payment, CRM, login, or lead collection.

## Review and publish

Watch the opening for 10–15 seconds, scroll down and back up, and use the controls. Open the site on a narrow phone-sized screen. Check the words, links, brand assets, and main action. Your employee should fix the issues and record anything it could not verify.

When ready, use the publish prompt in `PROMPTS.md`. Publishing depends on the available host and your account access. Test the final URL while signed out; a local or authenticated preview is not a shareable public site. AI usage, domains, hosting, image generation, and optional services may have separate costs.

## Make it reusable

The folder-reading workflow needs no global installation. If you later want a named skill, ask your agent to inspect your installed app's supported skill setup and register the complete `scene-website-director` folder with its references, retaining access to this kit. Start with the direct-folder workflow above.

Need inspiration? [See the AI Employee Lab example](https://ai-employee-lab-scene.kyleherbel.chatgpt.site/). Its editable source is a separate download in Lesson 6. Replace its identity and assets for your own business.
