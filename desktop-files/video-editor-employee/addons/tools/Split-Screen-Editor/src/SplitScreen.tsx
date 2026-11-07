import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {Beat, Caption, EditPlan} from './types';
import {Visual} from './Visual';
import {fitType, reveal} from './motion';

const CaptionLine: React.FC<{caption: Caption; frame: number; y: number; accent: string}> = ({caption, frame, y, accent}) =>
  <div style={{position: 'absolute', top: y, left: 75, right: 100, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', zIndex: 20}}>
    <div style={{fontSize: fitType(caption.text, 62, 24, 43), lineHeight: 1.18, fontWeight: 850, textAlign: 'center', letterSpacing: -1.5, color: '#fff', padding: '14px 26px 17px', borderRadius: 18, background: '#111111ef', boxShadow: '0 5px 28px #00000022', textShadow: '0 3px 4px #00000066', maxWidth: '100%'}}>
      {caption.words?.length ? caption.words.map((word, i) => <React.Fragment key={i}><span style={{color: '#fff', textDecoration: frame >= word.startFrame && frame < word.endFrame ? 'underline' : 'none', textDecorationColor: accent, textDecorationThickness: 4, textUnderlineOffset: 8}}>{word.text.trim()}</span>{i < caption.words!.length - 1 ? ' ' : ''}</React.Fragment>) : caption.text}
    </div>
  </div>;

const GraphicPanel: React.FC<{plan: EditPlan; beat: Beat; height: number}> = ({plan, beat, height}) => {
  const frame = useCurrentFrame();
  const {fps} = plan;
  const b = {...plan.brand, ...beat.colors};
  if (beat.graphicMode === 'canvas') return <div style={{height, width: '100%', position: 'absolute', top: 0, background: b.background, overflow: 'hidden'}}>
    <Visual beat={beat} brand={b} frame={frame} fps={fps} width={plan.width} height={height}/>
  </div>;
  const full = beat.layout === 'graphic';
  const showHeadline = !!beat.headline && !(beat.visual.type === 'word' && (!beat.visual.word || beat.visual.word === beat.headline));
  const paddingTop = full ? 175 : 80;
  const titleSize = fitType(beat.headline, full ? 108 : 77, full ? 25 : 26, 49);
  const headerHeight = (beat.kicker ? 55 : 0) + (showHeadline ? (beat.headline.length > 28 ? titleSize * 2.12 : titleSize * 1.12) + 35 : 0);
  const visualHeight = height - paddingTop - headerHeight - (full ? 320 : 90);
  return <div style={{height, width: '100%', position: 'absolute', top: 0, background: b.background, color: b.text, overflow: 'hidden'}}>
    {beat.backdrop === 'grid' && <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${b.text}0a 1px, transparent 1px), linear-gradient(90deg, ${b.text}0a 1px, transparent 1px)`, backgroundSize: '54px 54px', maskImage: 'linear-gradient(135deg, #000 0%, #00000025 55%, #000 100%)'}} />}
    {beat.backdrop === 'soft' && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${b.accent}22 0%, ${b.background}00 65%)`}} />}
    <div style={{position: 'relative', padding: `${paddingTop}px 100px 0 76px`}}>
      {beat.kicker && <div style={{fontSize: 23, lineHeight: 1.3, marginBottom: 25, fontWeight: 750, letterSpacing: 3, textTransform: 'uppercase', color: b.text, ...reveal(frame, fps)}}>{beat.kicker}</div>}
      {showHeadline && <div style={{fontSize: titleSize, lineHeight: 1.04, letterSpacing: -3.2, fontWeight: 830, marginBottom: 35, ...reveal(frame, fps)}}>{beat.headline}</div>}
      <div style={{height: Math.max(visualHeight, 160)}}><Visual beat={beat} brand={b} frame={frame} fps={fps} width={904} height={Math.max(visualHeight, 160)}/></div>
    </div>
    {b.name && <div style={{position: 'absolute', right: 100, bottom: full ? 105 : 33, fontSize: 19, letterSpacing: 2.8, fontWeight: 700, color: b.muted, opacity: .7}}>{b.name.toUpperCase()}</div>}
  </div>;
};

export const SplitScreen: React.FC<{plan: EditPlan}> = ({plan}) => {
  const frame = useCurrentFrame();
  const beat = plan.beats.find(b => frame >= b.from && frame < b.from + b.durationInFrames) ?? plan.beats[plan.beats.length - 1];
  const graphicHeight = beat.layout === 'split' ? Math.round(plan.height * (beat.splitRatio ?? .5)) : beat.layout === 'graphic' ? plan.height : 0;
  const videoTop = beat.layout === 'split' ? graphicHeight : 0;
  const focal = beat.focalPoint ?? {x: .5, y: .5};
  let cursor = 0;
  const caption = plan.captions.find(c => frame >= c.startFrame && frame < c.endFrame);
  return <AbsoluteFill style={{fontFamily: 'Inter, Arial, sans-serif', backgroundColor: plan.brand.background}}>
    <div style={{position: 'absolute', top: videoTop, left: 0, right: 0, height: plan.height - videoTop, overflow: 'hidden'}}>
      {plan.edit.cuts.map((cut, i) => {
        const from = cursor; const duration = cut.endFrame - cut.startFrame; cursor += duration;
        return <Sequence key={i} from={from} durationInFrames={duration} name={`Source ${i + 1}`} layout="none">
          <OffthreadVideo src={staticFile(plan.source.path)} trimBefore={cut.startFrame} durationInFrames={duration} muted={!plan.source.hasAudio} style={{width: '100%', height: '100%', objectFit: beat.mediaFit ?? 'cover', objectPosition: `${focal.x * 100}% ${focal.y * 100}%`}} />
        </Sequence>;
      })}
      {beat.layout !== 'graphic' && <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(0deg, #00000050 0%, transparent 28%, transparent 80%, #00000018 100%)'}} />}
    </div>
    {plan.beats.filter(b => b.layout !== 'speaker').map(b => <Sequence key={b.id} from={b.from} durationInFrames={b.durationInFrames} name={b.id} layout="none"><GraphicPanel plan={plan} beat={b} height={b.layout === 'graphic' ? plan.height : Math.round(plan.height * (b.splitRatio ?? .5))} /></Sequence>)}
    {caption && <CaptionLine caption={caption} frame={frame} y={beat.captionY !== undefined ? beat.captionY * plan.height : beat.layout === 'split' ? graphicHeight : plan.height - 360} accent={beat.colors?.accent ?? plan.brand.accent}/>}
    {plan.audio?.music && <Audio src={staticFile(plan.audio.music.src)} loopVolumeCurveBehavior="extend" volume={(f) => {
      const total = plan.edit.cuts.reduce((sum, c) => sum + c.endFrame - c.startFrame, 0);
      const fade = Math.min(1, f / 15, (total - 1 - f) / 20);
      return plan.audio!.music!.volume * Math.max(0, fade);
    }} loop/>}
    {plan.audio?.effects?.map((effect, i) => <Sequence key={`sfx-${i}`} from={effect.atFrame} layout="none"><Audio src={staticFile(effect.src)} volume={effect.volume}/></Sequence>)}
  </AbsoluteFill>;
};
