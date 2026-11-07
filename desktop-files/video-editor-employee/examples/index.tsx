import {registerRoot} from 'remotion';
import {createEditor} from '../src/Composition';
import {CustomScene} from './Scenes';
registerRoot(createEditor(CustomScene));
