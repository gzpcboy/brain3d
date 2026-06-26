import { describe, expect, it } from 'vitest';
import { HERO_METRICS, VIEWER_SETTINGS, VIEWER_PORT } from '../../src/config.js';

describe('config', () => {
  it('keeps the proxy target port stable', () => {
    expect(VIEWER_PORT).toBe(4317);
  });

  it('exposes core interaction metrics for the hero UI', () => {
    expect(HERO_METRICS).toHaveLength(3);
    expect(HERO_METRICS[0].label).toBe('Input');
  });

  it('keeps zoom boundaries sensible', () => {
    expect(VIEWER_SETTINGS.minDistance).toBeLessThan(VIEWER_SETTINGS.maxDistance);
  });
});

