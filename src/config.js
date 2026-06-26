export const APP_NAME = 'Brain3D';
export const VIEWER_PORT = 4317;
export const MODEL_PATH = '/models/whole-brain-lite.stl';
export const MODEL_METADATA_PATH = '/data/brain-model.json';
export const SOURCE_METADATA_PATH = '/data/brain-source.json';

export const VIEWER_SETTINGS = Object.freeze({
  background: '#041018',
  minDistance: 140,
  maxDistance: 420,
  polarAngleMin: 0.25,
  polarAngleMax: Math.PI - 0.25,
});

export const HERO_METRICS = Object.freeze([
  { label: 'Input', value: 'Mouse + Touch' },
  { label: 'Ready For', value: 'Pick / Long Press' },
  { label: 'Source', value: 'PittBrains3D' },
]);

