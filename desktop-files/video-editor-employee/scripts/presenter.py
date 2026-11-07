"""Build the corpus's lower camera card + foreground head overlap from unedited footage."""
import argparse
import json
from pathlib import Path
import subprocess
import time
import av
import cv2
import imageio_ffmpeg
import numpy as np
import onnxruntime as ort
from PIL import Image,ImageDraw,ImageFilter

ROOT=Path(__file__).resolve().parents[1]


def render(job,scale=.86,offset_y=838,limit=None):
    source=job/'media/source.mp4';dest=job/'media/presenter.mp4'
    model=ROOT/'models/rvm_mobilenetv3_fp32.onnx'
    if not model.exists():
        raise RuntimeError('Missing RVM model; follow docs/PRESENTER.md. No cloud upload is needed.')
    options=ort.SessionOptions();options.intra_op_num_threads=4
    session=ort.InferenceSession(str(model),options,providers=['CPUExecutionProvider'])
    rec=[np.zeros((1,1,1,1),np.float32) for _ in range(4)]
    ratio=np.array([.25],np.float32)
    W,H=1080,1920;tw=int(round(W*scale));th=int(round(H*scale));left=(W-tw)//2;top=int(offset_y)
    # This is one transformed camera image, with a person-only extension above its card.
    # The source image and foreground share exactly the same transform to avoid seams.
    mask=Image.new('L',(W*2,H*2));draw=ImageDraw.Draw(mask)
    draw.rounded_rectangle((left*2,1170*2,(left+tw)*2,(H+130)*2),radius=88*2,fill=255)
    mask=mask.resize((W,H),Image.Resampling.LANCZOS)
    shadow=np.asarray(mask.filter(ImageFilter.GaussianBlur(11)),dtype=np.float32)/255
    m=np.asarray(mask,dtype=np.float32)/255
    base=np.full((H,W,3),253,np.float32)-shadow[:,:,None]*7
    log=(job/'presenter-render.log').open('w')
    cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','pipe:0','-an','-c:v','libx264','-crf','16','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
    c=av.open(str(source));count=0;start=time.time()
    try:
        for n,frame in enumerate(c.decode(video=0)):
            if limit and n>=limit:break
            rgb=frame.to_ndarray(format='rgb24')
            src=np.ascontiguousarray(rgb.transpose(2,0,1)[None],dtype=np.float32)/255
            fgr,pha,*rec=session.run(None,dict(src=src,r1i=rec[0],r2i=rec[1],r3i=rec[2],r4i=rec[3],downsample_ratio=ratio))
            alpha=cv2.resize(np.clip(pha[0,0],0,1),(tw,th),interpolation=cv2.INTER_LINEAR)
            fg=cv2.resize(np.clip(fgr[0].transpose(1,2,0),0,1)*255,(tw,th),interpolation=cv2.INTER_LINEAR)
            camera=cv2.resize(rgb,(tw,th),interpolation=cv2.INTER_AREA).astype(np.float32)
            out=base.copy();vis=min(th,H-top)
            region=out[top:top+vis,left:left+tw];cm=m[top:top+vis,left:left+tw,None]
            a=alpha[:vis,:,None]
            head=fg[:vis]*a+region*(1-a)
            region[:]=camera[:vis]*cm+head*(1-cm)
            data=np.clip(out,0,255).astype(np.uint8)
            proc.stdin.write(data.tobytes())
            count+=1
            if n in (0,120,360,720,1080):
                Image.fromarray(data).save(job/'analysis'/f'presenter-{n:04}.jpg')
            if count%120==0:print(f'Presenter matte {count} frames, {count/(time.time()-start):.1f} fps',flush=True)
    finally:
        c.close();proc.stdin.close();code=proc.wait();log.close()
    if code:raise RuntimeError('Presenter encoding failed; see presenter-render.log')
    with av.open(str(dest)) as result:
        if result.streams.video[0].frames!=count:raise RuntimeError('Presenter plate frame count mismatch')
    report=dict(model='RVM MobileNetV3 FP32',frames=count,scale=scale,offset_y=top,
                card=dict(x=left,y=1170,width=tw,corner_radius=88),background='#fdfdfd',
                note='Foreground alpha above the same transformed original camera card; source retained untouched.')
    (job/'presenter-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(str(dest))


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('job',type=Path);p.add_argument('--scale',type=float,default=.86);p.add_argument('--offset-y',type=int,default=838);p.add_argument('--limit',type=int)
    a=p.parse_args();render(a.job.resolve(),a.scale,a.offset_y,a.limit)
