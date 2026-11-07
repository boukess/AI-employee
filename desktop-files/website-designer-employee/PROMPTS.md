# Prompts for your Website Designer

Replace the bracketed parts. These are requests to your coding agent, not commands to paste in a terminal.

## Build my site

```text
Read START-HERE.md and AGENTS.md in this folder. Act as SCENE, my Website Designer AI Employee, using the included skill, original library, and cinematic starter when appropriate.

Learn from this conversation, the project materials I provide, and relevant public sources I authorize. Ask only for essential missing information. Build a complete, original website in member-projects/<my-brand>/ and keep the briefs, asset record, project status, and honest QA report with it.

My business or personal brand is [name].
We help [audience] with [offer].
Visitors should [primary action + destination, if known].
My current website and brand materials are [links or files].

Choose a visual direction that fits this brand. Implement the site, run it, inspect visible motion over time and on phones, and fix the problems you find. Tell me specifically if your tools cannot perform any part of the review. Give me the local preview and editable project when ready.
```

## Improve a specific detail

```text
Continue my website in member-projects/[project]. Read its PROJECT-STATUS.md and briefs first. Change [specific section or behavior] so that [desired result]. Preserve the established brand and working features. Implement the change, review the affected desktop and phone views and motion, fix regressions, and update the QA and project status.
```

## Run quality control

```text
Review my website in member-projects/[project] as a visitor. Verify real visible animation over 10–15 seconds, every scroll chapter and reverse scrolling, pause/reduced motion, desktop and narrow phones, keyboard navigation, readable text, factual claims, assets, links, and the primary action. Fix issues you can verify. Separate passed, failed, and untested checks in QA.md. Do not claim a form works unless a real receiving service was tested.
```

## Publish my site

```text
Publish the finished site in member-projects/[project] to [my existing hosting destination, or ask me to choose if missing]. Use the access and publishing authorization I have already provided. Complete the final local checks first. Do not purchase a domain, start a paid plan, or change access to unrelated resources. If the host requires a step only I can complete, give me the specific step. Verify the resulting URL is public while signed out, test the main action, and save the deployment details and remaining limitations in PROJECT-STATUS.md.
```

## Continue in a new chat

```text
Continue the website in member-projects/[project]. Read AGENTS.md, the Website Designer skill, and the project's PROJECT-STATUS.md, BRAND-BRIEF.md, DESIGN-BRIEF.md, ASSET-MANIFEST.md, and QA.md. Inspect the actual files before making changes. Tell me briefly what is working and what remains. My next request is [change].
```

## Create another brand

```text
Use this employee for a new website: [name, audience, offer, primary action, brand materials]. Start a separate member-projects folder. Develop an original direction for this brand; use the library or cinematic starter only if it fits. Keep all existing projects intact. Build and review the new site through the full employee workflow.
```
