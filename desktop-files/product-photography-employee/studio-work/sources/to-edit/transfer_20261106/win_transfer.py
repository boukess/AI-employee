import os,sys,runpy
from pathlib import Path
if os.name=='nt':
 def sx(p,n,v,*a):
  with open(str(p)+':'+n,'wb') as f:f.write(v)
 def gx(p,n):
  with open(str(p)+':'+n,'rb') as f:return f.read()
 os.setxattr=sx;os.getxattr=gx
helper=sys.argv.pop(1)
runpy.run_path(helper,run_name='__main__')
