import { describe, expect, it } from 'vitest';
import {
  MODEL_METADATA_PATH,
  SOURCE_METADATA_PATH,
  TOUCH_HOLD_DELAY_MS,
  VIEWER_SETTINGS,
  VIEWER_PORT,
} from '../../src/config.js';

describe('config', () => {
  it('keeps the proxy target port stable', () => {
    expect(VIEWER_PORT).toBe(4317);
  });

  it('keeps the single-model metadata path stable', () => {
    expect(MODEL_METADATA_PATH).toBe('/data/brain-model.json');
  });

  it('keeps the source metadata path stable', () => {
    expect(SOURCE_METADATA_PATH).toBe('/data/brain-source.json');
  });

  it('keeps touch hold delay positive', () => {
    expect(TOUCH_HOLD_DELAY_MS).toBeGreaterThan(0);
  });

  it('keeps zoom boundaries sensible', () => {
    expect(VIEWER_SETTINGS.minDistance).toBeLessThan(VIEWER_SETTINGS.maxDistance);
  });
});
