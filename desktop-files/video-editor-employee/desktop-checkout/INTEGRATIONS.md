# Video Editor integrations

The talking-head pipeline stays the desktop pack on IBP_Desktop at `C:\Users\blood\AI Video Editor`, in free DaVinci Resolve mode. Remotion still makes the graphics inside that pack. These tools sit beside it. They are pinned as Git submodules under `integrations/` in the AI-employee repository. This kit does not vendor their source.

Check one out from the AI-employee repository:

```bash
git submodule update --init --recursive integrations/explainroo
```

`node scripts/integration-check.mjs` prints whether each folder is present. `empty` or `missing` means it is not checked out yet. GitHub ZIP downloads do not include submodule contents.

Read each tool in place and follow its own license. Concat is AGPL-3.0-or-later. Run it as its own program. Do not copy its files into this MIT kit.

genoffice is in the same `integrations/` folder. It is an office suite. It is not part of this employee's work. Do not wire it into an edit.

The longer free-Resolve note lives in `docs/video-effects/FREE-DAVINCI-RESOLVE.md` in the AI-employee repository. That file is the source if this summary and that file ever disagree.

## Free Resolve, the default path

Free DaVinci Resolve 21.1.2 is what IBP_Desktop has. Since Resolve 21.1, Python and external scripting are Studio only, so this pack does not drive Resolve with a script.

Free mode is `"resolve_edition": "free"` in the pack's `config/editor.json`, or the environment variable `AI_VIDEO_EDITOR_RESOLVE_EDITION=free`.

| Step | What free mode does |
|---|---|
| doctor, new, analyze, presenter, prepare, motion | Unchanged. Transcription, the presenter matte, audio, and Remotion do not use Resolve. |
| assemble | Writes `jobs/<job>/resolve-free/<name>.fcpxml` and `IMPORT-INTO-RESOLVE.txt`. |
| render | FFmpeg composite to an 8-bit H.264 MP4. |
| finish | Frame, duration, and loudness checks, then `exports/`. |

Use the free_render values already in the pack config. Do not restate them here. Free mode refuses sizes above the free edition's limits. The pack's default vertical 1080x1920 at 30 fps is inside those limits. Opening the FCPXML in free Resolve is optional hand polish. No script has to be installed into Resolve.

Say "Edit my video" for a clip in `inbox`. That sentence means this path, not a code-film tool.

## Which tool

| The member wants | Use | Status |
|---|---|---|
| Talking-head clip, "Edit my video" | Desktop pack, free Resolve mode, Remotion, FFmpeg, FCPXML | Ready on IBP_Desktop once the PC is on. Not this Linux checkout. |
| Narrated explainer, diagram, how-to, drawn product demo | explainroo | Needs install. Upstream CI covers Linux, macOS, and Windows. |
| Launch film, point at a frame, local score | huashu-motion | Needs install. Upstream tested on macOS only. Run `om doctor` before trusting Windows. |
| One-line studio film and a review room | take-one | Needs install. Upstream has been run on macOS only. Code-only path is free. |
| A running web app, captured with narration | argo | Needs install. Kokoro is the local voice. Cloud voices are optional and paid. |
| A timed plan and a measured check of a code film, including Remotion | video-director | Needs install. It does not edit live-action footage. |
| Match a site, recording, gif, or Lottie in code | reanimate | Needs install. macOS and Linux. Windows untested. |
| A drawing, logo, or mascot that should feel alive | rossark-motion-skill | Instructions are usable anywhere. The Swift offline renderer is macOS only. |
| Judge a mix, or make sound effects in code | earshot | Needs install. `measure`, `sfx`, and `kit` need no model download. |
| A soundtrack from real licensed recordings | real-sound, which ships inside earshot | Needs install with earshot. Do not commit the audio into this kit. |
| A scriptable editor for cuts Resolve cannot drive | Concat, separate process | Needs install. Windows x86_64 builds exist. Do not vendor the AGPL source. |

Pick one primary tool. video-director and earshot are checks you add on top. Do not start take-one, huashu-motion, and explainroo for the same film.

## How to run

Paths are from the AI-employee repository root, after the submodule is checked out. Each skill under `.agents/skills/` points at the upstream file. Follow that file. Do not paste it into this kit.

### explainroo

Skill: `integrations/explainroo/skills/explainroo/SKILL.md`. Also read `integrations/explainroo/AGENTS.md` before a video.

```bash
node integrations/explainroo/bin/explainroo.js doctor
node integrations/explainroo/bin/explainroo.js --help
```

Needs Node.js 20.11 or newer, ffmpeg, and Chrome or Chromium. `doctor --fetch` downloads the English voice and timing models, about 400 MB. Wait until a narrated render is actually requested. espeak-ng is only for Spanish, French, Italian, Portuguese, and Hindi. Japanese and Chinese need Python with misaki. ElevenLabs and OpenRouter images are optional and paid. Do not put keys in this kit.

### huashu-motion

Skill: `integrations/huashu-motion/skills/huashu-motion/SKILL.md`. The CLI is `bin/om` in that skill folder.

`om doctor` reports what is missing. Needs Node 22 or newer, Chrome, Chromium, or Edge, and ffmpeg. `om samples build` is an optional instrument pack of about 55 MB. Without it the score uses synths. Kokoro narration is an optional model download of a few hundred MB. Upstream says the tool has been tested on macOS only. No paid key is required for the score.

### take-one

Skill: `integrations/take-one/SKILL.md`.

```bash
bash integrations/take-one/scripts/doctor.sh
```

Needs Node 18 or newer, Google Chrome, and ffmpeg. Upstream has been run on macOS only. The code-only path is the default here. Higgsfield, Seedance, Kling, Suno, and ElevenLabs are optional. Ask before any paid call, with the price. Do not create those accounts during setup, and do not put a key in this kit.

### argo

Skill: `integrations/argo/skills/argo-guide/SKILL.md`.

Upstream's usual install in a demo project is `npm i -D @argo-video/cli`, then `npx argo doctor`, `npx argo init`, and `npx argo pipeline <name>`. The pinned source is `integrations/argo`. If the npm package and the pin differ, say which one you ran.

Needs Node, Playwright Chromium, and ffmpeg. Local voice: `npm i kokoro-js@1` (no key, a few hundred MB). OpenAI, ElevenLabs, Gemini, and Sarvam are optional paid voices. Ask first. Do not put keys in this kit.

### video-director

Skill: `integrations/video-director/video-director/SKILL.md`.

```bash
python3 integrations/video-director/video-director/scripts/check_timeline.py timeline.json
python3 integrations/video-director/video-director/scripts/qa_video.py film.mp4 --out qa/
```

Needs ffmpeg, ffprobe, Python 3, numpy, and Pillow. The film's own renderer (Remotion, or Node with Playwright) still makes the frames. faster-whisper is optional.

### reanimate

Skill: `integrations/reanimate/skills/reanimate/SKILL.md`.

```bash
bash integrations/reanimate/skills/reanimate/scripts/setup.sh
```

Then the upstream `bun` scripts. `bun <skill>/scripts/<name>.ts --help` is the pattern in the skill. Needs Bun 1.1 or newer. The first run downloads ffmpeg and Playwright Chromium, about 250 MB. No API key. macOS and Linux are the tested platforms. Windows is untested. Clone only motion the member may reuse. Fonts and images from another site stay under their owners' terms.

### rossark-motion-skill

Skill: `integrations/rossark-motion-skill/SKILL.md`.

Copy upstream `MOTION.md` next to the art on the first job. Templates are in `templates/react-native/` and `templates/swiftui/`. The Swift demo renderer in the upstream README targets macOS 14 or newer. Do not claim it ran on Windows. React Native and the web method need those stacks installed.

### earshot

Skills: `integrations/earshot/skills/earshot/SKILL.md` and `integrations/earshot/skills/real-sound/SKILL.md`.

```bash
python3 -m venv integrations/earshot/.venv
integrations/earshot/.venv/bin/python -m pip install -e "integrations/earshot[mcp]"
integrations/earshot/.venv/bin/python -m earshot doctor
```

On Windows the interpreter is `.venv\Scripts\python.exe`. Needs Python 3.10 or newer and ffmpeg. CPU only. The upstream README installs CPU torch before the package. `doctor --fetch` downloads about 1.1 GB of models. `measure`, `sfx`, and `kit` load none. Fetch models only for a listening command.

The `llm` command calls Gemini only with the member's key and an explicit yes. Never write that key into this kit.

Quote earshot's numbers when you report how something sounds. real-sound is for a soundtrack made of real licensed recordings. If the member did not ask for that, use earshot `sfx` or `kit`. Do not commit downloaded recordings into this kit. Write credits with the film.

### Concat

Read `integrations/Concat/README.md` and `integrations/Concat/docs/MCP.md` in place.

License: AGPL-3.0-or-later. Upstream also offers a commercial license for closed-source use. This kit stays MIT by not containing Concat's code.

On Windows, install the x86_64 release from Concat's GitHub releases. A source build needs Rust 1.93 or newer, FFmpeg 7 development libraries, cmake, and a C++ compiler, then `cargo run -p concat` from `integrations/Concat/src`. The Cargo workspace is `src/`, not the repository root.

`concat --mcp` is the agent entry once the binary is installed. Optional caption, voice, and cutout models download inside the app. No key goes in this kit. The developer skill `.claude/skills/run-concat/SKILL.md` is for people changing Concat. Do not follow it for a member edit.

## Holds

Draft, render, and leave the file. Do not publish, post, send, or spend unless the member names that action. Do not create a paid account during setup.

## Still to install on IBP_Desktop

Already there: free DaVinci Resolve 21.1.2, the AI Video Editor pack in free mode, Node.js and Python as named in `docs/video-effects/AI-VIDEO-EDITOR-GROK.md`, FFmpeg used by the pack, and Remotion inside the pack.

Still to do in the AI-employee checkout on that PC:

1. `git submodule update --init --recursive` for the tool the job needs.
2. Put ffmpeg on PATH for these tools, not only inside the pack.
3. Chrome or Edge for explainroo, huashu-motion, take-one, and argo.
4. explainroo: `node bin/explainroo.js doctor`. Run `doctor --fetch` only when a narrated video is requested.
5. earshot: create the venv and run `earshot doctor`. Fetch models only when a listening command needs them.
6. video-director: install numpy and Pillow in the environment that runs the QA scripts.
7. argo: Playwright Chromium, and kokoro-js if the voice should be local.
8. reanimate: install Bun, then `setup.sh`. Treat Windows as unproven until that script prints ready.
9. huashu-motion and take-one: run their doctor on this PC. A macOS-only upstream note is not a Windows pass.
10. Concat: install the Windows release build. Do not copy the submodule into the pack.
11. No API keys in the repository.

## Smoke test, 7 Nov 2026, Linux

explainroo at the pinned commit `e95232c8`:

- `node bin/explainroo.js --help` exited 0 (explainroo 0.4.1).
- `node bin/explainroo.js doctor` exited 0. Node v22.23.4, ffmpeg 6.1.1, and Google Chrome were present. The voice model, the speech-check model, and the non-English Whisper model were not downloaded. espeak-ng and misaki were absent. Those are optional language pieces.
- `node --test test/script.test.js test/engine-pure.test.js test/timeline.test.js` passed 16 tests.
- npm install was not required for those commands. A narrated render was not run.

The other video tools were not executed here. Concat was not built. This machine's Rust is 1.83, and Concat asks for 1.93, so a source build was not attempted.
