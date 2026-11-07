# Art direction: cinematic websites with a reason to exist

Use this playbook after identifying the brand, audience, offer, and primary action. Every scene must help visitors understand, trust, or remember the offer.

## Translate the reference into principles

Use the member's reference when one is supplied. Identify what is observable: subject, lighting, composition, hierarchy, continuous movement, interaction, and scroll progression. A still image cannot establish the animation technique, and a polished result does not reveal its creator's private prompts or production process. Without a reference, define the intended visual effect from the brand brief.

Extract these reusable principles:

- **One dominant scene:** concentrate visual complexity around one meaningful subject; leave readable space for the message.
- **Depth with restraint:** use overlap, perspective, shadows, and foreground/background separation to establish hierarchy.
- **Continuous visual logic:** materials, lighting, geometry, and motion should follow the same rules across the page.
- **Deliberate reveals:** reveal information in reading order while keeping essential content immediately available.
- **Contrast in intensity:** alternate expressive scenes with calm proof, services, and contact sections.

Develop an original subject and visual system tied to the member's brand. Avoid reproducing another site's combined subject, composition, typography, palette, and section sequence. A supplied reference establishes taste and motion expectations; it is not a replacement for art direction. Do not claim to have recovered its creator's private method.

Before implementing a cinematic brief, observe the reference in motion when available. Record its dominant movement, visible travel or transformation, timing, scroll progression, and relationship to foreground content. Compare the proposed concept against those large visible changes, not just its palette or a single frame. If only a still is available, distinguish observed appearance from inferred animation in the design brief.

## Start with assets and evidence

1. Inventory usable assets: logo, brand colors, product images, founder portraits, project screenshots, location photos, testimonials, and existing copy. Record their source, permitted use, and quality limitations.
2. Separate verified facts, member preferences, and proposed creative ideas. Unknown prices, achievements, review counts, customer logos, credentials, and outcomes remain unknown. Draft neutral copy or request the missing fact; never invent proof.
3. Name the visual subject in one sentence: “A ceramic vessel whose material changes as visitors explore finishes,” for example. Avoid abstract floating objects that have no connection to the offer.
4. Define the asset contract before implementation: required files, crop, aspect ratio, transparent edges where needed, resolution, color treatment, and fallback. Label generated imagery as illustrative internally; do not present it as the member's real premises, products, or completed work.
5. Establish a static hero with actual headline, actual asset or clearly marked preview asset, and primary CTA. Test its composition at desktop and narrow mobile widths before adding animation.

If an important asset is unavailable, choose a concept that works with available typography, photographs, or geometry.

## Choose a direction; offer alternatives when useful

When options would resolve a meaningful preference, present two or three short concept cards, each containing the audience insight, hero subject, palette, typography, materials, motion, mobile treatment, and CTA. Recommend one using the evidence. If the member prefers autonomous creation, choose the best-supported direction and document the assumption instead of stalling.

### A. The Crafted Object

Best for a product, premium service, or brand whose materials communicate value. Place one original object or genuine product image in a warm, directional pool of light. Use an ivory, clay, ink, or brand-derived palette; editorial type; and generous margins. A slow partial turn or changing light exposes meaningful details. Product benefits appear beside relevant features. Mobile uses a stable product view with optional, lightweight interaction.

### B. The Living Place

Best for a local business, hospitality, studio, or service where people and setting establish trust. Begin with authentic location or team imagery, a clear service promise, and a booking or contact action. Add depth through layered architecture, a simple spatial frame, or subtle parallax. Use colors taken from the real environment. Follow with practical services, real proof, service area, and contact information. Mobile prioritizes the image, offer, location, and action with limited movement.

### C. The Signature Gallery

Best for a founder, creator, consultant, or portfolio. Give one signature project or personal idea a dimensional stage: a rotating editorial sculpture, spatial project index, or restrained stack of work samples. Derive color and typography from the individual's work and voice. Let selecting a project change the scene; always provide ordinary links and readable project summaries. Mobile becomes a strong editorial sequence rather than a tiny desktop gallery.

Adapt these starting points to the brand. A bakery should not inherit a futuristic dashboard. A therapist should not inherit aggressive launch motion. A luxury brand needs real materials and story, not unsupported exclusivity claims.

Gentle motion remains appropriate for a calm editorial brief. Apply cinematic motion acceptance when cinematic impact is requested; do not intensify a deliberately quiet design merely to meet that different brief.

The five library layers and the cinematic workbench are implementation starting points, not additional mandatory styles. Preserve an existing approved brand direction during small revisions. For a new member, choose colors, type, imagery, scene geometry, and section rhythm from their identity rather than carrying over a prior member's site.

## Write the scene specification before coding

Record these decisions:

| Field | Required decision |
| --- | --- |
| Purpose | What visitors should understand or feel, and why it supports the offer |
| Subject | Original object, genuine image, or geometry; its meaning and source |
| Composition | Focal point, text-safe area, foreground/background layers, CTA position |
| Materials | Surface, roughness, transparency, lighting direction, restrained accent |
| Camera | Initial framing, maximum movement, and what remains visible |
| Motion scale | The visible change visitors should notice, its timing, and how it compares with the requested reference |
| Interaction | Trigger, response, limits, keyboard/touch equivalent |
| Responsive behavior | What resizes, recomposes, simplifies, or becomes static |
| Failure state | Useful content and image shown without WebGL or successful asset loading |

Choose the simplest implementation that achieves the scene. Use CSS transforms for layered cards and modest perspective. Use Three.js when real geometry, camera movement, or lighting materially improves the result. A 3D renderer is a means, not a quality signal.

## Storyboard motion as information

Describe each beat with trigger, duration, object, purpose, and fallback. Example for a ceramic studio:

| Beat | Behavior | Purpose and fallback |
| --- | --- | --- |
| Initial view | Headline, vessel image, and shop CTA are visible immediately | Offer remains usable during loading |
| Scene ready | Vessel resolves into its lit scene over roughly 600 ms | Introduces material; static image remains if rendering fails |
| Finish selection | Surface color changes over roughly 250 ms | Explains a real option; labeled buttons also communicate selection |
| Scroll to craft | A small camera adjustment reveals the vessel's profile | Supports the making story; mobile may keep the original framing |
| Reduced motion | No camera drift, parallax, or animated blur | Same content, controls, and selection state |

Treat durations as starting values to tune. Avoid repeated blur on readable text, uncontrolled idle motion, scroll hijacking, and scenes that conceal the CTA. Never make animation completion a prerequisite for access.

For a cinematic brief, make the defining motion observable within two seconds of the scene becoming ready, without requiring hover. Choose a clear change in light, position, geometry, camera, or composition that supports the concept. Small idle drift and isolated entrances can support that motion, but cannot replace the requested visual spectacle. Keep major animated subjects visible around foreground text and panels; an elaborate animation hidden behind an opaque overlay does not count. Recompose the motion for phones so the main visual payoff survives at a useful size.

## Review with visible evidence

Capture desktop and mobile screenshots for composition when browser tools permit. For cinematic motion, also watch live playback or a recording using the acceptance sequence in [build-and-review.md](build-and-review.md); stills alone are insufficient. Mark every check **pass**, **needs work**, **untested**, or **not applicable**, and cite the frame or observed behavior that supports the judgment:

- Brand name, offer, and primary action are readable in the initial viewport.
- One clear visual subject dominates; it does not cover the headline or controls.
- Palette, type hierarchy, spacing, and material treatment remain consistent across sections.
- Real content appears throughout; no invented proof or unlabeled placeholder survives handoff.
- The concept differs visibly from the reference in subject, composition, palette, and section design.
- Narrow layouts preserve reading order, usable controls, and complete content without horizontal overflow.
- Motion has an identifiable purpose; touch, keyboard, reduced-motion, and static states remain usable.
- Loading, failed assets, and unavailable WebGL produce an intentional fallback.

Fix failed checks and recapture affected views. A scorecard records evidence and defects; it cannot guarantee visual appeal or conversion performance.
