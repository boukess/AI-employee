import {registerRoot} from 'remotion';
import {createEditor} from './Composition';
import {CustomScene} from './CustomScenes';
registerRoot(createEditor(CustomScene));
