import React from 'react';
import {Img,OffthreadVideo,staticFile} from 'remotion';

/** Real sourced media stays intact; scene code provides framing and timed emphasis. */
export const SourceMedia:React.FC<{
 path:string;type?:'image'|'video';style?:React.CSSProperties;
 mediaStyle?:React.CSSProperties;trimBefore?:number;
}>=({path,type='image',style,mediaStyle,trimBefore=0})=>{
 const shared:React.CSSProperties={width:'100%',height:'100%',objectFit:'contain',display:'block',...mediaStyle};
 return <div style={{position:'absolute',overflow:'hidden',borderRadius:28,border:'2px solid #e8e5df',background:'#faf9f5',boxShadow:'0 13px 30px #00000012',...style}}>
  {type==='video'?<OffthreadVideo src={staticFile(path)} trimBefore={trimBefore} muted style={shared}/>:<Img src={staticFile(path)} style={shared}/>}
 </div>;
};
