# Desktop employee files

Snapshot copied from IBP_Desktop on November 7, 2026 (ET). Original PC folders were not changed.

Large videos remain on the PC. Files at or above 50,000,000 bytes, video inbox/work/exports, installed packages/models/caches/build outputs, credential filenames and potential-secret files were excluded. Smaller reference videos are included. Archives/installers were excluded conservatively because their contents cannot be audited by a plain-text secret scan. Potential-secret matches may include examples or scraped public HTML; excluded without exposing values.

`desktop-checkout/` preserves employee files from the C:\BUILD checkout; `legacy-checkout/` preserves the older C:\Users\blood checkout without overwriting either version. Root-level pack files come from standalone employee folders. Junction aliases under Desktop Employees were copied only through their original targets.

## Employee index

| Folder | Files | Bytes | Source paths |
|---|---:|---:|---|
| [ad-copywriter-employee](ad-copywriter-employee/) | 57 | 2,610,718 | `C:\BUILD\BUILD\AI-employee\employees\ad-copywriter-employee` |
| [ad-manager-employee](ad-manager-employee/) | 86 | 2,419,842 | `C:\BUILD\BUILD\AI-employee\employees\ad-manager-employee`<br>`C:\Users\blood\AI-employee\employees\ad-manager-employee` |
| [ai-advisory-council](ai-advisory-council/) | 126 | 1,643,374 | `C:\Users\blood\AI Advisory Council`<br>`C:\BUILD\BUILD\AI-employee\employees\ai-advisory-council` |
| [chief-of-staff](chief-of-staff/) | 121 | 2,231,079 | `C:\BUILD\BUILD\AI-employee\employees\chief-of-staff`<br>`C:\Users\blood\AI-employee\employees\chief-of-staff` |
| [customer-satisfaction-employee](customer-satisfaction-employee/) | 84 | 2,379,674 | `C:\BUILD\BUILD\AI-employee\employees\customer-satisfaction-employee`<br>`C:\Users\blood\AI-employee\employees\customer-satisfaction-employee` |
| [ghostwriter-employee](ghostwriter-employee/) | 45 | 160,601 | `C:\BUILD\BUILD\AI-employee\employees\ghostwriter-employee` |
| [gtm-engineer](gtm-engineer/) | 84 | 2,352,028 | `C:\BUILD\BUILD\AI-employee\employees\gtm-engineer`<br>`C:\Users\blood\AI-employee\employees\gtm-engineer` |
| [lead-gen-employee](lead-gen-employee/) | 85 | 804,644 | `C:\BUILD\BUILD\AI-employee\employees\lead-gen-employee` |
| [product-photography-employee](product-photography-employee/) | 326 | 672,266,203 | `C:\Users\blood\AI Product Photography Employee`<br>`C:\BUILD\BUILD\AI-employee\employees\product-photography-employee` |
| [sales-employee](sales-employee/) | 82 | 2,249,878 | `C:\BUILD\BUILD\AI-employee\employees\sales-employee`<br>`C:\Users\blood\AI-employee\employees\sales-employee` |
| [seo-employee](seo-employee/) | 106 | 2,317,896 | `C:\BUILD\BUILD\AI-employee\employees\seo-employee`<br>`C:\Users\blood\AI-employee\employees\seo-employee` |
| [social-media-employee](social-media-employee/) | 82 | 2,205,916 | `C:\BUILD\BUILD\AI-employee\employees\social-media-employee`<br>`C:\Users\blood\AI-employee\employees\social-media-employee` |
| [thumbnail-employee](thumbnail-employee/) | 781 | 90,574,440 | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee` |
| [video-editor-employee](video-editor-employee/) | 451 | 53,892,759 | `C:\Users\blood\AI Video Editor`<br>`C:\BUILD\BUILD\AI-employee\employees\video-editor-employee` |
| [web-dev-employee](web-dev-employee/) | 116 | 2,206,995 | `C:\BUILD\BUILD\AI-employee\employees\web-dev-employee`<br>`C:\Users\blood\AI-employee\employees\web-dev-employee` |
| [website-designer-employee](website-designer-employee/) | 126 | 850,274 | `C:\Users\blood\Website Designer AI Employee`<br>`C:\BUILD\BUILD\AI-employee\employees\website-designer-employee` |

Total archived payload: 2,758 files, 841,166,321 bytes (excluding this index).

## Excluded items

Counts and sizes are measured from files on the PC; directory rows summarize all files in that excluded tree. These are snapshot-copy exclusions only, not deletion requests.

| Employee | Original source path | Reason | Files | Bytes |
|---|---|---|---:|---:|
| ad-manager-employee | `C:\BUILD\BUILD\AI-employee\employees\ad-manager-employee\examples\build` | raw-work-render-or-reinstallable | 1 | 2,362 |
| ad-manager-employee | `C:\Users\blood\AI-employee\employees\ad-manager-employee\examples\build` | raw-work-render-or-reinstallable | 1 | 2,362 |
| lead-gen-employee | `C:\BUILD\BUILD\AI-employee\employees\lead-gen-employee\scripts\leadgen\config.py` | potential-secret-content | 1 | 6,533 |
| lead-gen-employee | `C:\BUILD\BUILD\AI-employee\employees\lead-gen-employee\.env.example` | credential-filename | 1 | 1,128 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\outputs\BOUKE-best-30-part1.zip` | 50MB-or-larger | 1 | 55,504,295 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\outputs\BOUKE-best-30-part2-alternates.zip` | 50MB-or-larger | 1 | 83,478,517 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\outputs\BOUKE-edits-part1-clean.zip` | opaque-archive-or-reinstallable-binary | 1 | 43,080,850 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\outputs\BOUKE-edits-part2-lut-creative.zip` | 50MB-or-larger | 1 | 59,550,692 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\transfer_20261106\__pycache__` | raw-work-render-or-reinstallable | 1 | 20,367 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\IMG_7179.MOV` | 50MB-or-larger | 1 | 1,118,587,017 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\IMG_7192.mov` | 50MB-or-larger | 1 | 92,629,508 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\IMG_7196.MOV` | 50MB-or-larger | 1 | 180,516,070 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\IMG_7345.DNG` | 50MB-or-larger | 1 | 62,777,139 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\Photos_Minimal_Edits_12.zip` | opaque-archive-or-reinstallable-binary | 1 | 44,591,994 |
| product-photography-employee | `C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit\Volleyball_Clean_and_Motion_Edits.zip` | opaque-archive-or-reinstallable-binary | 1 | 5,763,842 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_6bb11286.html` | potential-secret-content | 1 | 1,288,913 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_6c411e9f.html` | potential-secret-content | 1 | 1,248,096 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_6d2a12b9.html` | potential-secret-content | 1 | 1,202,682 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_7876a6f6.html` | potential-secret-content | 1 | 1,313,866 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_d10cea93.html` | potential-secret-content | 1 | 1,524,385 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_d89554a2.html` | potential-secret-content | 1 | 1,206,941 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search2_efc8c82f.html` | potential-secret-content | 1 | 1,368,614 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_379a495d.html` | potential-secret-content | 1 | 1,294,311 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_4a5ef929.html` | potential-secret-content | 1 | 1,269,043 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_62afee55.html` | potential-secret-content | 1 | 1,324,283 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_6775d0f5.html` | potential-secret-content | 1 | 1,486,056 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_70de7736.html` | potential-secret-content | 1 | 1,593,632 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_75fd08d6.html` | potential-secret-content | 1 | 1,364,207 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_863b2352.html` | potential-secret-content | 1 | 1,626,630 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_8f7de921.html` | potential-secret-content | 1 | 1,897,099 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_9648e87c.html` | potential-secret-content | 1 | 1,167,596 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_9b43d9f0.html` | potential-secret-content | 1 | 1,737,608 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_9ebc9c09.html` | potential-secret-content | 1 | 1,598,754 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_a28d0780.html` | potential-secret-content | 1 | 1,470,450 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_b6426fdc.html` | potential-secret-content | 1 | 1,523,292 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_b8fc18b9.html` | potential-secret-content | 1 | 1,303,753 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_c6847d3a.html` | potential-secret-content | 1 | 1,215,381 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\search_d16583f3.html` | potential-secret-content | 1 | 1,596,079 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\sf_5d43d99e.html` | potential-secret-content | 1 | 1,278,833 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\sf_7e7b2341.html` | potential-secret-content | 1 | 1,429,758 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\sf_95156112.html` | potential-secret-content | 1 | 1,463,200 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\sf_c2c0bd8d.html` | potential-secret-content | 1 | 1,450,407 |
| thumbnail-employee | `C:\BUILD\BUILD\AI-employee\employees\thumbnail-employee\workspace\corpus\_batch11\sf_db35e584.html` | potential-secret-content | 1 | 1,219,756 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\.venv` | raw-work-render-or-reinstallable | 8,095 | 602,771,600 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\exports` | raw-work-render-or-reinstallable | 21 | 4,952,985,836 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\inbox` | raw-work-render-or-reinstallable | 10 | 12,184,008,771 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\models` | raw-work-render-or-reinstallable | 9 | 501,189,528 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\node_modules` | raw-work-render-or-reinstallable | 14,882 | 689,610,870 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\out` | raw-work-render-or-reinstallable | 0 | 0 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\references\FRBouK_Editing_Assets.zip` | opaque-archive-or-reinstallable-binary | 1 | 3,871,756 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\references\FRBouK_Video_References.zip` | opaque-archive-or-reinstallable-binary | 1 | 8,765 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\scripts\__pycache__` | raw-work-render-or-reinstallable | 5 | 74,674 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\tests\__pycache__` | raw-work-render-or-reinstallable | 3 | 14,310 |
| video-editor-employee | `C:\Users\blood\AI Video Editor\work` | raw-work-render-or-reinstallable | 213 | 10,909,875,275 |
| website-designer-employee | `C:\Users\blood\Website Designer AI Employee\member-projects\bouke\dist` | raw-work-render-or-reinstallable | 3 | 19,140 |
| website-designer-employee | `C:\Users\blood\Website Designer AI Employee\starters\cinematic-workbench\dist` | raw-work-render-or-reinstallable | 8 | 685,254 |
| website-designer-employee | `C:\BUILD\BUILD\AI-employee\employees\website-designer-employee\member-projects\bouke\dist` | raw-work-render-or-reinstallable | 21 | 127,779 |
| website-designer-employee | `C:\BUILD\BUILD\AI-employee\employees\website-designer-employee\member-projects\bouke\store\store.test.mjs` | potential-secret-content | 1 | 19,432 |
| website-designer-employee | `C:\BUILD\BUILD\AI-employee\employees\website-designer-employee\member-projects\bouke\.env.example` | credential-filename | 1 | 838 |
| website-designer-employee | `C:\BUILD\BUILD\AI-employee\employees\website-designer-employee\starters\cinematic-workbench\dist` | raw-work-render-or-reinstallable | 8 | 685,254 |

## Discovery coverage

Bounded searches covered C:\BUILD (six directory levels), both local employee checkouts, Documents (three levels), Downloads (two levels), and OneDrive Desktop (three levels). No whole-disk scan. No separate Faceless Content pack was found in those locations. Third-party integration AGENTS.md files were not treated as separate employees; integrations already live in the main repository.

Beyond Video Editor, Advisory Council and Website Designer, found Product Photography plus Ad Copywriter, Ad Manager, Chief of Staff, Customer Satisfaction, Ghostwriter, GTM Engineer, Lead Gen, Sales, SEO, Social Media, Thumbnail and Web Dev employee folders.

This is an archival snapshot, not a change to active employee instructions or a software installation.
