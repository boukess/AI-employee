#!/usr/bin/env python3
"""Measure quiet intervals across proposed cuts. Advisory; never edits speech."""
import json
import re
import subprocess
import sys
from pathlib import Path
import imageio_ffmpeg


def remap_quiet(intervals, cuts, fps):
    result = []
    cursor = 0.0
    for cut in cuts:
        start, end = cut['in'] / fps, cut['out'] / fps
        for a, b in intervals:
            lo, hi = max(a, start), min(b, end)
            if hi > lo:
                result.append([cursor + lo - start, cursor + hi - start])
        cursor += end - start
    merged = []
    for a, b in sorted(result):
        if merged and a <= merged[-1][1] + 0.001:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    return merged


def analyze(job, plan):
    proc = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner',
        '-i', str(job / 'media/source.mp4'), '-af', 'silencedetect=noise=-40dB:d=0.10',
        '-f', 'null', '-'], capture_output=True, text=True, check=True)
    intervals, start = [], None
    for line in proc.stderr.splitlines():
        a = re.search(r'silence_start: ([\d.]+)', line)
        b = re.search(r'silence_end: ([\d.]+)', line)
        if a:
            start = float(a[1])
        if b and start is not None:
            intervals.append([start, float(b[1])])
            start = None
    gaps = remap_quiet(intervals, plan['cuts'], plan['fps'])
    report = {'threshold_db': -40, 'advisory_only': True,
        'note': 'Check these against real speech and breathing. ASR times and amplitude alone cannot decide a natural edit.',
        'quiet_intervals': [dict(start=round(a, 4), end=round(b, 4), duration=round(b-a, 4)) for a, b in gaps],
        'gaps_over_300ms': [dict(start=round(a, 4), end=round(b, 4), duration=round(b-a, 4)) for a, b in gaps if b-a > 0.3]}
    (job / 'cadence-report.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


if __name__ == '__main__':
    job = Path(sys.argv[1]).resolve()
    print(json.dumps(analyze(job, json.loads((job / 'plan.json').read_text())), indent=2))
