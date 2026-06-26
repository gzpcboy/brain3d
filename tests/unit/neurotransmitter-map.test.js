import { describe, expect, it } from 'vitest';
import { describeBrainSpot } from '../../src/brain/neurotransmitter-map.js';

const extents = { x: 90, y: 90, z: 90 };

describe('describeBrainSpot', () => {
  it('classifies an anterior point as a frontal cortical zone', () => {
    expect(describeBrainSpot({ x: -22, y: 18, z: 62 }, extents)).toMatchObject({
      regionId: 'frontal',
      title: 'Left Frontal cortical zone',
    });
  });

  it('classifies a lower lateral point as a temporal cortical zone', () => {
    expect(describeBrainSpot({ x: 64, y: -6, z: 8 }, extents)).toMatchObject({
      regionId: 'temporal',
      title: 'Right Temporal cortical zone',
    });
  });

  it('classifies a lower midline point as a brainstem zone', () => {
    expect(describeBrainSpot({ x: 5, y: -70, z: 10 }, extents)).toMatchObject({
      regionId: 'brainstem',
      title: 'Midline Brainstem / lower midline zone',
    });
  });

  it('includes neurotransmitter descriptions for the selected region', () => {
    expect(describeBrainSpot({ x: 0, y: 8, z: 0 }, extents).transmitters[0]).toMatchObject({
      name: 'Glutamate',
    });
  });
});
