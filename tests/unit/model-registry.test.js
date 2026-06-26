import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBrainModelDescriptor,
  loadBrainModelBundle,
} from '../../src/brain/model-registry.js';

describe('model registry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates the expected descriptor', () => {
    expect(createBrainModelDescriptor()).toMatchObject({
      id: 'whole-brain',
      meshPath: '/models/whole-brain-lite.stl',
    });
  });

  it('loads metadata and source data together', async () => {
    const responses = [
      { reducedTriangleCount: 1000 },
      { title: 'PittBrains3D Whole Brain' },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => responses.shift(),
      })),
    );

    const bundle = await loadBrainModelBundle(createBrainModelDescriptor());

    expect(bundle.metadata.reducedTriangleCount).toBe(1000);
    expect(bundle.source.title).toBe('PittBrains3D Whole Brain');
  });
});

