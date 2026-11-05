# Creative integrations

These eight repositories are included as Git submodules under `integrations/`. Each is pinned to a specific commit in the parent repository, preserving its source, history and MIT license. They remain independent tools with their own setup requirements.

| Repository | Purpose | Upstream |
|---|---|---|
| [take-one](take-one) | Claude Code skill that makes launch videos, ads and music videos from one line: idea, script, visuals, voice, music, edit and review, then a review room where your notes make the next take | [Source](https://github.com/boukess/take-one) |
| [rossark-motion-skill](rossark-motion-skill) | Turn any SVG into a professional 60 fps animation. A Claude Code skill that brings anything drawn to life: live faces, full-body acting and whole scenes, in React Native and SwiftUI. | [Source](https://github.com/boukess/rossark-motion-skill) |
| [huashu-motion](huashu-motion) | 让你的agent一键直出商业级产品宣传片：会作曲，能指着画面改。Commercial-grade launch films by your coding agent . point at the frame to change it. | [Source](https://github.com/boukess/huashu-motion) |
| [reanimate](reanimate) | A Claude Code skill that reverse-engineers any animation frame by frame, then proves the copy moves the same. | [Source](https://github.com/boukess/reanimate) |
| [argo](argo) | Turn Playwright scripts into polished product demo videos with AI voiceover | [Source](https://github.com/boukess/argo) |
| [explainroo](explainroo) | Explainer videos and product demos made by your AI agent. Free and open source: a local voice (Kokoro), word timing (Whisper) and a canvas renderer turn a script into a narrated MP4. | [Source](https://github.com/boukess/explainroo) |
| [video-director](video-director) | A Claude skill for directing, building and verifying code-rendered videos (HTML/Canvas → MP4): principles, gated workflow, QA scripts and evals. | [Source](https://github.com/boukess/video-director) |
| [earshot](earshot) | Ears for coding agents: let AI hear, review and make sound. CPU-only, open source. | [Source](https://github.com/boukess/earshot) |

## Download

For a new checkout:

```sh
git clone --recurse-submodules https://github.com/boukess/AI-employee.git
cd AI-employee
```

For an existing checkout, after pulling the integration commit:

```sh
git submodule update --init --recursive
```

To fetch just one tool:

```sh
git submodule update --init --recursive integrations/earshot
```

GitHub Download ZIP archives do not include submodule contents. Use Git and the commands above. The npm package and the employee installer do not bundle these integrations.

## Use

Open the selected folder and follow its README and any agent instructions there. Install dependencies separately for that tool. Adding these repositories does not install packages, register plugin skills, schedule work, or connect tools to employee routines. The existing employee release rules still govern outbound work.

Each tool retains its own LICENSE file. Consult the pinned tool documentation for system requirements, model downloads, API configuration and any paid services before running it.

## Update a pinned version

Start with a clean submodule working tree. For example:

```sh
git -C integrations/earshot fetch origin
git -C integrations/earshot checkout --detach origin/main
git add integrations/earshot
git commit -m "Update the earshot integration"
```

Review and test the new version before committing the changed pin. Repeat for another tool by replacing its folder name. To restore the versions recorded in the current parent commit, run `git submodule update --init --recursive` with clean submodule working trees. Do not use `--force` to discard local work.
