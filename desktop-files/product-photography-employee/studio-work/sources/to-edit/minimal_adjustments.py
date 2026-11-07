from PIL import Image,ImageOps,ImageEnhance,ImageFilter,ImageChops
from pathlib import Path
import math,json,zipfile
root=Path(r'C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit')
src=root/'01_Selected_Originals'; out=root/'02_Minimal_Edits';out.mkdir(exist_ok=True)
# Small, deterministic tonal corrections only. No generative models or retouching.
settings={
'IDG_20261011_162137_035.JPG':(.12,.12,(1.012,1.0,.992),1.015),
'IMG_0022.JPG':(.08,.10,(1.0,1.0,1.0),1.01),
'IMG_2216.JPG':(.08,.07,(1.012,1.0,.990),1.0),
'IMG_3760.JPG':(.02,.04,(1.0,1.0,1.0),1.01),
'IMG_3859.JPEG':(.00,.025,(1.0,1.0,1.0),1.0),
'IMG_3965.JPG':(.00,.04,(1.0,1.0,1.0),1.0),
'IMG_5740.JPG':(.03,.055,(1.008,1.0,.994),1.015),
'IMG_5743.JPG':(.03,.05,(1.008,1.0,.994),1.015),
'IMG_5766.JPG':(.03,.055,(1.008,1.0,.994),1.015),
'IMG_7704.jpg':(.07,.14,(1.008,1.0,1.008),1.0),
'IMG_7881.JPG':(.00,.025,(1.0,1.0,1.0),1.0),
'IMG_7909.jpg':(.00,.025,(.989,1.0,1.018),1.0)
}
records=[]; tiles=[]
for name,(ev,shadow,wb,sat) in settings.items():
 raw=Image.open(src/name); icc=raw.info.get('icc_profile'); im=ImageOps.exif_transpose(raw).convert('RGB'); original=im.copy();exif=raw.getexif();exif[274]=1
 # Smooth exposure curve with protected whites and a gentle toe lift.
 table=[]
 for i in range(256):
  x=i/255.; gain=2**ev; y=x*gain/(1+(gain-1)*x);y+=shadow*math.sqrt(x)*(1-x)**3
  table.append(round(max(0,min(1,y))*255))
 im=im.point(table*3)
 if wb!=(1.0,1.0,1.0):
  channels=im.split(); adjusted=[]
  for ch,g in zip(channels,wb):
   adjusted.append(ch.point([round(max(0,min(255,i+(g-1)*i*(1-i/255.)))) for i in range(256)]))
  im=Image.merge('RGB',adjusted)
 if sat!=1: im=ImageEnhance.Color(im).enhance(sat)
 # Very mild edge sharpening; no skin smoothing, shape, or content changes.
 im=im.filter(ImageFilter.UnsharpMask(radius=.7,percent=28,threshold=4))
 target=out/(Path(name).stem+'_minimal.jpg')
 kwargs={'quality':92,'subsampling':0,'optimize':True,'exif':exif.tobytes()}
 if icc:kwargs['icc_profile']=icc
 im.save(target,**kwargs)
 with Image.open(target) as check: check.load(); assert check.size==original.size
 a=original.copy();a.thumbnail((180,240)); b=im.copy();b.thumbnail((180,240));tile=Image.new('RGB',(380,275),(28,28,28));tile.paste(a,(0,0));tile.paste(b,(195,0))
 from PIL import ImageDraw
 d=ImageDraw.Draw(tile);d.text((2,245),Path(name).stem+' | before / after',fill='white');tiles.append(tile)
 records.append({'file':target.name,'size':im.size,'exposure_ev':ev,'shadow_lift':shadow,'white_balance_rgb':wb,'color':sat})
 print(target.name,flush=True)
preview=Image.new('RGB',(1140,1100),(28,28,28))
for n,t in enumerate(tiles):preview.paste(t,((n%3)*380,(n//3)*275))
preview.save(out/'Before_After_Review.jpg',quality=92)
(out/'README.txt').write_text('12 minimally adjusted photographs, made from the original files.\nFull dimensions and original framing retained. Small exposure, shadow and color corrections vary by photo, followed by very light sharpening. No generative AI, face modification, body reshaping, object removal or background replacement was used in these edits.\nOriginal files remain unchanged. This describes the editing process and does not guarantee any social platform labeling outcome.\n',encoding='utf-8')
(root/'minimal_edit_settings.json').write_text(json.dumps(records,indent=2))
zpath=root/'Photos_Minimal_Edits_12.zip'
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_STORED) as z:
 for p in sorted(out.iterdir()):z.write(p,p.name)
print(json.dumps({'count':len(records),'zip':str(zpath),'bytes':zpath.stat().st_size}))
