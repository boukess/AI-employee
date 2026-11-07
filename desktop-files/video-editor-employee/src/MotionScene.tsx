import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {CustomRenderer} from './Composition';
export type Scene={id:string;from:number;duration:number;kind:'flow'|'orbit'|'type'|'custom';layout:'full'|'top'|'overlay';title:string;theme?:string;[key:string]:unknown};
export type Palette={bg:string;ink:string;accent:string;muted:string;line:string};
const corpus:Palette={bg:'#fdfdfd',ink:'#080808',accent:'#c87960',muted:'#8b8b8b',line:'#e4e4e4'};
export const MotionScene:React.FC<{scene:Scene;CustomScene?:CustomRenderer}>=({scene,CustomScene})=>{
 const bg=scene.theme==='corpus-cream'?'#fcf0e5':corpus.bg;
 return <AbsoluteFill style={{background:scene.layout==='full'?bg:'transparent',color:corpus.ink,fontFamily:'Arial, sans-serif'}}>
  {CustomScene?<CustomScene scene={scene} palette={{...corpus,bg}}/>:null}
 </AbsoluteFill>;
};
