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
      metadataPath: '/data/brain-model.json',
      sourcePath: '/data/brain-source.json',
      meshMode: 'full',
    });
  });

  it('loads the full model metadata', async () => {
    const responses = [
      {
        model: {
          id: 'full',
          meshPath: '/models/whole-brain-full.stl',
          reductionPercent: 0,
          reductionRatio: 'Full resolution',
          reducedTriangleCount: 4000,
        },
      },
      {
        title: 'PittBrains3D Whole Brain',
        authors: ['Erika Fanselow', 'Gage Laporta'],
        sourceRepository:
          'https://github.com/PittBrains3D/PittBrains3D---Digital-3D-Models-for-Neuroanatomy-Instruction',
        licenseName: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => responses.shift(),
      })),
    );

    const bundle = await loadBrainModelBundle(createBrainModelDescriptor());

    expect(bundle.model).toMatchObject({
      id: 'full',
      meshPath: '/models/whole-brain-full.stl',
      reductionPercent: 0,
    });
    expect(bundle.source).toMatchObject({
      title: 'PittBrains3D Whole Brain',
      licenseName: 'CC BY-SA 4.0',
    });
  });

  it('fails when the full model metadata is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({}),
      })),
    );

    await expect(loadBrainModelBundle(createBrainModelDescriptor())).rejects.toThrow(
      'Missing model metadata',
    );
  });

  it('fails when the source attribution metadata is missing', async () => {
    const responses = [
      {
        model: {
          id: 'full',
          meshPath: '/models/whole-brain-full.stl',
        },
      },
      {},
    ];

    const fetch = vi.fn(async () => ({
      ok: true,
      json: async () => responses.shift(),
    }));

    vi.stubGlobal('fetch', fetch);

    await expect(loadBrainModelBundle(createBrainModelDescriptor())).rejects.toThrow(
      'Missing source attribution metadata',
    );
  });
});
