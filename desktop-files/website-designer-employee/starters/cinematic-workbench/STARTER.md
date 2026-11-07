# Cinematic Workbench

An original, fully editable **fictional** website starter. It includes the complete cinematic system: 44 luminous 3D paths, 96 traveling particles, reflective dimensional folders, a final signature-shape morph, a moving project-file illustration, three scroll chapters, content reveals, and interactive content panels.

## Open the example

Open `dist/index.html` in a current browser. The compiled example works offline: its renderer, fonts, scripts, and assets require no external runtime services. For development, a local static server is also suitable. Append `?render=static` to deliberately use the original SVG poster.

No account, paid asset subscription, or build step is needed to view the supplied example. The `dist` folder is the runnable website; keep its files together.

## Give this to the Website Designer

Ask the employee to use this **as implementation material, not as a universal brand direction**. Provide your actual offer, audience, desired visitor action, authorized imagery, and any existing brand constraints. Let it choose typography, palette, visual subject, motion purpose, content, and layout that suit your brand.

Before publishing, the employee must:

- Replace **Your Brand**, all instructional/example copy, the placeholder mark, and the story illustration with an intentional brand identity and truthful content.
- Replace the final signature motif when it does not fit the brief. The supplied light-vessel silhouette is an illustrative geometric study, not a product, a universal brand symbol, or a claim about the member's business.
- Remove irrelevant sections. Do not manufacture testimonials, projects, product images, prices, biographies, or results to fill the layout.
- Connect the primary CTA to a real, authorized destination and test it. Current CTAs lead to real sections of this example. There is **no contact form, email address, booking, checkout, backend, or external service**.
- Update title, description, favicon, and any intended social metadata. There is no inherited domain or hosting identity. Keep the current `noindex,nofollow` during draft work; remove it only when the finished site is intentionally ready for search indexing.
- Verify the changed design in a browser at desktop and mobile widths, including 390×700, 320×568, and both sides of the 700 px breakpoint. Copy changes can alter layout; inherited renderer checks are not a substitute for checking the new page.

Do not deploy this unedited example as a finished business website. No publishing or paid-service authorization is implied by the kit.

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/index.html` | Semantic content, headings, navigation, CTA destinations, metadata |
| `dist/styles.css` | Layout, type, colors, responsive rules, CSS motion |
| `dist/app.js` | Chapter coordination, illustrated sequence text, content-panel examples, menu and motion controls |
| `src/scene.js` | Original 3D shapes, shader colors, materials, camera, scroll morph, particles and renderer lifecycle |
| `dist/scene.js` | Compiled renderer; regenerate from source rather than editing directly |
| `dist/assets/` | Original placeholder mark, poster, and story illustration |
| `dist/THIRD-PARTY-LICENSES.txt` | Required notice for the locally bundled Three.js code |

The renderer interface is `window.WorkbenchScene`: `setProgress(0..1)`, `setPaused(boolean)`, `setAccent(hex or index)`, `pulse()`, and `destroy()`. It emits `workbench:scene-ready` and accepts `workbench:motion` with `{paused}`. These are internal integration hooks, not visitor instructions.

## Rebuild the renderer

For source edits, install the locked development dependencies with `npm ci`, then run `npm run build` from this folder. The package pins Three.js 0.186.1 and esbuild 0.28.2. Rebuilding requires the normal Node.js/npm toolchain. The output stays in `dist/scene.js`; the other editable website files remain intact.

The supplied bundle was built from the included source using those versions. `node_modules`, repository history, hosting configuration, creator photographs, and private project files are deliberately absent.

## Motion, access, and performance

The starter keeps semantic content outside the decorative canvas. It includes visible pause controls, system reduced-motion support, static fallback, keyboard chapter controls, focus handling before panels become inert, responsive navigation, a global pause control below the hero, and rendering suspension when hidden or offscreen. Reduced motion uses discrete chapter poses; a paused illustration can advance one step intentionally.

The scene uses one renderer animation scheduler, static geometry, and capped pixel density: 1 on mobile, up to 1.4 on desktop, with a further 1.7-million-pixel budget. The renderer exposes `data-render`, `data-phase`, `data-time`, `data-frame`, and `data-progress` on `.scene-world` for inspection. A time counter alone does not verify that motion looks right; inspect the rendered scene too.

Bloom and transparent 3D materials cost GPU time. This is a substantial cinematic implementation, not a promise of a performance score on every device. Simplify the scene when a member's audience or brand would benefit from a lighter experience. No field-performance, conversion, or business-results claim is included.

## Provenance and limits

The supplied mark, illustration, poster, geometry, motion composition, and sample copy are authored starter material. They do not depict an actual founder, product range, customer project, or operating service. Three.js is distributed under its included MIT license. Retain that notice with redistributed or published bundles. Added imagery, fonts, code, and other assets need their own source and permitted-use records.

This is one implementation starter inside the Website Designer employee kit. It does not replace discovery, original art direction, truthful content, real integrations, or browser review.
