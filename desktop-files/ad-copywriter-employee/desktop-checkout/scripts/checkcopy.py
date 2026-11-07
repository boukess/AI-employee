#!/usr/bin/env python3
"""Check a copy file before it goes to the member.

Reads a copy file written in the standard format (see docs/5-write.md):

    ## Variation 1: <angle>
    **Primary text**
    ```text
    ...
    ```
    **Headline**
    ```text
    ...
    ```
    **Description**
    ```text
    ...
    ```

Errors must be fixed. Warnings should be fixed unless there is a stated reason.

Usage
  python3 scripts/checkcopy.py workspace/copy/FILE.md [--corpus PATH] [--allow-dashes]
"""

import argparse
import json
import os
import re
import sys

HEADLINE_IDEAL, HEADLINE_MAX = 27, 40
DESC_IDEAL, DESC_MAX = 27, 30
HOOK_CUT = 125
SHINGLE = 8

AI_TELLS = [
    "leverage", "unlock", "unleash", "seamless", "seamlessly", "game-changer", "game changer",
    "revolutionize", "revolutionary", "elevate", "empower", "delve", "supercharge", "cutting-edge",
    "fast-paced", "harness", "embark", "journey", "tapestry", "realm", "look no further",
    "whether you're", "say goodbye to", "imagine a world", "next level", "skyrocket", "dive into",
    "navigate the", "robust", "streamline", "effortless", "effortlessly", "ever-evolving",
    "unparalleled", "furthermore", "moreover", "in today's", "it's not just", "transformative",
]

POLICY = [
    (r"\bare you (?:still )?(?:(?:struggling|suffering|dealing) with (?:debt|money|bills|your weight|weight|obesity|depression|anxiety|"
     r"addiction|infertility|acne|hair loss|diabetes|loneliness|bad credit)|overweight|fat|depressed|anxious|broke|in debt|single|divorced|"
     r"diabetic|bankrupt|unemployed|lonely|sick|addicted|infertile|a (?:christian|muslim|jew|single (?:mom|mother|dad|parent)|senior|veteran))\b",
     "Personal attributes: Meta rejects copy that asserts or implies the reader's health, finances, religion, "
     "relationship status and similar. Talk about the situation, not about 'you are X'."),
    (r"\bare you (?:over|under) \d+\b", "Personal attributes (age). Rephrase without asking the reader's age."),
    (r"\b(?:other|fellow) (?:single (?:moms?|mothers?|dads?|parents?)|christians?|seniors?|veterans?|divorcees?|diabetics?)\b",
     "Personal attributes: implies the reader belongs to a group."),
    (r"\byour (?:debt|diabetes|depression|anxiety|weight problem|bankruptcy|bad credit|disability|illness|acne|hair loss|divorce)\b",
     "Personal attributes: assumes the reader has a condition or money problem."),
    (r"\byou(?:'re| are) (?:fat|broke|overweight|depressed|anxious|in debt|lonely|single|sick|bankrupt)\b",
     "Personal attributes: tells the reader what they are."),
    (r"\b(?:make|making|earn|earning|made|profit|profiting|income of)\s+(?:over\s+|up to\s+)?\$\s?\d",
     "Income claim: Meta restricts earnings claims. Only use real, typical numbers you can prove, or cut it."),
    (r"\bpassive income\b|\bget rich\b|\bquit your job\b|\bfinancial freedom\b",
     "Income or get-rich framing: high rejection risk."),
    (r"\bguarantee(?:d|s)?\b", "Guarantee language: only if there is a real, written guarantee in the brand file."),
    (r"\b(?:miracle|cure|cures|overnight results|lose \d+ ?(?:lbs|pounds|kg))\b", "Health or miracle claim: high rejection risk."),
    (r"\bclick here\b", "'Click here' is weak and flagged as engagement bait. Name the action instead."),
    (r"\b(?:facebook|instagram|meta)\b", "Mentions a Meta brand. Meta has rules about using its names in ads. Cut unless needed."),
    (r"(?:like|share|tag|comment)\s+(?:this|if|a friend|below)", "Engagement bait: asking for likes, shares, tags or comments lowers delivery."),
]


def ensure_utf8_output():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


def words(text):
    return re.findall(r"[a-z0-9$%']+", (text or "").lower())


def shingles(text, n=SHINGLE):
    w = words(text)
    return {" ".join(w[i:i + n]) for i in range(len(w) - n + 1)}


def parse_copy(md):
    sections = re.split(r"(?m)^##\s+(?=Variation\b)", md)
    variations = []
    for sec in sections[1:]:
        title = sec.split("\n", 1)[0].strip()
        fields = {}
        for label in ("Primary text", "Headline", "Description"):
            m = re.search(r"\*\*%s\*\*[^\n]*\n+```[a-zA-Z]*\n(.*?)\n```" % re.escape(label), sec, re.S)
            fields[label] = m.group(1).strip() if m else None
        b = re.search(r"\*\*Button:?\*\*:?\s*(.+)", sec)
        fields["Button"] = b.group(1).strip() if b else None
        variations.append((title, fields))
    return variations


def find_corpus(copy_path, explicit):
    if explicit:
        return explicit if os.path.exists(explicit) else None
    d = os.path.dirname(os.path.abspath(copy_path))
    for _ in range(4):
        cand = os.path.join(d, "corpus", "ads.jsonl")
        if os.path.exists(cand):
            return cand
        d = os.path.dirname(d)
    return None


def load_corpus_shingles(path):
    index = {}
    if not path:
        return index
    with open(path, encoding="utf-8") as f:
        for line in f:
            try:
                ad = json.loads(line)
            except ValueError:
                continue
            text = " \n ".join([ad.get("primary_text", ""), ad.get("headline", ""), ad.get("description", "")])
            for s in shingles(text):
                index.setdefault(s, "%s (%s)" % (ad.get("id") or "?", ad.get("page_name") or "?"))
    return index


def hook_report(primary):
    first = primary.split("\n", 1)[0].strip()
    preview = primary[:HOOK_CUT].replace("\n", " / ")
    m = re.search(r"[.!?](\s|$)", primary)
    first_stop = m.end() if m else len(primary)
    problems = []
    if len(first) > HOOK_CUT and first_stop > HOOK_CUT:
        problems.append("The first sentence runs past %d characters, so the hook is cut by 'See more'." % HOOK_CUT)
    return preview, problems


def jaccard(a, b):
    sa, sb = set(words(a)), set(words(b))
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / float(len(sa | sb))


def check(path, corpus_path, allow_dashes):
    with open(path, encoding="utf-8") as f:
        md = f.read()
    variations = parse_copy(md)
    errors, warnings = [], []
    if not variations:
        print("No '## Variation' sections found. Use the format in docs/5-write.md.")
        return 1
    if len(variations) != 3:
        warnings.append("File has %d variations. The standard is 3." % len(variations))
    index = load_corpus_shingles(corpus_path)

    print("Checking %s" % path)
    print("Corpus for overlap check: %s" % (corpus_path or "none found (overlap check skipped)"))
    print("")
    for n, (title, f) in enumerate(variations, 1):
        tag = "V%d" % n
        pt, hl, ds = f["Primary text"], f["Headline"], f["Description"]
        print("%s  %s" % (tag, title))
        for label, val in (("Primary text", pt), ("Headline", hl), ("Description", ds)):
            if not val:
                errors.append("%s: missing %s (or its ```text block)." % (tag, label))
        pt, hl, ds = pt or "", hl or "", ds or ""
        print("    primary text %d chars | headline %d | description %d" % (len(pt), len(hl), len(ds)))
        preview, hook_problems = hook_report(pt)
        print("    before 'See more': %s" % preview)
        for p in hook_problems:
            warnings.append("%s: %s" % (tag, p))
        if len(hl) > HEADLINE_MAX:
            errors.append("%s: headline is %d chars. Max %d (it truncates on mobile)." % (tag, len(hl), HEADLINE_MAX))
        elif len(hl) > HEADLINE_IDEAL:
            print("    note: headline over %d chars may cut on some placements." % HEADLINE_IDEAL)
        if len(ds) > DESC_MAX + 10:
            errors.append("%s: description is %d chars. Keep it to about %d." % (tag, len(ds), DESC_MAX))
        elif len(ds) > DESC_MAX:
            warnings.append("%s: description is %d chars. Aim for %d or less." % (tag, len(ds), DESC_IDEAL))
        if len(pt) > 1500:
            warnings.append("%s: primary text is %d chars. Long copy can win, but check every line earns its place." % (tag, len(pt)))
        whole = "\n".join([pt, hl, ds])
        for bad in ("[NEED", "[INSERT", "{{", "TODO", "XX"):
            if bad in whole:
                errors.append("%s: unresolved placeholder '%s'. Get the real fact from the member or cut the line." % (tag, bad))
        if not allow_dashes and ("\u2014" in whole or " \u2013 " in whole):
            errors.append("%s: contains an em dash or spaced en dash. House style: use a period, comma or colon." % tag)
        tells = [t for t in AI_TELLS if re.search(r"(?<![a-z])%s(?![a-z])" % re.escape(t), whole.lower())]
        if tells:
            warnings.append("%s: sounds machine-written: %s" % (tag, ", ".join(tells)))
        for pattern, why in POLICY:
            m = re.search(pattern, whole, re.I)
            if m:
                warnings.append("%s: policy risk near '%s'. %s" % (tag, m.group(0), why))
        caps = re.findall(r"\b[A-Z]{4,}\b", whole)
        if len(caps) > 3:
            warnings.append("%s: %d ALL-CAPS words. Meta flags heavy caps. Keep caps for one or two words." % (tag, len(caps)))
        if re.search(r"[!?]{2,}", whole):
            warnings.append("%s: repeated punctuation (!! or ?!). Reads as spam." % tag)
        emoji = re.findall("[\U0001F300-\U0001FAFF☀-➿]", whole)
        if len(emoji) > 8:
            warnings.append("%s: %d emojis. Check the brand voice and the corpus norm." % (tag, len(emoji)))
        if hl and ds and hl.strip().lower() == ds.strip().lower():
            warnings.append("%s: headline and description are the same." % tag)
        if index:
            hits = {}
            for s in shingles(whole):
                if s in index:
                    hits.setdefault(index[s], s)
            for ad, phrase in list(hits.items())[:3]:
                errors.append("%s: copies %d+ words in a row from corpus ad %s: '%s...'. Rewrite in your own words." % (tag, SHINGLE, ad, phrase))
        if not f.get("Button"):
            warnings.append("%s: no **Button:** line. Suggest the call-to-action button." % tag)
        print("")

    texts = [(n + 1, v[1]["Primary text"] or "") for n, v in enumerate(variations)]
    for i in range(len(texts)):
        for j in range(i + 1, len(texts)):
            (a, ta), (b, tb) = texts[i], texts[j]
            sim = jaccard(ta, tb)
            if sim > 0.45:
                warnings.append("V%d and V%d primary texts share %d%% of their words. Make the angles more different." % (a, b, round(sim * 100)))
            if words(ta)[:3] and words(ta)[:3] == words(tb)[:3]:
                warnings.append("V%d and V%d open with the same words. Give each its own hook." % (a, b))
    lengths = sorted(len(t) for _, t in texts if t)
    if len(lengths) >= 3 and lengths[-1] < lengths[0] * 1.6:
        warnings.append("All variations are about the same length (%s chars). Mix a short, a medium and a long one." % ", ".join(map(str, lengths)))
    heads = [(v[1]["Headline"] or "").strip().lower() for v in variations]
    if len(set(h for h in heads if h)) < len([h for h in heads if h]):
        warnings.append("Two variations share a headline. Each needs its own.")

    for e in errors:
        print("ERROR    " + e)
    for w in warnings:
        print("WARNING  " + w)
    print("")
    if errors:
        print("RESULT: FIX (%d errors, %d warnings)" % (len(errors), len(warnings)))
        return 1
    print("RESULT: PASS (%d warnings)" % len(warnings))
    return 0


def main(argv=None):
    ensure_utf8_output()
    p = argparse.ArgumentParser(description="Check ad copy before delivery.")
    p.add_argument("file")
    p.add_argument("--corpus", help="path to corpus/ads.jsonl (found automatically if omitted)")
    p.add_argument("--allow-dashes", action="store_true", help="allow em dashes (only if the brand file says so)")
    args = p.parse_args(argv)
    if not os.path.exists(args.file):
        print("File not found: %s" % args.file)
        return 1
    return check(args.file, find_corpus(args.file, args.corpus), args.allow_dashes)


if __name__ == "__main__":
    sys.exit(main())
