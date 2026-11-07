from PIL import Image,ImageOps,ImageEnhance,ImageFilter,ImageDraw,ImageChops
from pathlib import Path
import math,zipfile,json
root=Path(r'C:\Users\blood\AI Product Photography Employee\studio-work\sources\to-edit');src=root/'03_New_Originals';out=root/'04_Volleyball_Edits';out.mkdir(exist_ok=True)
exposures={'IMG_0002.JPG':.28,'IMG_0004.JPG':.25,'IMG_0005.JPG':.18,'IMG_0006.JPG':.25,'IMG_0007.JPG':.23,'IMG_0008.JPG':.30,'IMG_0015.JPG':.20}
polys={
'IMG_0006.JPG':[(.373,.225),(.397,.223),(.407,.26),(.4,.31),(.418,.32),(.445,.33),(.472,.35),(.474,.39),(.469,.418),(.479,.449),(.469,.478),(.46,.492),(.467,.55),(.497,.63),(.52,.686),(.565,.716),(.575,.741),(.542,.756),(.502,.745),(.469,.718),(.454,.697),(.448,.744),(.468,.757),(.47,.778),(.441,.789),(.408,.779),(.387,.751),(.372,.693),(.355,.626),(.345,.565),(.324,.503),(.324,.47),(.341,.44),(.356,.41),(.365,.363),(.361,.317),(.367,.28)],
'IMG_0008.JPG':[(.352,.302),(.378,.29),(.387,.308),(.375,.337),(.356,.367),(.348,.398),(.35,.421),(.373,.448),(.397,.46),(.414,.442),(.418,.421),(.434,.409),(.449,.419),(.448,.446),(.426,.467),(.402,.497),(.374,.503),(.331,.481),(.312,.495),(.31,.529),(.33,.569),(.328,.617),(.308,.678),(.315,.705),(.31,.723),(.281,.729),(.266,.712),(.271,.681),(.274,.62),(.277,.597),(.255,.574),(.25,.609),(.243,.663),(.252,.7),(.268,.721),(.263,.748),(.239,.749),(.213,.728),(.203,.704),(.209,.665),(.217,.62),(.207,.579),(.195,.543),(.191,.51),(.199,.473),(.217,.444),(.231,.412),(.242,.399),(.272,.395),(.295,.391),(.31,.367),(.329,.337)]
}
def mask_for(name,size):
 w,h=size;m=Image.new('L',size);d=ImageDraw.Draw(m);d.polygon([(round(x*w),round(y*h)) for x,y in polys[name]],fill=255)
 # Protect volleyball and all the moving hand edges too.
 if name=='IMG_0006.JPG':box=(.366,.171,.47,.237)
 else:box=(.377,.166,.477,.244)
 d.ellipse(tuple(round(v*(w if j%2==0 else h)) for j,v in enumerate(box)),fill=255)
 return m.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(4))
def motion(im,length=12):
 w,h=im.size;pad=length+2;p=Image.new('RGB',(w+pad*2,h));p.paste(im,(pad,0));p.paste(im.crop((0,0,1,h)).resize((pad,h)),(0,0));p.paste(im.crop((w-1,0,w,h)).resize((pad,h)),(w+pad,0)); acc=None
 for k,dx in enumerate(range(-length,length+1,2)):
  shifted=p.crop((pad+dx,0,pad+dx+w,h));acc=shifted if acc is None else Image.blend(acc,shifted,1/(k+1))
 return acc
review=[];exported=[]
for name,ev in exposures.items():
 raw=Image.open(src/name);im=ImageOps.exif_transpose(raw).convert('RGB');before=im.copy();exif=raw.getexif();exif[274]=1
 table=[]
 for i in range(256):
  x=i/255;g=2**ev;y=x*g/(1+(g-1)*x);y+=.055*math.sqrt(x)*(1-x)**3;table.append(round(max(0,min(1,y))*255))
 im=im.point(table*3);im=ImageEnhance.Contrast(im).enhance(1.035);im=ImageEnhance.Color(im).enhance(1.025);im=im.filter(ImageFilter.UnsharpMask(radius=.85,percent=42,threshold=4))
 options={'quality':95,'subsampling':0,'optimize':True,'exif':exif.tobytes()}
 if raw.info.get('icc_profile'):options['icc_profile']=raw.info['icc_profile']
 clean=out/(Path(name).stem+'_clean.jpg');im.save(clean,**options);exported.append(clean)
 final=im
 if name in polys:
  m=mask_for(name,im.size);final=Image.composite(im,motion(im),m);mp=out/(Path(name).stem+'_background_motion.jpg');final.save(mp,**options);exported.append(mp)
 a=before.copy();b=final.copy();a.thumbnail((225,335));b.thumbnail((225,335));t=Image.new('RGB',(470,370),(25,25,25));t.paste(a,(0,0));t.paste(b,(240,0));d=ImageDraw.Draw(t);d.text((4,341),name+' | original / '+('motion' if name in polys else 'clean'),fill='white');review.append(t)
 print(name,'clean + motion' if name in polys else 'clean',flush=True)
for p in exported:
 with Image.open(p) as check:check.load()
sheet=Image.new('RGB',(1410,1110),(25,25,25))
for i,t in enumerate(review):sheet.paste(t,((i%3)*470,(i//3)*370))
sheet.save(out/'Before_After_Review.jpg',quality=94)
(out/'README.txt').write_text('Seven volleyball photos cleaned with conventional exposure, contrast, color and light sharpening. Original dimensions retained. No generated image content, face changes or body changes.\nIMG_0006 and IMG_0008 also include optional subtle horizontal background-motion versions with the player and ball protected by feathered masks. Clean versions are supplied for every shot.\nExisting camera/subject blur cannot be fully recovered. The CR2 file duplicates IMG_0008; edits in this set use the uploaded JPEGs and do not claim RAW development. Original files remain unchanged.\n',encoding='utf-8')
zpath=root/'Volleyball_Clean_and_Motion_Edits.zip'
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_STORED) as z:
 for p in sorted(out.iterdir()):z.write(p,p.name)
print(json.dumps({'photos':7,'exports':len(exported),'zip_bytes':zpath.stat().st_size}))
