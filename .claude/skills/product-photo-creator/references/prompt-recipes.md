# Building the image request

Fill this spec from the inspected product and confirmed brief. Omit irrelevant fields. Pass the source image through the tool's supported reference mechanism; placing a filename in prompt text alone does not supply the image.

```text
TASK: Edit/restage the supplied product photo into one photorealistic studio still.
INPUT ROLES: [file/image 1] is the product edit target and identity authority.
             [file/image 2, if supplied] is [style reference / label artwork / alternate view].
PRODUCT: [observed category, form, material, visible identity details].
PRESERVE: [specific silhouette, dimensions relative to itself, components, colors,
          brand marks, label layout, readable wording, material and texture].
CHANGE: [background, supporting surface, lighting, crop; other authorized edits].
SET: [one concrete studio background and surface].
LIGHT: [key direction/softness, fill, material-specific highlight behavior, contact shadow].
VIEW: [supported source viewpoint], [full item or requested detail], [negative space].
FORMAT: [requested aspect ratio and only supported output controls].
TEXT: Preserve visible original lettering in place. [Include exact verified wording
      only when useful; never guess unreadable text. No added slogans or badges.]
AVOID: [few relevant failure modes: altered cap, invented seam, duplicate product,
        illegible label, unsupported ingredients, cut-off handles].
```

Make preservation requirements specific to this item. Repeating “exact” many times does not guarantee accuracy. Set the requested ratio in tool controls if supported; otherwise request it in the prompt and verify the returned result.

## Recipe additions

**Clean packaged product**

> Restage the original item on a neutral seamless studio surface. Preserve its silhouette, closure, label boundaries, and visible printing. Keep the hero face readable, with a broad soft highlight shaped to the container and a restrained contact shadow. Show the entire item with comfortable edge clearance. Add no props or promotional copy.

**Apparel**

> Keep the garment's current presentation and camera angle. Replace the surroundings with a quiet studio set. Preserve the cut, proportions, seams, weave, color, and graphic placement. Let directional light reveal fabric texture. Keep all edges visible and avoid changing the neckline, sleeves, or drape into a different design.

**Food**

> Restage the photographed food on a simple studio tabletop. Keep the actual portion, components, and arrangement. Use soft light from the side with gentle shadow detail so its existing texture reads clearly. Keep the food's natural color and moisture believable. Add no new ingredients, steam, garnish, or extra servings.

**Glass or reflective beauty product**

> Preserve the container's geometry, finish, tint, label, and closure. Use controlled reflections and edge contrast to describe the material. Keep the label face clear of overpowering glare. Make refraction and the grounding shadow consistent with the studio surface. Do not invent liquid, engraving, or a different cap.

**Dark premium**

> Place the supplied product against a restrained charcoal studio setting. Keep its real color and label readable. Shape the edges with controlled highlights and retain detail in dark surfaces. Use a coherent contact shadow and prevent black components from disappearing into the backdrop.

These are starting points, not separate images to generate by default.

## A focused correction

Use the original product photo as the identity authority and the selected generated frame as the composition reference when the tool supports both:

> Correct only [observed defect]. Restore [specific feature] to match the original product photo. Keep the selected studio composition, framing, backdrop, and unaffected product features. Do not use invented details from the generated image as product truth.

When inputs cannot all be included, retain the original product reference and describe the desired scene. Do not imply the tool received an unavailable image. If a tool lacks reference editing altogether, hand off the prompt and original photo to a capable session rather than render an invented substitute.
