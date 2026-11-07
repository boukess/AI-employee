#!/usr/bin/env python3
"""Local, single-editor workflow. Media arithmetic uses half-open frame intervals."""
import argparse
import collections
import datetime as dt
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import re
import shutil
import sqlite3
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from runtime import project_path, resolve_python, remotion_command, resolve_edition, detect_resolve
CONFIG = json.loads((ROOT / 'config/editor.json').read_text())
CONFIG['corpus_root'] = str(project_path(CONFIG['corpus_root']))


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')


def run(args, log=None):
    p = subprocess.run([str(a) for a in args], capture_output=True, text=True, cwd=ROOT)
    if log:
        Path(log).write_text(p.stdout + p.stderr)
    if p.returncode:
        raise RuntimeError(f'{Path(str(args[0])).name} failed ({p.returncode}):\n{p.stderr[-4000:]}\n{p.stdout[-1000:]}')
    return p


def ffmpeg():
    import imageio_ffmpeg
    return os.environ.get('FFMPEG', imageio_ffmpeg.get_ffmpeg_exe())


def probe(path):
    import av
    with av.open(str(path)) as c:
        videos = list(c.streams.video)
        v = videos[0] if videos else None
        duration = float(c.duration / av.time_base) if c.duration else 0
        fps = float(v.average_rate) if v and v.average_rate else 0
        return dict(path=str(Path(path).resolve()), duration=duration,
                    video_duration=float(v.duration*v.time_base) if v and v.duration is not None else (v.frames/fps if v and fps else None),
                    width=v.width if v else 0, height=v.height if v else 0,
                    fps=fps, frames=v.frames if v else 0,
                    audio=bool(c.streams.audio),
                    video_codec=v.codec_context.name if v else None)


def job_path(value):
    p = Path(value)
    if not p.is_absolute():
        p = ROOT / 'jobs' / p
    if not (p / 'job.json').exists():
        raise ValueError(f'Unknown job: {p}')
    return p.resolve()


def state(job, phase, **extra):
    data = read(job / 'job.json')
    data.update(phase=phase, updated_at=dt.datetime.now(dt.timezone.utc).isoformat(), **extra)
    write(job / 'job.json', data)


def validate_plan(p, source_frames=None):
    if p.get('fps') != CONFIG['fps']:
        raise ValueError('Plan fps must match normalized media fps.')
    if (p.get('width'),p.get('height')) != (CONFIG['width'],CONFIG['height']):
        raise ValueError('Plan dimensions must match normalized media dimensions.')
    if type(p.get('durationInFrames')) is not int or p['durationInFrames'] <= 0:
        raise ValueError('durationInFrames must be a positive integer.')
    cuts = p.get('cuts', [])
    if not cuts:
        raise ValueError('At least one cut is required.')
    total = 0
    for cut in cuts:
        a, b = cut['in'], cut['out']
        if type(a) is not int or type(b) is not int or not 0 <= a < b:
            raise ValueError('Cut in/out must be nonnegative integer frames, out exclusive.')
        if source_frames is not None and b > source_frames:
            raise ValueError('Cut extends beyond source media.')
        total += b - a
    if total != p['durationInFrames']:
        raise ValueError('Cut lengths do not match durationInFrames.')
    ids=set()
    for cue in p.get('scenes', []):
        if cue.get('id') in ids or not cue.get('id'):
            raise ValueError('Each scene needs a unique id.')
        ids.add(cue['id'])
        if cue.get('kind') not in ('flow','orbit','type','custom') or cue.get('layout') not in ('full','top','overlay'):
            raise ValueError('Unsupported scene kind or layout.')
        if any(type(cue[k]) is not int for k in ('from', 'duration')):
            raise ValueError('Scene timings must be integer frames.')
        if cue['from'] < 0 or cue['duration'] <= 0 or cue['from'] + cue['duration'] > total:
            raise ValueError('Scene is outside the output timeline.')
    scenes = sorted(p.get('scenes', []), key=lambda c: c['from'])
    for a, b in zip(scenes, scenes[1:]):
        if a['from'] + a['duration'] > b['from']:
            raise ValueError('Scene overlap: combine simultaneous elements into one scene.')
    if not p.get('creative_brief'):
        raise ValueError('Write a content-specific creative_brief before building.')
    if p.get('scenes') and (p.get('style_profile')!='corpus-v1' or not p.get('reference_observations')):
        raise ValueError('Use style_profile corpus-v1 and record the corpus references being matched.')
    if any(s.get('theme') not in ('corpus-white','corpus-cream') for s in p.get('scenes',[])):
        raise ValueError('Scene themes must match the locked white/cream corpus profile.')
    return total


def remap_words(words, cuts, fps):
    result, cursor = [], 0
    for cut in cuts:
        a, b = cut['in'] / fps, cut['out'] / fps
        for word in words:
            start, end = max(a, word['start']), min(b, max(word['end'],word['start']+1/fps))
            if end <= start:
                continue
            sf=min(cut['out']-cut['in']-1,round((start-a)*fps))
            ef=min(cut['out']-cut['in'],max(sf+1,round((end-a)*fps)))
            result.append(dict(text=word['word'].strip(),start=cursor+sf,end=cursor+ef))
        cursor += cut['out'] - cut['in']
    return result


def captions_from_words(words):
    groups, buf = [], []
    for word in words:
        if buf and (len(buf) >= 2 or re.search(r'[.!?]$',buf[-1]['text']) or word['start'] - buf[-1]['end'] > 12 or
                    len(' '.join(w['text'] for w in buf + [word])) > 20):
            groups.append(dict(start=buf[0]['start'], end=buf[-1]['end'], words=buf))
            buf = []
        buf.append(word)
    if buf:
        groups.append(dict(start=buf[0]['start'], end=buf[-1]['end'], words=buf))
    return groups


def measure(path, log=None):
    p = run([ffmpeg(), '-hide_banner', '-i', path, '-vn', '-af',
             'loudnorm=I=-12:TP=-1.5:LRA=5:print_format=json', '-f', 'null', '-'], log)
    matches = re.findall(r'\{\s*"input_i".*?\}', p.stderr, re.S)
    if not matches:
        raise RuntimeError('Could not measure audio loudness.')
    return json.loads(matches[-1])


def audio_master(job, plan):
    fps = plan['fps']
    chains, labels = [], []
    for n, c in enumerate(plan['cuts']):
        length = (c['out'] - c['in']) / fps
        # Millisecond fades avoid clicks at edits, without shifting sync.
        chains.append(f"[0:a]atrim=start={c['in']/fps}:end={c['out']/fps},asetpts=PTS-STARTPTS,"
                      f"afade=t=in:d=0.003,afade=t=out:st={max(0,length-0.003)}:d=0.003[a{n}]")
        labels.append(f'[a{n}]')
    chains.append(''.join(labels) + f'concat=n={len(labels)}:v=0:a=1[a]')
    dry = job / 'media/dialogue-edited.wav'
    run([ffmpeg(), '-v', 'error', '-y', '-i', job / 'media/source.mp4', '-filter_complex',
         ';'.join(chains), '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s24le', dry])
    original = measure(dry)
    if not math.isfinite(float(original['input_i'])):
        raise ValueError('No measurable dialogue. Use explicit allow_silent only for a silent motion demo.')
    a = CONFIG['audio']
    # Compression raises quieter words relative to peaks. Normalization then sets the final level.
    pre = 'highpass=f=70,equalizer=f=2800:t=q:w=0.8:g=1.5,acompressor=threshold=0.125:ratio=3:attack=8:release=100:makeup=1'
    target = f"loudnorm=I={a['integrated_lufs']}:TP={a['true_peak_dbtp']}:LRA={a['loudness_range']}"
    p = run([ffmpeg(), '-hide_banner', '-i', dry, '-af', pre + ',' + target + ':print_format=json',
             '-f', 'null', '-'], job / 'audio-pass1.log')
    stats = json.loads(re.findall(r'\{\s*"input_i".*?\}', p.stderr, re.S)[-1])
    norm = target + ':' + ':'.join(f'{key}={stats[value]}' for key, value in [
        ('measured_I','input_i'), ('measured_TP','input_tp'), ('measured_LRA','input_lra'),
        ('measured_thresh','input_thresh'), ('offset','target_offset')]) + ':linear=true:print_format=json'
    master = job / 'media/dialogue-mobile.wav'
    run([ffmpeg(), '-hide_banner', '-y', '-i', dry, '-af', pre + ',' + norm, '-ar', '48000',
         '-ac', '2', '-c:a', 'pcm_s24le', master], job / 'audio-pass2.log')
    after = measure(master)
    write(job / 'audio-report.json', dict(before=original, after=after, target=a,
          gain_lu=round(float(after['input_i']) - float(original['input_i']), 2)))
    return master


def index_corpus(_args):
    corpus = Path(CONFIG['corpus_root'])
    rows = [json.loads(line) for line in (corpus / 'manifest.jsonl').read_text().splitlines() if line.strip()]
    db = sqlite3.connect(ROOT / 'corpus/index.sqlite')
    db.execute('DROP TABLE IF EXISTS clips')
    db.execute('CREATE VIRTUAL TABLE clips USING fts5(id, source_id, type, caption, row_json UNINDEXED)')
    missing = []
    for r in rows:
        if not (corpus / r['clip']).exists():
            missing.append(r['clip'])
            continue
        db.execute('INSERT INTO clips VALUES (?,?,?,?,?)',
                   (Path(r['clip']).stem, r['source_id'], r['type'], r.get('source_caption',''), json.dumps(r)))
    db.commit(); db.close()
    durations = sorted(r['duration'] for r in rows)
    stats = dict(indexed=len(rows)-len(missing), sources=len(set(r['source_id'] for r in rows)),
                 types=dict(collections.Counter(r['type'] for r in rows)),
                 median_segment_seconds=durations[len(durations)//2], missing=missing,
                 indexed_at=dt.datetime.now(dt.timezone.utc).isoformat(),
                 note='Labels come from the supplied face-position classifier; captions describe whole source videos, not individual shots.')
    write(ROOT / 'corpus/stats.json', stats)
    print(json.dumps(stats, indent=2))


def references(args):
    if not (ROOT / 'corpus/index.sqlite').exists():
        index_corpus(args)
    db = sqlite3.connect(ROOT / 'corpus/index.sqlite')
    tokens = re.findall(r'[\w]+', args.query)
    query = ' OR '.join('"' + t + '"' for t in tokens)
    if not query:
        raise ValueError('Search needs a word or source ID.')
    found = db.execute('SELECT row_json FROM clips WHERE clips MATCH ? ORDER BY rank LIMIT 120', (query,)).fetchall()
    # Diverse references: at most two shots from one source video.
    rows, counts = [], collections.Counter()
    for (raw,) in found:
        r = json.loads(raw)
        if counts[r['source_id']] < 2:
            rows.append(r); counts[r['source_id']] += 1
        if len(rows) >= args.limit:
            break
    corpus = Path(CONFIG['corpus_root'])
    for r in rows:
        for key in ('clip','thumb','graphic_only'):
            if r.get(key): r[key] = str(corpus / r[key])
    dest = job_path(args.job) if args.job else ROOT / 'corpus'
    write(dest / 'references.json', rows)
    if rows:
        from PIL import Image, ImageDraw
        w, h = 240, 470
        sheet = Image.new('RGB',(w*4, math.ceil(len(rows)/4)*h),'#161b22')
        draw = ImageDraw.Draw(sheet)
        for i,r in enumerate(rows):
            im=Image.open(r['thumb']); im.thumbnail((228,410))
            x,y=(i%4)*w,(i//4)*h;sheet.paste(im,(x,y))
            draw.text((x,y+412),Path(r['clip']).stem,fill='white')
            draw.text((x,y+435),f"{r['start']:.2f}-{r['end']:.2f}s",fill='white')
        sheet.save(dest / 'reference-contact.jpg')
    print(json.dumps(dict(matches=len(rows),references=str(dest/'references.json'),contact_sheet=str(dest/'reference-contact.jpg')),indent=2))


def new(args):
    source = Path(args.source).expanduser().resolve()
    if not source.is_file(): raise ValueError(f'Missing source: {source}')
    slug = re.sub('[^a-z0-9-]+','-',args.name.lower()).strip('-')[:60] or 'edit'
    job = ROOT / 'jobs' / (dt.datetime.now().strftime('%Y%m%d-%H%M%S-%f') + '-' + slug)
    job.mkdir(parents=True)
    for folder in ['media','motion','analysis','renders']: (job/folder).mkdir()
    write(job/'job.json',dict(id=job.name,source=str(source),source_size=source.stat().st_size,
                            source_mtime_ns=source.stat().st_mtime_ns,phase='intake',revision=1,
                            created_at=dt.datetime.now(dt.timezone.utc).isoformat()))
    (job/'motion/Scenes.tsx').write_text((ROOT/'src/CustomScenes.tsx').read_text().replace("from './Composition'","from '../../../src/Composition'"))
    (job/'motion/index.tsx').write_text("import {registerRoot} from 'remotion';\nimport {createEditor} from '../../../src/Composition';\nimport {CustomScene} from './Scenes';\nregisterRoot(createEditor(CustomScene));\n")
    (job/'brief.md').write_text('# Editing brief\n\nGoal: \nAudience: \nHook: \nKeep/remove: \nBrand details (if supplied): \n')
    print(str(job))


def analyze(args):
    job = job_path(args.job); data = read(job/'job.json'); source = Path(data['source'])
    if source.stat().st_size != data['source_size'] or source.stat().st_mtime_ns != data['source_mtime_ns']:
        raise ValueError('Source changed since intake. Create a new job to avoid stale timing.')
    info = probe(source); write(job/'analysis/source-metadata.json',info)
    norm = job/'media/source.mp4'
    fps,w,h = CONFIG['fps'], CONFIG['width'], CONFIG['height']
    if not norm.exists():
        vf=f'scale={w}:{h}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={fps},setpts=PTS-STARTPTS'
        run([ffmpeg(),'-hide_banner','-y','-i',source,'-map','0:v:0','-map',f"0:a:{CONFIG.get('audio_stream',0)}?",
             '-vf',vf,'-c:v','libx264','-crf','17','-preset','fast','-pix_fmt','yuv420p',
             '-af','aresample=48000:async=1:first_pts=0','-c:a','aac','-b:a','256k','-ac','2',
             '-movflags','+faststart',norm],job/'analysis/normalize.log')
    normalized=probe(norm); write(job/'analysis/normalized-metadata.json',normalized)
    frames=normalized['frames'] or round(normalized['duration']*fps)
    # A small contact sheet lets the editor inspect framing, objects and on-screen text.
    from PIL import Image,ImageDraw
    sheet=Image.new('RGB',(960,math.ceil(min(16,max(1,frames//fps))/4)*450),'#161b22')
    draw=ImageDraw.Draw(sheet);count=min(16,max(1,frames//fps))
    for n in range(count):
        t=(n+0.5)*frames/fps/count;path=job/'analysis'/f'frame-{n:02}.jpg'
        run([ffmpeg(),'-v','error','-y','-ss',str(t),'-i',norm,'-frames:v','1','-vf','scale=228:-2',path])
        im=Image.open(path);im.thumbnail((228,415));x,y=(n%4)*240,(n//4)*450;sheet.paste(im,(x,y));draw.text((x,y+420),f'{t:.2f}s',fill='white')
    sheet.save(job/'analysis/contact.jpg')
    if normalized['audio']:
        run([ffmpeg(),'-hide_banner','-i',norm,'-af','silencedetect=noise=-35dB:d=0.35','-f','null','-'],job/'analysis/silences.log')
    transcript=job/'analysis/transcript.json'
    if normalized['audio'] and not args.skip_transcribe and not transcript.exists():
        from faster_whisper import WhisperModel
        model=WhisperModel(args.model or CONFIG['transcription_model'],device='cpu',compute_type='int8')
        segments, meta=model.transcribe(str(norm),word_timestamps=True,vad_filter=True)
        segs=[];words=[]
        for s in segments:
            segs.append(dict(start=s.start,end=s.end,text=s.text))
            words.extend(dict(start=x.start,end=x.end,word=x.word,probability=x.probability) for x in s.words or [])
        write(transcript,dict(language=meta.language,segments=segs,words=words,needs_editor_correction=True))
    plan=job/'plan.json'
    if not plan.exists():
        write(plan,dict(fps=fps,width=w,height=h,durationInFrames=frames,
                       cuts=[{'in':0,'out':frames}],scenes=[],captions=bool(normalized['audio']),
                       creative_brief='',style_profile='corpus-v1',reference_observations=[],allow_silent=False,
                       footage_variant='presenter',caption_phrases=[]))
    state(job,'analyzed')
    print(json.dumps(dict(job=str(job),source_frames=frames,transcript=str(transcript),contact_sheet=str(job/'analysis/contact.jpg')),indent=2))


def prepare(args):
    from asset_check import validate_assets
    from cadence import analyze as analyze_cadence
    job=job_path(args.job);plan=read(job/'plan.json');meta=probe(job/'media/source.mp4')
    total=validate_plan(plan,meta['frames'] or round(meta['duration']*plan['fps']))
    validate_assets(ROOT,plan)
    words=[]
    if plan.get('captions'):
        transcript=job/'analysis/transcript.json'
        if not transcript.exists(): raise ValueError('Captions require a timed transcript. Run analyze without --skip-transcribe.')
        words=remap_words(read(transcript)['words'],plan['cuts'],plan['fps'])
    if plan.get('caption_phrases'):
        phrases=[dict(word=p['text'],start=p['source_in'],end=p['source_out']) for p in plan['caption_phrases']]
        remapped=remap_words(phrases,plan['cuts'],plan['fps'])
        cues=[dict(start=w['start'],end=w['end'],words=[w]) for w in remapped]
    else:
        cues=captions_from_words(words)
    props=dict(plan,captionCues=cues)
    write(job/'motion/props.json',props)
    if meta['audio'] and not plan.get('allow_silent'):
        analyze_cadence(job,plan)
        audio_master(job,plan)
    else:
        if not plan.get('allow_silent'): raise ValueError('No audio present; allow_silent must be explicitly enabled for silent footage.')
        run([ffmpeg(),'-v','error','-y','-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-t',str(total/plan['fps']),'-c:a','pcm_s24le',job/'media/dialogue-mobile.wav'])
    state(job,'prepared'); print(str(job/'motion/props.json'))


def motion(args):
    from asset_check import validate_assets
    job=job_path(args.job);validate_plan(read(job/'plan.json'))
    validate_assets(ROOT,read(job/'plan.json'))
    cmd=remotion_command()+['render',job/'motion/index.tsx','ShortForm',job/'renders/motion.mov',
         f'--props={job/"motion/props.json"}','--codec=prores','--prores-profile=4444',
         '--pixel-format=yuva444p10le','--image-format=png','--concurrency=2','--log=error']
    cmd.append(f'--public-dir={ROOT/"public"}')
    run(cmd,job/'motion-render.log'); state(job,'motion_rendered'); print(str(job/'renders/motion.mov'))


def free_mode():
    return resolve_edition(CONFIG)=='free'


def bridge_status(job):
    if free_mode():
        import free_resolve
        return free_resolve.status(job)
    return json.loads(run([resolve_python(CONFIG),ROOT/'scripts/resolve_bridge.py','status',job]).stdout)


def assemble(args):
    job=job_path(args.job)
    if free_mode():
        import free_resolve
        plan=read(job/'plan.json');meta=probe(free_resolve.footage(job,plan))
        result=free_resolve.assemble(job,plan,read(job/'job.json'),meta['frames'] or None)
        (job/'resolve-assemble.log').write_text(json.dumps(result,indent=2)+'\n')
        state(job,'assembled'); print((job/'resolve-assemble.log').read_text()); return
    run([resolve_python(CONFIG),ROOT/'scripts/resolve_bridge.py','assemble',job],job/'resolve-assemble.log')
    state(job,'assembled'); print((job/'resolve-assemble.log').read_text())


def presenter(args):
    job=job_path(args.job)
    run([sys.executable,ROOT/'scripts/presenter.py',job,'--scale',str(args.scale),'--offset-y',str(args.offset_y)],job/'presenter-command.log')
    print(str(job/'media/presenter.mp4'))


def render(args):
    job=job_path(args.job)
    if free_mode():
        import free_resolve
        result=free_resolve.render(job,read(job/'plan.json'),read(job/'job.json'),ffmpeg(),CONFIG)
        (job/'resolve-render.log').write_text(json.dumps(result,indent=2)+'\n')
        state(job,'rendering'); print((job/'resolve-render.log').read_text()); return
    run([resolve_python(CONFIG),ROOT/'scripts/resolve_bridge.py','render',job],job/'resolve-render.log')
    state(job,'rendering'); print((job/'resolve-render.log').read_text())


def status(args):
    job=job_path(args.job)
    print(json.dumps(bridge_status(job)))


def finish(args):
    job=job_path(args.job);plan=read(job/'plan.json');bridge=read(job/'resolve.json')
    status_data=bridge_status(job)
    if status_data.get('JobStatus')!='Complete': raise ValueError(f'Resolve render not complete: {status_data}')
    src=Path(bridge['render_path']);data=probe(src)
    expected=plan['durationInFrames']/plan['fps']
    # Resolve AAC may add trailing codec padding; validate picture duration here.
    # The next step remuxes the exact edited WAV and trims the final container.
    if data['video_duration'] is None or abs(data['video_duration']-expected)>0.5/plan['fps']:
        raise ValueError('Export picture duration does not match edit plan.')
    if data['frames'] != plan['durationInFrames'] or abs(data['fps']-plan['fps'])>0.001:
        raise ValueError('Resolve video frame count/rate does not match the edit plan.')
    if (data['width'],data['height'])!=(plan['width'],plan['height']): raise ValueError('Unexpected export resolution.')
    # Re-encode AAC from the mastered WAV to preserve levels and place MP4 metadata first.
    revision=read(job/'job.json')['revision']
    (ROOT/'exports').mkdir(exist_ok=True)
    output=ROOT/'exports'/f'{job.name}-v{revision:02}.mp4'
    if output.exists(): raise ValueError('Export exists. Use feedback to create a new revision.')
    run([ffmpeg(),'-v','error','-y','-i',src,'-i',job/'media/dialogue-mobile.wav',
         '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000',
         '-t',str(expected),'-movflags','+faststart',output])
    # Decodeability and measured encoded loudness are technical checks, not creative review.
    run([ffmpeg(),'-v','error','-i',output,'-f','null','-'],job/'decode-check.log')
    report=dict(media=probe(output),duration_expected=expected,source=('FFmpeg render of the edit (free Resolve mode; FCPXML timeline in resolve-free/)' if bridge.get('mode')=='free' else 'DaVinci Resolve timeline export'),
                user_review='pending',review_agents_used=False,critique_agents_used=False)
    if not plan.get('allow_silent'):
        report['encoded_audio']=measure(output)
        loud=float(report['encoded_audio']['input_i']);peak=float(report['encoded_audio']['input_tp'])
        report['audio_pass']=abs(loud-CONFIG['audio']['integrated_lufs'])<=1.0 and peak<=-1.0
        if not report['audio_pass']:
            failed=job/'renders'/f'failed-audio-v{revision:02}.mp4'
            shutil.move(output,failed)
            write(job/'technical-report.json',report)
            raise ValueError('Encoded audio outside target; see technical-report.json. File retained in renders for repair.')
    write(job/'technical-report.json',report)
    state(job,'awaiting_user_feedback',final_mp4=str(output))
    print(str(output))


def feedback(args):
    job=job_path(args.job);data=read(job/'job.json');revision=data['revision']
    notes=job/'feedback.jsonl'
    with notes.open('a') as f: f.write(json.dumps(dict(revision=revision,note=args.note,time=dt.datetime.now(dt.timezone.utc).isoformat()))+'\n')
    archive=job/'revisions'/f'v{revision:02}';archive.mkdir(parents=True,exist_ok=False)
    for name in ['plan.json','motion','resolve.json','technical-report.json','audio-report.json']:
        p=job/name
        if p.is_dir(): shutil.copytree(p,archive/name)
        elif p.exists(): shutil.copy2(p,archive/name)
    state(job,'revision_requested',revision=revision+1)
    print(f'Recorded feedback; revise plan.json and motion/Scenes.tsx, then prepare, motion, assemble, render, finish. Revision {revision+1}.')


def doctor(_args):
    results={x:bool(importlib.util.find_spec(x)) for x in ['av','PIL','imageio_ffmpeg','faster_whisper','onnxruntime','cv2']}
    results['node']=bool(shutil.which('node'))
    results['remotion']=(ROOT/'node_modules/@remotion/cli/remotion-cli.js').exists()
    results['presenter_model']=(ROOT/'models/rvm_mobilenetv3_fp32.onnx').exists()
    results['caption_font']=(ROOT/'public/fonts/Poppins-ExtraBold.ttf').exists()
    results['corpus']=Path(CONFIG['corpus_root'],'manifest.jsonl').exists()
    if free_mode():
        # Free Resolve 21.1+ has no Python/external scripting; the pack exports FCPXML and renders with FFmpeg.
        try: results['ffmpeg']=Path(ffmpeg()).is_file() or bool(shutil.which(ffmpeg()))
        except Exception: results['ffmpeg']=False
        try: installed=detect_resolve()
        except Exception as e: installed={'detected':False,'error':str(e)}
        results['resolve']=dict(mode='free',connected=False,installed=installed,
                                note='Free mode: no scripting connection needed. Timelines are exported as FCPXML for File > Import > Timeline.')
        results['ready']=all(value for key,value in results.items() if key!='resolve')
    else:
        try:
            r=run([resolve_python(CONFIG),ROOT/'scripts/resolve_bridge.py','doctor'])
            results['resolve']=json.loads(r.stdout)
        except Exception as e: results['resolve']={'connected':False,'error':str(e)}
        results['ready']=all(value for key,value in results.items() if key!='resolve') and results['resolve'].get('connected',False)
    print(json.dumps(results,indent=2))
    if not results['ready']: raise SystemExit(1)


def inbox(_args):
    records=[]
    for meta in (ROOT/'jobs').glob('*/job.json'):
        try: records.append(read(meta))
        except (ValueError,OSError): continue
    pending=[];known=[]
    for source in sorted((ROOT/'inbox').iterdir()):
        if not source.is_file() or source.suffix.lower() not in ('.mp4','.mov','.m4v','.mkv','.webm'): continue
        stat=source.stat()
        matches=[r for r in records if r.get('source')==str(source.resolve()) and r.get('source_size')==stat.st_size and r.get('source_mtime_ns')==stat.st_mtime_ns]
        item=dict(path=str(source.resolve()),bytes=stat.st_size)
        if matches:
            item['jobs']=[dict(id=r['id'],phase=r['phase'],revision=r['revision'],final_mp4=r.get('final_mp4')) for r in matches]
            known.append(item)
        else: pending.append(item)
    print(json.dumps(dict(pending=pending,known=known,note='Resume unfinished known jobs. Create one job per pending recording; originals stay in inbox.'),indent=2))


def main():
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
    for name in ['doctor','index-corpus','inbox']: sub.add_parser(name)
    p=sub.add_parser('new');p.add_argument('source');p.add_argument('--name',default='short-form')
    p=sub.add_parser('references');p.add_argument('query');p.add_argument('--job');p.add_argument('--limit',type=int,default=12)
    for name in ['analyze','presenter','prepare','motion','assemble','render','status','finish','feedback']:
        p=sub.add_parser(name);p.add_argument('job')
        if name=='analyze': p.add_argument('--skip-transcribe',action='store_true');p.add_argument('--model')
        if name=='feedback': p.add_argument('note')
        if name=='presenter':p.add_argument('--scale',type=float,default=.86);p.add_argument('--offset-y',type=int,default=838)
    args=parser.parse_args()
    globals()[args.command.replace('-','_')](args)


if __name__=='__main__':
    try: main()
    except Exception as e:
        print(f'ERROR: {e}',file=sys.stderr);sys.exit(1)
