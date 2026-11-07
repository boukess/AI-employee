import React from 'react';
import type {CustomRenderer} from './Composition';

// Replace this per job with a new content-specific visual metaphor.
// Available coordinates: 1080x1920 for full; 1080x950 for top panel.
// All motion must derive from useCurrentFrame(), never CSS transitions or timers.
// This intentionally throws until an actual custom scene is authored.
export const CustomScene:CustomRenderer=({scene})=>{
  throw new Error(`Author motion/Scenes.tsx for custom scene: ${scene.id}`);
};
