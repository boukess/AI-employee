# CULL-REPORT — BOUKE photo purge (cull, not delete)

Date: 2026-11-05 07:00 America/New_York

**Purge = cull.** Originals in `sources/originals/` were never modified or deleted.

## Summary
- Total files: **119**
- Decoded OK: **117**
- Decode failures: **2**
- Keepers: **16**
- Rejected (not selected for edit): **103**

## Method
- Converted to JPG previews; scored Laplacian variance (sharpness), exposure, resolution
- Perceptual-hash + sequential burst grouping for near-duplicates
- Visual review of contact sheets / full previews for composition & subject
- Selected diverse best scenes; one winner per burst

## KEEPERS

| # | File | Score | Sharp | Size | Note |
|---|------|------:|------:|------|------|
| 1 | `IMG_5766.JPG` | 0.982 | 3491 | 3024x4032 | Coastal golden-hour portrait — sharp, strong hero energy |
| 2 | `IMG_5740.JPG` | 0.970 | 4664 | 3024x4032 | Coastal profile overlooking ocean — clean silhouette lines |
| 3 | `IMG_5420.HEIC` | 0.980 | 1629 | 4284x5712 | Alleyway white-jacket full body — best of alley pair |
| 4 | `IMG_7220.heic` | 0.991 | 2328 | 4032x2268 | I heart LBC mural beach wide — best of mural burst |
| 5 | `IMG_0022.JPG` | 0.959 | 7438 | 1570x3141 | Forest path arms outstretched — joyful, sharp foliage |
| 6 | `IMG_1545.HEIC` | 0.950 | 5605 | 3024x4032 | Snow / plaid outdoor portrait — best of snow pair |
| 7 | `IMG_8145.HEIC` | 0.965 | 8224 | 3024x4032 | Rock formation arms out — dramatic scale, very sharp |
| 8 | `IMG_3859.JPEG` | 0.919 | 3564 | 4000x6000 | Formal suit at Morehouse — crisp, usable portrait |
| 9 | `Facetune_03-09-2024-11-31-26.HEIC` | 0.910 | 3671 | 1344x2016 | Two-in-suits diploma moment — clean outdoor formal |
| 10 | `IMG_0536.JPEG` | 0.934 | 1511 | 2316x3088 | Poolside duo — best of pool pair, balanced daylight |
| 11 | `IMG_3960.JPG` | 0.903 | 11781 | 3024x4032 | Spelman homecoming night — best of event burst |
| 12 | `IMG_2217.JPG` | 0.921 | 774 | 3024x4032 | Bathroom mirror suit+sunglasses — best of selfie burst |
| 13 | `IMG_2294.JPG` | 0.938 | 1737 | 3024x4032 | Backlit rock sit — dramatic, good for stagelight |
| 14 | `IMG_5684.JPG` | 0.940 | 2681 | 3024x4032 | Field sunset candid (photographer + subject) |
| 15 | `IMG_3760.JPG` | 0.846 | 570 | 2304x1536 | Beach sunset couple — warm horizontal frame |
| 16 | `IDG_20261011_162002_016.JPEG` | 0.839 | 776 | 4024x3016 | Group under tent — sharp social portrait |

## REJECTED / NOT SELECTED

| File | Decision | Reason |
|------|----------|--------|
| `145F1588-1C2F-4F2F-B42B-28E1A17B1BB2.JPG` | REJECT | Low resolution (648x486) |
| `5E1EEDD0-129A-4A65-85E7-DBA848D8752A.JPG` | REJECT | Soft focus (sharpness=72) — below keep threshold |
| `A12F3998-E5E9-4819-91DD-709E27C99266.JPG` | REJECT | Below quality bar (score=0.53) — exposure/sharpness |
| `A338D5AA-3637-4FCF-A584-82AD1AC52D00.JPG` | NOT SELECTED | Low resolution (648x486) |
| `C2FB5CEF-76ED-490F-AB37-A8D1BC44B76F.JPG` | REJECT | Low resolution (586x780) |
| `Facetune_03-09-2024-11-45-08.HEIC` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IDG_20261011_162136_435.JPG` | REJECT | Near-dup hug shot of better group tent frame |
| `IDG_20261011_162137_035.JPG` | REJECT | Hug pair; prefer sharper group tent frame |
| `IDG_20261026_211705_822.JPG` | REJECT | Below quality bar (score=0.67) — exposure/sharpness |
| `IDG_20261026_214429_427.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `Image 9-2-24 at 4.34?ǻPM.HEIC` | REJECT | Below quality bar (score=0.53) — exposure/sharpness |
| `IMG_0016.JPG` | REJECT | Soft / low sharpness for formal use |
| `IMG_0017.jpg` | REJECT | Soft / low sharpness |
| `IMG_0019.JPG` | REJECT | Soft / low sharpness |
| `IMG_0023.jpg` | REJECT | Same forest walk; subject smaller/farther than IMG_0022 |
| `IMG_0202.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_0203.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_0299.JPG` | REJECT | Tiny 600x600 icon-scale — too small |
| `IMG_0543.JPEG` | REJECT | Pool action frame; prefer posed duo IMG_0536 |
| `IMG_0883.HEIC` | REJECT | Below quality bar (score=0.61) — exposure/sharpness |
| `IMG_0884.HEIC` | REJECT | Below quality bar (score=0.61) — exposure/sharpness |
| `IMG_0889.HEIC` | REJECT | Below quality bar (score=0.64) — exposure/sharpness |
| `IMG_1546.HEIC` | REJECT | Near-dup of snow keeper IMG_1545 |
| `IMG_2176.HEIC` | REJECT | Below quality bar (score=0.70) — exposure/sharpness |
| `IMG_2216.JPG` | REJECT | Mirror-selfie burst — prefer IMG_2217 |
| `IMG_2218.JPG` | REJECT | Mirror-selfie burst — prefer IMG_2217 |
| `IMG_2219.JPG` | REJECT | Mirror-selfie burst — prefer IMG_2217 |
| `IMG_2220.JPG` | REJECT | Mirror-selfie burst — prefer IMG_2217 |
| `IMG_2290.HEIC` | REJECT | Rock silhouette variant; prefer IMG_2294 |
| `IMG_2830.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_2832.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_2833.JPG` | REJECT | Near-dup of IMG_2832 indoor duo |
| `IMG_2868.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3031.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3033.JPG` | REJECT | Soft focus (sharpness=73) — below keep threshold |
| `IMG_3344.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3508.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3545.JPG` | REJECT | Soft focus (sharpness=42) — below keep threshold |
| `IMG_3623.JPG` | REJECT | Below quality bar (score=0.61) — exposure/sharpness |
| `IMG_3666.JPG` | REJECT | Corrupt / truncated file — would not decode |
| `IMG_3725.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3734.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_3962.JPG` | REJECT | Event burst — prefer IMG_3960 |
| `IMG_3965.JPG` | REJECT | Event burst — prefer IMG_3960 |
| `IMG_3970.JPG` | REJECT | Event burst — prefer IMG_3960 |
| `IMG_3971.JPG` | REJECT | Event burst — prefer IMG_3960 |
| `IMG_4374.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_4379.JPG` | REJECT | Social-media collage / multi-panel, not a single photo |
| `IMG_4380.JPG` | REJECT | Social-media collage / story capture |
| `IMG_4964.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_5424.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_5434.HEIC` | REJECT | Near-dup of alley keeper IMG_5420 (arms-out variant weaker) |
| `IMG_5657.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_5658.JPG` | REJECT | Below quality bar (score=0.66) — exposure/sharpness |
| `IMG_5727.JPG` | REJECT | Coastal silhouette; prefer IMG_5740 / IMG_5766 |
| `IMG_5743.JPG` | REJECT | Same coastal look as IMG_5766; lower res crop |
| `IMG_6157.jpg` | REJECT | Below quality bar (score=0.51) — exposure/sharpness |
| `IMG_6158.jpg` | REJECT | Below quality bar (score=0.59) — exposure/sharpness |
| `IMG_6252.heic` | REJECT | Screenshot of Canvas QR login — not a photo to edit |
| `IMG_6444.heic` | REJECT | Night-suit burst — soft exposure |
| `IMG_6454.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6456.heic` | REJECT | Night-suit burst — soft exposure |
| `IMG_6475.heic` | REJECT | Soft focus (sharpness=77) — below keep threshold |
| `IMG_6490.heic` | REJECT | Below quality bar (score=0.70) — exposure/sharpness |
| `IMG_6494.heic` | REJECT | Below quality bar (score=0.66) — exposure/sharpness |
| `IMG_6506.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6509.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6516.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6524.heic` | REJECT | Below quality bar (score=0.70) — exposure/sharpness |
| `IMG_6526.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6528.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6730.JPG` | REJECT | Tiny / graphic crop, not a full photo |
| `IMG_6764.WEBP` | REJECT | Below quality bar (score=0.68) — exposure/sharpness |
| `IMG_6770.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6852.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_6903.JPG` | REJECT | Below quality bar (score=0.70) — exposure/sharpness |
| `IMG_6926.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7155.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7193.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7198.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7201.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7204.heic` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7225.heic` | REJECT | Near-dup of mural keeper IMG_7220 |
| `IMG_7227.heic` | REJECT | Near-dup of mural keeper IMG_7220 |
| `IMG_7279.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7345.DNG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7494.JPG` | REJECT | Extremely soft (Laplacian 18) — unusable |
| `IMG_7508.DNG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7532.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7589.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7632.jpg` | REJECT | Below quality bar (score=0.70) — exposure/sharpness |
| `IMG_7703.jpg` | REJECT | Forest path distant — weaker than IMG_0022 |
| `IMG_7704.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7705.jpg` | REJECT | Forest path near-dup of IMG_7704 |
| `IMG_7759.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7764.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7881.JPG` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7901.jpg` | REJECT | Soft focus (sharpness=52) — below keep threshold |
| `IMG_7907.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7908.jpg` | NOT SELECTED | Passed metrics but not among best ~16 keepers (weaker composition/subject vs selected set) |
| `IMG_7909.jpg` | REJECT | Soft focus (sharpness=51) — below keep threshold |
| `IMG_7927.JPG` | REJECT | Below quality bar (score=0.66) — exposure/sharpness |
| `IMG_7943.CR2` | REJECT | Corrupt CR2 (LibRaw I/O error) — would not decode |
