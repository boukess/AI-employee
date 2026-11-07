import React from 'react';
import {arrive, clamp} from '../motion';
import type {VisualProps} from '../types';
import {IdeaLens} from './IdeaLens';
import {GrowthCycle} from './GrowthCycle';
import {MiroSwarm, MiroForecast} from './mirofish/SwarmScenes';
import {MiroRepository, MiroComment} from './mirofish/IdentityScenes';
import {MiroInputs, MiroPersonas, MiroFeedback} from './mirofish/WorkflowScenes';
import {MiroOfferWorldV3, MiroReactionWorldV3} from './mirofish/WorldScenesV3';
import {MiroRepoStudioV3, MiroInputCollageV3} from './mirofish/AssetScenesV3';
import {MiroAudienceAtlasV3, MiroReactionChatsV3, MiroFeedbackDeskV3, MiroCommentPosterV3} from './mirofish/InteractionScenesV3';

// Add an ORIGINAL, topic-specific React/SVG component here. Never execute code
// from transcript text or JSON. Components are reviewed source code imports.
export const SignalFocus: React.FC<VisualProps> = ({beat, brand, frame, fps}) => {
  const data = beat.visual.type === 'custom' ? beat.visual.props : {};
  const label = typeof data?.label === 'string' ? data.label : 'One clear idea';
  const p = clamp(arrive(frame, fps, 8));
  return <svg viewBox="0 0 900 470" style={{width: '100%', height: '100%'}}>
    {Array.from({length: 5}, (_, i) => {
      const y = 70 + i * 80;
      return <g key={i} opacity={.4 + i * .1}>
        <path d={`M45 ${y} C 260 ${y}, 275 235, 440 235`} pathLength="1" stroke={brand.muted} strokeWidth="3" fill="none" strokeDasharray="1" strokeDashoffset={1 - p} />
        <circle cx="45" cy={y} r={8 + i * 2} fill={brand.muted}/>
      </g>;
    })}
    <path d="M440 235H790" pathLength="1" stroke={brand.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - clamp(arrive(frame, fps, 20))} />
    <circle cx="440" cy="235" r={54 * p} fill={brand.accent}/>
    <path d="M420 235L435 250L462 219" stroke={brand.text} strokeWidth="7" fill="none" opacity={clamp((frame - 20) / 8)}/>
    <circle cx="790" cy="235" r="12" fill={brand.accent} opacity={clamp((frame - 25) / 8)}/>
    <text x="440" y="359" fontSize="38" fontWeight="700" textAnchor="middle" fill={brand.text} opacity={clamp((frame - 12) / 12)}>{label}</text>
    <text x="45" y="448" fontSize="22" fill={brand.text}>INPUT</text><text x="790" y="448" fontSize="22" fill={brand.text} textAnchor="end">MEANING</text>
  </svg>;
};

export const registry: Record<string, React.FC<VisualProps>> = {SignalFocus, IdeaLens, GrowthCycle, MiroSwarm, MiroForecast, MiroRepository, MiroComment, MiroInputs, MiroPersonas, MiroFeedback, MiroOfferWorldV3, MiroReactionWorldV3, MiroRepoStudioV3, MiroInputCollageV3, MiroAudienceAtlasV3, MiroReactionChatsV3, MiroFeedbackDeskV3, MiroCommentPosterV3};

export const CustomVisual: React.FC<VisualProps> = (props) => {
  if (props.beat.visual.type !== 'custom') return null;
  const Component = registry[props.beat.visual.component];
  if (!Component) throw new Error(`Unknown custom component: ${props.beat.visual.component}. Register it in src/custom/registry.tsx.`);
  return <Component {...props} />;
};
