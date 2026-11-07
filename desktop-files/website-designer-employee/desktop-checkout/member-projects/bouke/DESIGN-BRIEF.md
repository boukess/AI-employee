# Design brief — BOUKE

- Purpose and primary action: Introduce BOUKE, invite people to enjoy content, capture open help notes and business details without fake submissions.
- Chosen starting point: **Original** static HTML/CSS/JS single page (not cinematic-workbench branding; not a library layer clone).
- Visual concept and connection to this brand: Warm paper background, teal accent, soft orange eyebrow — approachable hub. Hero panel uses four floating chips for the offer lanes instead of 3D.
- Typography, palette, material, and lighting: Instrument Serif + DM Sans; ivory/paper `#f6f1e8`, ink `#1c1916`, teal `#0f6b5c`, warm `#c45c26`; flat cards with soft shadow; no fake photography.
- Scene subject and asset source: Geometric/typography only. No stock faces. No logo file supplied.
- Composition, text-safe area, and CTA placement: Left hero copy + right gradient panel; sticky header with Ask for help; forms in narrow column.
- Website sections and real content needed: Hero; Content; Shop (Shopify clothing, coming soon until products are published); Packages (Stripe hosted checkout); Ways we help (Freelance · Content · Business/AI employees); Need help form; Business questionnaire; Footer with BOUKE LLC + fleet link.
- Reference observations and deliberate original differences: Kit Lab demo is dark cinematic 3D — deliberately not reused. Structure inspired only at “hub with clear CTAs” level.
- Approved choices to preserve: Honest form limitation copy; empty content placeholders; live fleet + GitHub links only.

## Motion and responsive plan

| Beat or interaction | Trigger and visible change | Timing/scale | Phone and reduced-motion treatment |
| --- | --- | --- | --- |
| Chip float | Continuous soft translateY on hero chips | ~7s loop, 6px | Disabled under `prefers-reduced-motion` |
| Sticky header | Scroll | Immediate | Under 860px a Menu button opens the links, including Shop. Without JavaScript the links stay in the header. |
| Form export | Submit / Copy | Instant download or clipboard | Same |

- Initial view and fallback: Fully readable without JS except form download/copy helpers.
- Phone composition and short-viewport treatment: Single column grids; hero panel stacks under copy.
- For cinematic work, movement visible within two seconds: N/A (not cinematic).
- Open asset or integration needs: Contact email; real content posts; optional form backend later.
