# If something gets stuck

Tell your AI: **“Read docs/TROUBLESHOOTING.md, fix the issue, and resume my edit.”** Include the visible error if the session cannot see it.

| What you see | What the AI should do |
|---|---|
| The AI only writes advice | Confirm a local ChatGPT/Codex or Claude Code session with this folder and a working shell. A cloud chat cannot run the local Resolve bridge. |
| “Python” or “Node” missing | Help install the versions in SETUP.md. Restart the AI app to refresh its PATH. Re-run setup. |
| ResolvePython missing | Check for Resolve Studio 21.1+, the standard executable path and a custom install override. Do not silently switch renderers. |
| Free DaVinci Resolve installed | Use free mode: `"resolve_edition": "free"` in config/editor.json. See docs/FREE-RESOLVE.md. |
| Resolve disconnected | Open Resolve fully, enable External scripting: Local, then rerun doctor. Check edition and version. |
| Download failed | Retry the failed official dependency download. Keep existing files; verify the matting model's hash. Do not disable certificate verification. |
| First transcription seems slow | The model may be downloading/loading. Inspect the running process/log, avoid launching duplicate jobs. |
| No speech or wrong voice | Inspect input audio tracks, set audio_stream for the intended dialogue and normalize a new job. Do not use corpus audio. |
| Transcript attached words to the wrong take | Transcribe short source intervals around the restart and correct source-time phrases/cuts. |
| Head too high, low or cropped | Calibrate presenter scale/offset from the real source. Rebuild the plate and inspect hair/headset edges at multiple times. |
| Pause or join feels abrupt | Adjust both sides of the cut from the waveform and real speech. Do not automatically delete every quiet interval. |
| Wrong screenshot or generic animation | Research the exact topic, inspect acquired media, then replace the scene while preserving the house style. |
| Render failed or disk full | Inspect the job logs, fix the cause, and resume. Ask before deleting member files. ProRes intermediates can be large. |
| Final export already exists | Use feedback to create a revision and export v02, v03, etc. |
| You moved the employee folder | Recreate .venv at the new location, rerun setup and reassemble saved jobs so Resolve media paths are refreshed. |

The Windows adapter is provided but has not been rendered on Windows. If it fails, retain its error text and use the verified macOS route until the platform issue is resolved.
