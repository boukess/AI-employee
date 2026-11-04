"""Free DaVinci Resolve mode (no Studio scripting needed).

DaVinci Resolve 21.1 moved Python scripting, external scripting and ResolvePython
to Studio. In free mode this module replaces the three Studio-only bridge steps:

  assemble -> writes an FCPXML timeline (V1 edited footage, V2 Remotion alpha
              graphics + captions, A1 mastered dialogue) that free Resolve can
              open with File > Import > Timeline, plus import instructions.
  render   -> renders the same layers with FFmpeg to an 8-bit H.264 MP4 within
              the free edition's limits (max UHD 3840x2160, max 60 fps).
  status   -> reports the FFmpeg render as complete when the file exists.

Selected explicitly with "resolve_edition": "free" in config/editor.json or
AI_VIDEO_EDITOR_RESOLVE_EDITION=free. Studio mode is unchanged.
"""
import json
from pathlib import Path
import subprocess
import time
from xml.sax.saxutils import quoteattr

FREE_MAX_LONG, FREE_MAX_SHORT, FREE_MAX_FPS = 3840, 2160, 60
SUPPORTED_TRANSFORM = {'ZoomX', 'ZoomY', 'Pan', 'Tilt'}


def _read(path): return json.loads(Path(path).read_text())


def _write(path, value):
    Path(path).write_text(json.dumps(value, indent=2) + '\n')


def check_free_limits(plan):
    w, h, fps = plan['width'], plan['height'], plan['fps']
    if max(w, h) > FREE_MAX_LONG or min(w, h) > FREE_MAX_SHORT or fps > FREE_MAX_FPS:
        raise ValueError(f'{w}x{h}@{fps} is above free DaVinci Resolve limits '
                         f'(UHD 3840x2160, 60 fps). Lower width/height/fps in config/editor.json.')


def footage(job, plan):
    return job / 'media' / ('presenter.mp4' if plan.get('footage_variant') == 'presenter' else 'source.mp4')


def _layers(job, plan):
    paths = dict(footage=footage(job, plan), motion=job / 'renders/motion.mov',
                 audio=job / 'media/dialogue-mobile.wav')
    for p in paths.values():
        if not p.exists(): raise FileNotFoundError(f'Missing media: {p}')
    return paths


def _t(frames, fps):
    return f'{int(frames)}/{int(fps)}s' if float(fps).is_integer() else f'{frames/fps:.6f}s'


def assemble(job, plan, meta, footage_frames=None):
    """Write an importable FCPXML timeline for free Resolve. No Resolve connection is used."""
    check_free_limits(plan)
    paths = _layers(job, plan)
    fps, total = plan['fps'], plan['durationInFrames']
    name = f"AIVE_{job.name}_v{meta['revision']:02}_{int(time.time())}"
    out = job / 'resolve-free'
    out.mkdir(exist_ok=True)
    src_frames = footage_frames or max(c['out'] for c in plan['cuts'])
    transformed = [n for n, c in enumerate(plan['cuts']) if c.get('transform')]
    fmt = 'r1'
    res = [f'<format id="r1" name="AIVE_{plan["width"]}x{plan["height"]}p{fps}" frameDuration="{_t(1, fps)}" '
           f'width="{plan["width"]}" height="{plan["height"]}"/>']
    ids = {}
    for n, (key, p) in enumerate(paths.items(), start=2):
        ids[key] = f'r{n}'
        video = key != 'audio'
        audio = key in ('footage', 'audio')
        attrs = (f'id="r{n}" name={quoteattr(p.name)} start="0s" duration="{_t(total if key != "footage" else src_frames, fps)}" '
                 f'hasVideo="{int(video)}" hasAudio="{int(audio)}"' + (f' format="{fmt}"' if video else '') +
                 (' audioSources="1" audioChannels="2" audioRate="48000"' if audio else ''))
        res.append(f'<asset {attrs}><media-rep kind="original-media" src={quoteattr(p.resolve().as_uri())}/></asset>')
    spine, record = [], 0
    for n, cut in enumerate(plan['cuts']):
        length = cut['out'] - cut['in']
        inner = ''
        if n == 0:
            # Connected clips are timed in the parent's source time, so offset = parent start.
            inner = (f'<asset-clip ref="{ids["motion"]}" lane="1" offset="{_t(cut["in"], fps)}" start="0s" '
                     f'duration="{_t(total, fps)}" name="02 Remotion graphics + captions"/>'
                     f'<asset-clip ref="{ids["audio"]}" lane="-1" offset="{_t(cut["in"], fps)}" start="0s" '
                     f'duration="{_t(total, fps)}" name="01 Mobile dialogue master"/>')
        spine.append(f'<asset-clip ref="{ids["footage"]}" offset="{_t(record, fps)}" start="{_t(cut["in"], fps)}" '
                     f'duration="{_t(length, fps)}" srcEnable="video" name="cut {n+1:03}">{inner}</asset-clip>')
        record += length
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n<fcpxml version="1.9">\n<resources>\n'
           + '\n'.join(res) + '\n</resources>\n<library><event name="AI Video Editor">'
           f'<project name={quoteattr(name)}><sequence format="r1" duration="{_t(total, fps)}" tcStart="0s" '
           'tcFormat="NDF" audioLayout="stereo" audioRate="48k"><spine>\n' + '\n'.join(spine) +
           '\n</spine></sequence></project></event></library>\n</fcpxml>\n')
    timeline = out / f'{name}.fcpxml'
    timeline.write_text(xml, encoding='utf-8')
    notes = [
        'Open this edit in FREE DaVinci Resolve (optional; the finished MP4 comes from `render`).',
        '',
        '1. Open DaVinci Resolve and create or open a project.',
        f'2. File > Import > Timeline..., choose: {timeline}',
        '3. Leave "Automatically import source clips into media pool" ticked. If asked, keep the',
        f'   timeline settings ({plan["width"]}x{plan["height"]}, {fps} fps).',
        '4. Tracks: V1 edited footage, V2 Remotion graphics + captions (ProRes 4444 with alpha), A1 mastered dialogue.',
        '   If V2 shows black instead of see-through, select the V2 clip in the Media Pool, Clip Attributes >',
        '   Video > Alpha mode: Straight.',
        '5. To export from Resolve instead of FFmpeg: Deliver page, MP4, H.264, '
        f'{plan["width"]}x{plan["height"]}, {fps} fps. Free Resolve limits: up to UHD 3840x2160 at 60 fps, 8-bit.',
    ]
    if transformed:
        notes.append(f'NOTE: cuts {transformed} have transforms; FFmpeg render applies them, the FCPXML does not. Re-apply in the Inspector if you finish in Resolve.')
    (out / 'IMPORT-INTO-RESOLVE.txt').write_text('\n'.join(notes) + '\n', encoding='utf-8')
    bridge = dict(mode='free', project=name, timeline=timeline.name, timeline_file=str(timeline),
                  import_help=str(out / 'IMPORT-INTO-RESOLVE.txt'), frames=total)
    _write(job / 'resolve.json', bridge)
    return dict(mode='free', project=name, frames=total, fcpxml=str(timeline),
                next='Run render (FFmpeg) for the MP4, or import the FCPXML into free Resolve.')


def _transform_chain(t, w, h, fps, length, label_in, label_out, n):
    unknown = set(t) - SUPPORTED_TRANSFORM
    if unknown:
        raise ValueError(f'Free mode supports cut transforms {sorted(SUPPORTED_TRANSFORM)} only; got {sorted(unknown)}.')
    zx, zy = float(t.get('ZoomX', 1)), float(t.get('ZoomY', t.get('ZoomX', 1)))
    pan, tilt = float(t.get('Pan', 0)), float(t.get('Tilt', 0))
    # Resolve: Pan + moves right, Tilt + moves up, zoom about frame centre.
    return (f'color=c=black:s={w}x{h}:r={fps}:d={length/fps}[bg{n}];'
            f'{label_in}scale=trunc(iw*{zx}/2)*2:trunc(ih*{zy}/2)*2[sc{n}];'
            f'[bg{n}][sc{n}]overlay=x=(W-w)/2+({pan}):y=(H-h)/2-({tilt}):shortest=1{label_out}')


def render(job, plan, meta, ffmpeg_exe, config):
    """Composite footage cuts + alpha graphics + mastered dialogue with FFmpeg (8-bit H.264)."""
    check_free_limits(plan)
    paths = _layers(job, plan)
    fps, w, h, total = plan['fps'], plan['width'], plan['height'], plan['durationInFrames']
    opts = dict(crf=17, preset='medium')
    opts.update(config.get('free_render', {}))
    chains, labels = [], []
    for n, cut in enumerate(plan['cuts']):
        base = f"[0:v]trim=start_frame={cut['in']}:end_frame={cut['out']},setpts=N/({fps}*TB)"
        if cut.get('transform'):
            chains.append(base + f'[t{n}]')
            chains.append(_transform_chain(cut['transform'], w, h, fps, cut['out'] - cut['in'], f'[t{n}]', f'[v{n}]', n))
        else:
            chains.append(base + f',scale={w}:{h},setsar=1[v{n}]')
        labels.append(f'[v{n}]')
    # Re-time by frame number (exact CFR, no fps-filter rounding that can drop a frame).
    chains.append(''.join(labels) + f'concat=n={len(labels)}:v=1:a=0,setpts=N/({fps}*TB)[base]')
    chains.append(f'[1:v]setpts=N/({fps}*TB)[gfx]')
    chains.append('[base][gfx]overlay=0:0:format=auto:eof_action=pass,format=yuv420p[v]')
    stem = f"ffmpeg-v{meta['revision']:02}-{int(time.time())}"
    output = job / 'renders' / f'{stem}.mp4'
    cmd = [ffmpeg_exe, '-hide_banner', '-y', '-i', paths['footage'], '-i', paths['motion'], '-i', paths['audio'],
           '-filter_complex', ';'.join(chains), '-map', '[v]', '-map', '2:a:0', '-frames:v', str(total),
           '-r', str(fps), '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
           '-crf', str(opts['crf']), '-preset', str(opts['preset']),
           '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', output]
    p = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    (job / 'ffmpeg-render.log').write_text(p.stdout + p.stderr)
    if p.returncode:
        raise RuntimeError(f'FFmpeg free-mode render failed ({p.returncode}):\n{p.stderr[-4000:]}')
    bridge = _read(job / 'resolve.json') if (job / 'resolve.json').exists() else dict(mode='free')
    bridge.update(mode='free', render_job='ffmpeg', render_path=str(output), renderer='FFmpeg libx264 8-bit (free mode)')
    _write(job / 'resolve.json', bridge)
    return dict(render_job='ffmpeg', output=str(output))


def status(job):
    bridge = _read(job / 'resolve.json')
    if not bridge.get('render_job'): raise ValueError('No render has been started.')
    done = Path(bridge['render_path']).exists()
    return dict(JobStatus='Complete' if done else 'Failed', CompletionPercentage=100 if done else 0,
                renderer=bridge.get('renderer'))
