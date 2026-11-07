#!/usr/bin/env python3
"""Pattern finder for BOUKE post metrics. Stdlib only. Never invents data.

normalize <export.csv> [out.csv]  map common export headers to the kit schema
analyze <normalized.csv>          group means of engagement rate by format, hour,
                                  weekday, hook bucket, caption bucket, thumbnail style
--selftest                        run against a built-in EXAMPLE table
"""
import csv, sys, statistics
from datetime import datetime

COLS = ["post_id","platform","format","posted_at","hook_seconds","caption_chars",
        "thumbnail_style","views","likes","comments","shares","saves","watch_time_s","avg_view_pct"]
ALIASES = {"postid":"post_id","id":"post_id","content":"post_id","posttype":"format","type":"format",
           "dateposted":"posted_at","date":"posted_at","publish time":"posted_at","video publish time":"posted_at",
           "impressions":"views","plays":"views"}
MIN_N = 5

def key(h):
    h=h.strip().lower(); return ALIASES.get(h.replace("_","").replace(" ",""), ALIASES.get(h, h.replace(" ","_")))

def normalize(src, out):
    with open(src, newline="", encoding="utf-8-sig") as f:
        rows=[{key(k):v for k,v in r.items()} for r in csv.DictReader(f)]
    with open(out,"w",newline="") as f:
        w=csv.DictWriter(f,COLS,extrasaction="ignore"); w.writeheader()
        for r in rows: w.writerow({c:r.get(c,"") for c in COLS})
    print(f"normalized {len(rows)} rows from {src} -> {out}")

def num(v):
    try: return float(v)
    except (TypeError,ValueError): return None

def bucket(v, edges, labels):
    if v is None: return None
    for e,l in zip(edges,labels):
        if v<=e: return l
    return labels[-1]

def features(r):
    t=None
    for fmt in ("%Y-%m-%d %H:%M","%Y-%m-%dT%H:%M:%S","%Y-%m-%d %H:%M:%S","%Y-%m-%d"):
        try: t=datetime.strptime(r.get("posted_at","")[:19],fmt); break
        except ValueError: pass
    return {"format":r.get("format") or None,"platform":r.get("platform") or None,
            "hour":(f"{t.hour:02d}h" if t and (" " in r["posted_at"] or "T" in r["posted_at"]) else None),
            "weekday":(t.strftime("%a") if t else None),
            "hook":bucket(num(r.get("hook_seconds")),[1.5,3,5],["<=1.5s","1.5-3s","3-5s",">5s"]),
            "caption":bucket(num(r.get("caption_chars")),[50,150,300],["<=50","51-150","151-300",">300"]),
            "thumbnail":r.get("thumbnail_style") or None}

def rate(r):
    v=num(r.get("views")); e=sum(num(r.get(k)) or 0 for k in ("likes","comments","shares","saves"))
    return (e/v) if v else None, e

def analyze(rows, label="source"):
    out=[f"# Patterns ({label}, {len(rows)} posts)","",
         "Metric: engagement rate = (likes+comments+shares+saves)/views; raw engagement when views missing.",
         f"Groups with n<{MIN_N} are WEAK SIGNAL, not rules.",""]
    use_rate=any(rate(r)[0] is not None for r in rows)
    for dim in ("platform","format","hour","weekday","hook","caption","thumbnail"):
        g={}
        for r in rows:
            k=features(r)[dim]; m=rate(r)[0] if use_rate else rate(r)[1]
            if k is None or m is None: continue
            g.setdefault(k,[]).append(m)
        if not g: out.append(f"## {dim}: no data in export"); out.append(""); continue
        out.append(f"## {dim}"); out.append("| group | n | mean | median | note |"); out.append("|---|---|---|---|---|")
        for k,v in sorted(g.items(), key=lambda kv:-statistics.mean(kv[1])):
            fm=(lambda x:f"{x:.2%}") if use_rate else (lambda x:f"{x:.1f}")
            out.append(f"| {k} | {len(v)} | {fm(statistics.mean(v))} | {fm(statistics.median(v))} | {'WEAK SIGNAL' if len(v)<MIN_N else ''} |")
        out.append("")
    return "\n".join(out)

def selftest():
    ex=[]
    for i in range(12):
        ex.append({"post_id":f"EX{i}","platform":"tiktok","format":"short" if i%2 else "carousel",
                   "posted_at":f"2026-01-{i+1:02d} {18 if i%3 else 9}:00","hook_seconds":str(1+i%4),
                   "caption_chars":str(40+i*30),"thumbnail_style":"face" if i%2 else "text",
                   "views":"1000","likes":str(50+i),"comments":"5","shares":"2","saves":"1"})
    rep=analyze(ex,"EXAMPLE selftest data, not BOUKE")
    assert "## format" in rep and "| short | 6 |" in rep and "WEAK SIGNAL" in rep, rep
    print("patterns: PASS")

if __name__=="__main__":
    a=sys.argv[1:]
    if not a or a[0] in ("-h","--help"): print(__doc__)
    elif a[0]=="--selftest": selftest()
    elif a[0]=="normalize": normalize(a[1], a[2] if len(a)>2 else "workspace/metrics/normalized.csv")
    elif a[0]=="analyze":
        with open(a[1],newline="",encoding="utf-8-sig") as f: print(analyze(list(csv.DictReader(f)),a[1]))
