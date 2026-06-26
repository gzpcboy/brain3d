export const APP_NAME = 'Brain3D';
export const VIEWER_PORT = 4317;
export const MODEL_METADATA_PATH = '/data/brain-model.json';
export const SOURCE_METADATA_PATH = '/data/brain-source.json';
export const TOUCH_HOLD_DELAY_MS = 260;

export const VIEWER_SETTINGS = Object.freeze({
  background: '#041018',
  initialCameraZ: 285,
  minDistance: 140,
  maxDistance: 420,
  polarAngleMin: 0.25,
  polarAngleMax: Math.PI - 0.25,
});
