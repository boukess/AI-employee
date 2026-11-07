import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Composition,Sequence,useCurrentFrame,staticFile,delayRender,continueRender} from 'remotion';
import {MotionScene,Scene,Palette} from './MotionScene';
export type CustomRenderer=React.FC<{scene:Scene;palette:Palette}>;
type Word={text:string;start:number;end:number};
type Cue={start:number;end:number;words:Word[]};
export type Props={fps:number;width:number;height:number;durationInFrames:number;scenes:Scene[];captionCues:Cue[]};
const defaults:Props={fps:30,width:1080,height:1920,durationInFrames:180,captionCues:[],scenes:[{id:'preview',from:0,duration:180,kind:'custom',layout:'full',title:'',theme:'corpus-white'}]};
const Fonts:React.FC=()=>{
 const [handle]=useState(()=>delayRender('Load corpus caption font'));
 useEffect(()=>{const font=new FontFace('CorpusSans',`url(${staticFile('fonts/Poppins-ExtraBold.ttf')})`,{weight:'800'});font.load().then(f=>{document.fonts.add(f);continueRender(handle)}).catch(e=>{throw e});},[handle]);return null;
};
const Captions:React.FC<{cues:Cue[];scenes:Scene[]}>=({cues,scenes})=>{
 const f=useCurrentFrame(),cue=cues.find(c=>f>=c.start&&f<c.end);if(!cue)return null;
 const scene=scenes.find(s=>f>=s.from&&f<s.from+s.duration);
 const serif=scene?.layout==='full'||(scene?.id==='comment'&&cue.words.some(w=>/comment|down below/i.test(w.text)));
 const text=cue.words.map(w=>w.text).join(' ').replace(/[.,!?]+$/,'');
 const size=serif?Math.min(112,1250/Math.max(10,text.length)*1.15):Math.min(82,1250/Math.max(16,text.length));
 return <div style={{position:'absolute',top:scene?.layout==='full'?1200:870,left:50,width:980,height:125,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',color:'#050505',fontFamily:serif?'Times New Roman, serif':'CorpusSans, sans-serif',fontSize:size,fontWeight:serif?700:800,fontStyle:serif?'italic':'normal',letterSpacing:serif?-3.5:-3.4,wordSpacing:serif?0:2.5,lineHeight:1,whiteSpace:'nowrap'}}>{serif?text.toUpperCase():text}</div>;
};
export function createEditor(CustomScene?:CustomRenderer){
 const Edit:React.FC<Props>=({scenes,captionCues})=><AbsoluteFill><Fonts/>{scenes.map(scene=><Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}><MotionScene scene={scene} CustomScene={CustomScene}/></Sequence>)}<Captions cues={captionCues} scenes={scenes}/></AbsoluteFill>;
 return ()=> <Composition id="ShortForm" component={Edit} width={1080} height={1920} fps={30} durationInFrames={180} defaultProps={defaults} calculateMetadata={({props})=>({durationInFrames:props.durationInFrames,fps:props.fps,width:props.width,height:props.height})}/>;
}
