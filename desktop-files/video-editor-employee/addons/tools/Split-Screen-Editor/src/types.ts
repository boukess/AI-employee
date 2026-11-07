export type Brand = {name: string; accent: string; background: string; surface: string; text: string; muted: string};
export type Visual =
  | {type: 'word'; word?: string; subtext?: string}
  | {type: 'steps'; items: Array<string | {title: string; detail?: string}>}
  | {type: 'comparison'; left: {title: string; items: string[]}; right: {title: string; items: string[]}}
  | {type: 'diagram'; nodes: Array<{id: string; label: string; x?: number; y?: number}>; edges: Array<{from: string; to: string; label?: string}>}
  | {type: 'bars'; items: Array<{label: string; value: number}>; max?: number; unit?: string; sourceLabel?: string}
  | {type: 'checklist'; items: Array<string | {text: string; checked?: boolean}>}
  | {type: 'quote'; text: string; attribution?: string}
  | {type: 'image'; src: string; alt?: string; caption?: string}
  | {type: 'custom'; component: string; props?: Record<string, unknown>};
export type Beat = {
  id: string; from: number; durationInFrames: number;
  layout: 'split' | 'speaker' | 'graphic'; splitRatio?: number;
  focalPoint?: {x: number; y: number};
  mediaFit?: 'cover' | 'contain'; colors?: Partial<Omit<Brand, 'name'>>; captionY?: number;
  graphicMode?: 'framed' | 'canvas'; backdrop?: 'plain' | 'grid' | 'soft';
  headline: string; kicker?: string; visual: Visual; rationale: string;
};
export type Caption = {startFrame: number; endFrame: number; text: string; words?: Array<{startFrame: number; endFrame: number; text: string}>};
export type EditPlan = {
  version: 1; title: string; fps: number; width: number; height: number;
  source: {path: string; durationInFrames: number; width: number; height: number; hasAudio: boolean};
  brand: Brand; edit: {cuts: Array<{startFrame: number; endFrame: number; reason: string}>};
  beats: Beat[]; captions: Caption[]; notes?: string[];
  audio?: {music?: {src: string; volume: number}; effects?: Array<{src: string; atFrame: number; volume: number}>};
};
export type VisualProps = {beat: Beat; brand: Brand; frame: number; fps: number; width: number; height: number};
