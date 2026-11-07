# Project status — BOUKE

- Brand slug: `bouke`
- Status: **First site draft ready for member review**
- Publishable path: `member-projects/bouke/dist/`
- Records: BRAND-BRIEF, DESIGN-BRIEF, ASSET-MANIFEST, QA (this folder)
- Preview: serve `dist/` with a static server (see below)
- Blockers: Contact email Unknown; no logo; no member content posts yet; form backend unfinished by design
- Next: Member review; optional connect email/form backend; add real content cards; CreateAgent for Website Designer Employee (parent)
- CoS: Parent will FYI Chief of Staff

## Preview how-to

From the kit root or this folder:

```bash
cd member-projects/bouke/dist
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

Or: `npx --yes serve -l 8765 .` inside `dist/`.
