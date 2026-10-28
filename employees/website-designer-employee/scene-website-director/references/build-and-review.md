# Implementation and review

## Select the technique for the story

| Need | Practical route |
| --- | --- |
| Original abstract moving hero | Adapt the bundled WebGL sculpture |
| Continuous 3D with a scroll story | Adapt the cinematic workbench after inspecting its instructions and source |
| Product, packaging, spatial UI | CSS 3D or an actual licensed product model |
| Founder or editorial portfolio | Spatial gallery, kinetic type, real work samples |
| Complex interactive geometry | Three.js, or React Three Fiber within a compatible React project |
| Cinema-quality fixed camera | Authorized prerendered video/image sequence plus static poster |

A high-quality site usually combines one expressive scene with readable HTML. A renderer cannot supply art direction, business content, or a good asset by itself. The five library layers and cinematic workbench are seeds, not finished member websites. Reuse the existing framework when present; for new work, choose a stack the member can run and maintain. Check dependencies against their installed versions and current official documentation.

Read a selected starter's own setup/build instructions before copying it into the member project. Preserve required license notices. Replace example copy, destinations, assets, scene meaning, and styling using the briefs. Implement the whole agreed website, not only the starter's hero: visitors need to understand the offer, find relevant details, assess genuine proof when available, and take a real next step. Omit an unnecessary section rather than inventing content to fill it.

## Engineering invariants

- Make the offer, navigation, content, and CTA available without the scene. Canvas content must not be the only location of meaningful information.
- Reserve visual dimensions; render a poster or static fallback first. Handle missing files, initialization failure, lost WebGL context, and mobile layout changes.
- Provide reduced-motion and a visible pause control for continuous decorative animation, including animated sections below the hero. Disabling motion must leave content accessible. Avoid scroll hijacking and mandatory intro loaders.
- Cap pixel ratio, pause work when hidden/offscreen, clean up animation frames and event listeners, and avoid creating geometry every frame. Keep one guarded render scheduler per scene; leaving and returning must neither strand the scene nor create duplicate loops. Offscreen pausing belongs to that scene, not unrelated visible sections.
- Make controls keyboard operable with visible focus. In a changing chapter/carousel, synchronize visibility with accessibility state and remove inactive controls from focus order; preserve a sensible focus destination when switching hides the trigger. Respect touch input; hover is an enhancement. Keep text contrast and target sizes usable on phones.
- Coordinate CSS and scene breakpoints. Base sticky scroll progress on the rendered stage dimensions; keep controls inside the visible viewport on short phones. A desktop composition simply scaled down is not a mobile layout.
- Keep secrets on the server. The starter kit has no backend. Connect forms/bookings/checkout only to real authorized destinations; verify success and failure paths before describing them as working.
- Sanitize member-provided text and URLs. Avoid interpolating untrusted text as HTML. Do not store private member research in static public assets.

## Review the actual rendered page

Inspect a narrow phone (~390px), a smaller/shorter phone (such as 320×568 or 360×640), and a desktop (~1440px). For layouts that switch from columns to stacking, also inspect an intermediate width and the boundary on either side of that switch. Check reading order, no horizontal overflow, headline wrapping, CTA reachability, scene cropping, contrast, keyboard focus, and navigation destinations. Also inspect reduced motion, paused motion, failed 3D, and unavailable JavaScript where relevant. Test the deployed environment separately when publication is requested.

Run the project's build and appropriate checks. Record errors and fix them. Use meaningful tests for forms, routing, data handling, or export logic; avoid tests that merely duplicate the code. Capture screenshots and compare them with the chosen direction. Repair the largest visual defect first, then inspect affected views again.

Scale verification to the change. A small reversible copy or color edit usually needs an affected-view check, not a new automated test suite. Re-run broader checks when behavior, breakpoints, deployment, or previously passing states have changed.

### Motion acceptance for a cinematic brief

1. **Start in normal motion.** Confirm reduced-motion emulation is off, the page is foregrounded, and animation is resumed. Watch 10–15 seconds after scene readiness without hovering. The defining movement must be clearly observable within the first two seconds and sustain the intended visual interest. Compare its visible scale and pace with the reference and design brief; a running renderer with imperceptible drift fails this check.
2. **Watch the scroll story.** Traverse the animated sequence at roughly 0%, 25%, 50%, 75%, and 100%, then reverse. Observe the transitions as well as those positions. Verify that the main objects, camera changes, and foreground content remain coherent, readable, and visible rather than covered by overlays or cropped away. If scroll choreography is intentionally absent, record why it fits the brief.
3. **Check the phone payoff.** Repeat normal playback and scrolling at a narrow phone size and a short viewport. The central visual effect must remain apparent; it must not shrink into an unreadable miniature, disappear behind content, or push essential controls outside the viewport.
4. **Test alternate states separately.** Pause and resume; leave and return to the tab and scene; then check reduced motion. Pausing should stop continuous decoration, resuming should restore it, and reduced motion must preserve all content and controls. Offscreen optimization must not freeze another visible section. Restore normal motion and the initial scroll position before final visual acceptance.
5. **Record observable evidence.** Prefer a short recording; otherwise document the actual live playback observations, tested viewport, motion settings, and scroll states. Screenshots validate composition, and frame counters help diagnose rendering; neither alone proves perceptible motion. Mark any playback check you could not observe as untested, fix failures, and repeat the affected sequence before handoff.

Performance targets are goals to measure: LCP at most 2.5s, INP at most 200ms, and CLS at most 0.1 at the 75th percentile of real visits. Local tests are preliminary, not proof of field performance. See [Web Vitals](https://web.dev/articles/vitals).

## Version-specific implementation notes

Check installed versions and matching official docs before introducing dependencies; do not assume the latest R3F supports an existing project's React version. With on-demand rendering, imperative animation needs frame invalidation. See [R3F introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) and [performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

For GSAP responsive or reduced-motion branches, consult the installed version's matchMedia API and dispose timelines/listeners on unmount. See [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) and [React integration](https://gsap.com/resources/React/). GSAP is optional; do not infer a reference site's dependencies from appearance.

For custom Three.js materials and post-processing, follow current [color management](https://threejs.org/manual/pages/color-management.html). CSS perspective examples use different capabilities; [transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style) can be flattened by parent effects.

## QA report

Keep `QA.md` concise: tested environment, dimensions, build result, scene and fallback result, keyboard/touch observations, real CTA destinations, asset provenance, measured performance if any, and unresolved work. For cinematic briefs, include normal-playback and scroll observations separately from pause/reduced-motion checks. Label each outcome **pass**, **needs work**, **untested**, or **not applicable**. Record the test method and observed evidence separately from the outcome. Do not fabricate a Lighthouse score or promise conversion improvement.

## Publish, hand off, and maintain

Follow the member's requested destination and existing authorization. Complete the reviewable build first; do not ask again for publication already authorized in the conversation. The kit itself does not authorize purchases, paid subscriptions, a new domain, or messaging third parties. If access or a material decision is missing, finish independent work and ask only for the missing requirement.

Publish only the public output directory and required assets, not the whole member project, private briefs, local source research, or credentials. Verify the hosted URL, asset loading, and intended access level in the deployed environment. A successful upload or local preview does not establish that an intended public visitor can open the page.

Record the actual source directory, commands, output path, hosted state, and unfinished integrations in `PROJECT-STATUS.md`. Provide short customization notes for copy, assets, colors, motion, and primary destination. On maintenance requests, read the saved project records, preserve approved design and behavior, make the requested change, and verify its affected states. Update the relevant records and tell the member what changed, what was checked, and any material remaining limitation.
