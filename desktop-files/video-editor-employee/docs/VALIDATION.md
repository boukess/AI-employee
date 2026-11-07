# Release validation — 1.0.0

Verified 25 September 2026 on Apple Silicon macOS with Resolve 21.1.0.17.

- Installed into a fresh Python 3.12 virtual environment using the shipped setup script; npm ci installed the pinned JavaScript dependencies. The RVM download passed its recorded SHA-256 check and the Remotion browser was installed.
- The real Resolve connection reported ready. All 38 bundled reference clips were indexed with no missing files.
- Passed 14 unit tests covering half-open cuts, caption retiming, quiet handles, relative configuration paths, custom Resolve paths and inbox state handling.
- TypeScript compilation passed for the shared components and included motion example.
- Ran a short spoken-video integration test through intake, normalization, multilingual transcription, corpus retrieval, foreground matting, graphics rendering, Resolve assembly/render and final delivery.
- Actual test export: 144 frames, 4.800 seconds, 1080 × 1920 at 30 fps, H.264/AAC. Full decoding and exact picture duration checks passed.
- Measured final test audio: -12.24 LUFS integrated, -1.45 dBTP. The accepted full-length example was separately measured at -12.12 LUFS and -1.36 dBTP before the smaller preview copy was made.
- Inspected a rendered test frame and the start-guide layout. Packaged local links, reference paths and example asset hashes were checked. The ZIP was reopened and its file checksums verified.

The finished example is a 720p viewing copy of the accepted 39-second demonstration. New member exports remain 1080 × 1920. The test input, temporary render and machine-specific job reports are excluded from the release.

Windows has a launcher, setup path and ResolvePython auto-discovery, but has not been end-to-end rendered on Windows. This local execution test was performed through Codex; the documented Claude Code handoff has not been run in a separate Claude session. New recordings still need per-video editorial decisions, source-media research and framing/matte calibration by the active AI editor. Rendering successfully is not a guarantee of identical creative quality for every input.

No review, critique or delegated agents were used. The human supplies creative feedback on the final MP4.
