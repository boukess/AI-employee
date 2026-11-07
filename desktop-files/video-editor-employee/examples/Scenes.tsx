import React from 'react';
import {Img,staticFile,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import type {CustomRenderer} from '../src/Composition';
import {Panel,Icon,Cursor} from '../src/corpus/Elements';
import {SourceMedia} from '../src/corpus/SourceMedia';
const A='assets/example-editor/';
const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const clay='#c87960',ink='#171716';
const Claude:React.FC<{x:number;y:number;w?:number}>=({x,y,w=280})=><div style={{position:'absolute',left:x,top:y,width:w,textAlign:'center'}}><Img src={staticFile(A+'claude-official.svg')} style={{width:w,height:w*125/573}}/><div style={{fontFamily:'Georgia,serif',fontSize:w*.15,marginTop:5}}>Code</div></div>;
const Resolve:React.FC<{x:number;y:number;size?:number;label?:boolean}>=({x,y,size=148,label=true})=><div style={{position:'absolute',left:x,top:y,width:size,textAlign:'center'}}><Img src={staticFile(A+'resolve-icon.png')} style={{width:size,height:size}}/>{label&&<div style={{fontSize:29,whiteSpace:'nowrap',marginLeft:-40,marginRight:-40,marginTop:8}}>DaVinci Resolve</div>}</div>;
const Check:React.FC<{size?:number}>=({size=30})=><svg width={size} height={size} viewBox="0 0 40 40" fill="none"><path d="m8 21 8 8 17-19" stroke="#68968d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const CustomScene:CustomRenderer=({scene})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const enter=(d=0)=>spring({frame:f-d,fps,config:{damping:26,stiffness:160}});
 const wire=(x1:number,y:number,x2:number,progress:number)=><svg style={{position:'absolute',inset:0}} width="1080" height="1150"><path d={`M${x1} ${y} H${x2}`} stroke="#dedbd6" strokeWidth="3"/><path d={`M${x1} ${y} H${x1+(x2-x1)*progress}`} stroke={clay} strokeWidth="3"/><circle cx={x1+(x2-x1)*progress} cy={y} r="6" fill={clay}/></svg>;
 const file=(x:number,y:number,label:string,scale=1)=><Panel style={{left:x,top:y,width:230,height:315,transform:`scale(${scale})`}}><div style={{width:226,height:235,background:'#eeeae2',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="doc" size={85}/></div><div style={{height:76,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,gap:12}}><Icon name="doc" size={27}/>{label}</div></Panel>;
 const mcpFlow=(y:number)=> <>
  <Panel style={{left:85,top:y,width:300,height:225}}><Claude x={45} y={51} w={210}/></Panel>
  <Panel style={{left:448,top:y+50,width:184,height:125,display:'flex',alignItems:'center',justifyContent:'center',borderColor:'#dbc6bb',fontSize:48,fontFamily:'Georgia,serif'}}>MCP</Panel>
  <Panel style={{left:695,top:y,width:300,height:225}}><Resolve x={95} y={20} size={110}/></Panel>
  {wire(388,y+113,441,ramp(f,4,25))}{wire(637,y+113,687,ramp(f,28,48))}
 </>;
 return <>
  {scene.id==='hook'&&<>
   <Panel style={{left:110,top:275,width:860,height:460,background:'#fbf8f3'}}>
    <Claude x={70} y={70} w={300}/><Resolve x={571} y={35} size={180}/>
    <div style={{position:'absolute',left:416,top:124,fontFamily:'Georgia,serif',fontSize:52,color:'#aaa297'}}>+</div>
    <div style={{position:'absolute',left:94,right:94,top:300,height:70,border:'1px solid #dfdcd5',borderRadius:15,background:'white',display:'flex',alignItems:'center',padding:'0 23px',gap:9}}>{[130,90,180,85,100].map((w,i)=><div key={i} style={{height:32,width:w,background:i%2?'#c4d6d0':'#dec9bb',borderRadius:5,transform:`scaleX(${ramp(f,5+i*6,18+i*6)})`,transformOrigin:'left'}}/>)}<div style={{position:'absolute',left:20+ramp(f,25,100)*640,top:-8,bottom:-8,width:2,background:clay}}/></div>
   </Panel>
  </>}
  {scene.id==='resolve-intro'&&<>
   <Resolve x={470} y={225} size={140}/>
   <SourceMedia path={A+'resolve-edit.jpg'} style={{left:65,top:480,width:950,height:526,transform:`scale(${1+.035*ramp(f,0,75)})`}}/>
  </>}
  {scene.id==='manual'&&<>
   <Resolve x={479} y={160} size={122}/>
   <SourceMedia path={A+'resolve-timeline.jpg'} style={{left:90,top:365,width:900,height:445,transform:`scale(${1+.025*ramp(f,0,130)})`}}/>
  </>}
  {scene.id==='connect'&&<>
   {mcpFlow(400)}
   <div style={{position:'absolute',top:710,left:200,right:200,textAlign:'center',fontFamily:'Georgia,serif',fontSize:41,opacity:ramp(f,45,61)}}>Connect your AI editor</div>
  </>}
  {scene.id==='your-video'&&<>
   <Claude x={370} y={200} w={340}/>
   <div style={{transform:`translateX(${(1-enter())*-25}px)`}}>{file(170,410,'Your video')}</div>
   {wire(428,570,624,ramp(f,15,50))}
   <Panel style={{left:655,top:423,width:255,height:287,borderColor:'#d5ded9'}}><Resolve x={65} y={28} size={125} label={false}/><div style={{position:'absolute',left:25,right:25,bottom:45,display:'flex',gap:14,justifyContent:'center',alignItems:'center',fontSize:26,opacity:ramp(f,40,58)}}><Check/>Ready to edit</div></Panel>
  </>}
  {scene.id==='automatic'&&<>
   <Resolve x={468} y={200} size={144}/>
   <SourceMedia type="video" path={A+'resolve-trim.mp4'} trimBefore={30} style={{left:65,top:525,width:950,height:302}}/>
   <div style={{position:'absolute',left:335,top:915,width:410,display:'flex',gap:18,alignItems:'center',justifyContent:'center',fontSize:43,fontFamily:'Georgia,serif',opacity:ramp(f,22,38)}}><Check size={42}/>Editing for you</div>
  </>}
  {scene.id==='color'&&<>
   <Resolve x={482} y={168} size={116}/>
   <SourceMedia path={A+'resolve-color-wheels.jpg'} style={{left:80,top:338,width:920,height:495}} mediaStyle={{objectFit:'cover',objectPosition:'50% 63%',transform:`scale(${1+.025*ramp(f,0,58)})`}}/>
  </>}
  {scene.id==='trim'&&<>
   <Resolve x={482} y={168} size={116}/>
   <SourceMedia type="video" path={A+'resolve-trim.mp4'} trimBefore={150} style={{left:65,top:425,width:950,height:302}}/>
  </>}
  {scene.id==='motion'&&<>
   <Resolve x={478} y={200} size={124}/>
   <Panel style={{left:120,top:480,width:840,height:470,opacity:1-ramp(f,58,74)}}>
    <div style={{position:'absolute',left:55,right:55,top:145,textAlign:'center',fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:87,letterSpacing:-3,transform:`translateY(${(1-enter())*30}px)`,opacity:enter()}}>Make it move.</div>
    <svg width="840" height="470" style={{position:'absolute'}}><rect x="68" y="113" width="700" height="173" rx="7" fill="none" stroke={clay} strokeWidth="2.5" strokeDasharray="1746" strokeDashoffset={1746*(1-ramp(f,5,37))}/><path d="M80 370 H760" stroke="#ddd9d2" strokeWidth="2"/>{[125,330,550,710].map((x,i)=><rect key={x} x={x} y={361} width="17" height="17" fill={f>i*7+8?clay:'#e6e2dc'} transform={`rotate(45 ${x+8.5} 369.5)`}/>)}</svg>
   </Panel>
   <SourceMedia path={A+'resolve-titles.jpg'} style={{left:80,top:470,width:920,height:452,opacity:ramp(f,58,74)}}/>
  </>}
  {scene.id==='prompt'&&<>
   <SourceMedia path={A+'claude-terminal.webp'} style={{left:225,top:185,width:630,height:630}}/>
   <Panel style={{left:392,top:644,width:600,height:155,padding:'28px 35px',fontSize:37,lineHeight:1.15,transform:`translateY(${(1-enter(20))*15}px)`,opacity:enter(20)}}>Edit this video for me.<span style={{display:'inline-block',width:2,height:35,background:clay,verticalAlign:'middle',marginLeft:8,opacity:f%24<13?1:0}}/></Panel>
  </>}
  {scene.id==='pipeline'&&<>
   {mcpFlow(370)}
   <div style={{position:'absolute',left:539,top:610,width:2,height:140*ramp(f,0,24),background:'#d9c6ba'}}/>
   <Panel style={{left:345,top:760,width:390,height:190,display:'flex',gap:21,alignItems:'center',justifyContent:'center',opacity:enter(12)}}><Icon name="doc" size={80}/><div style={{fontSize:36,lineHeight:1.4}}>Finished video<br/><span style={{fontSize:28,color:'#6d8f86'}}>Ready to export</span></div></Panel>
  </>}
  {scene.id==='comment'&&<>
   <Panel style={{left:140,top:330,width:800,height:385,transform:`translateY(${(1-enter())*18}px)`}}>
    <div style={{position:'absolute',left:52,top:55}}><Icon name="comment" size={82} color={clay}/></div>
    <div style={{position:'absolute',left:160,top:64,fontSize:40,fontFamily:'Georgia,serif'}}>Comment</div>
    <div style={{position:'absolute',left:55,right:55,top:171,height:145,border:'2px solid #e0d9d0',borderRadius:20,display:'flex',alignItems:'center',padding:'0 38px',fontFamily:'CorpusSans,sans-serif',fontWeight:800,fontSize:80,letterSpacing:-2}}>{'VIDEO'.slice(0,Math.min(5,Math.max(0,Math.floor((f-4)/5))))}<span style={{height:74,width:3,background:clay,marginLeft:9,opacity:f%28<16?1:0}}/><span style={{marginLeft:'auto',fontSize:49,color:clay,opacity:ramp(f,26,38)}}>↑</span></div>
   </Panel>
  </>}
  {scene.id==='guide'&&<>
   <Panel style={{left:270,top:265,width:540,height:535,transform:`translateY(${(1-enter())*20}px)`}}>
    <div style={{position:'absolute',left:42,top:37}}><Icon name="doc" size={59} color={clay}/></div>
    <div style={{position:'absolute',left:125,top:50,fontFamily:'Georgia,serif',fontSize:48}}>Setup guide</div>
    {['Connect','Customize','Export'].map((t,i)=><div key={t} style={{position:'absolute',left:50,right:50,top:161+i*99,paddingBottom:28,borderBottom:i<2?'1px solid #e8e5df':'none',display:'flex',alignItems:'center',gap:24,fontSize:37,opacity:enter(i*6)}}><Check size={36}/>{t}</div>)}
   </Panel>
  </>}
 </>;
};
