const REGION_DEFINITIONS = [
  {
    id: 'brainstem',
    title: 'Brainstem / lower midline zone',
    match: ({ ny, ax }) => ny < -0.62 && ax < 0.42,
    summary: 'This lower midline zone is closest to arousal and autonomic relay circuits.',
    transmitters: [
      ['Serotonin', 'sleep, mood, and brainstem modulation'],
      ['Norepinephrine', 'alerting and stress-response signaling'],
      ['Dopamine', 'midbrain reward and movement pathways'],
      ['Acetylcholine', 'brainstem and thalamic activation loops'],
    ],
  },
  {
    id: 'cerebellar',
    title: 'Cerebellar / hindbrain zone',
    match: ({ ny }) => ny < -0.38,
    summary: 'This lower posterior zone is closest to cerebellar coordination pathways.',
    transmitters: [
      ['GABA', 'the dominant inhibitory signal in cerebellar circuits'],
      ['Glutamate', 'the primary excitatory drive into cerebellar pathways'],
      ['Glycine', 'fast inhibitory support in hindbrain networks'],
      ['Norepinephrine', 'gain control and motor readiness'],
    ],
  },
  {
    id: 'frontal',
    title: 'Frontal cortical zone',
    match: ({ nz }) => nz > 0.24,
    summary: 'This anterior cortical zone is closest to planning, attention, and executive circuits.',
    transmitters: [
      ['Dopamine', 'working memory, motivation, and executive control'],
      ['Glutamate', 'the main excitatory signal across cortical networks'],
      ['GABA', 'local inhibitory balancing and signal shaping'],
      ['Acetylcholine', 'attention and top-down modulation'],
      ['Serotonin', 'mood and cognitive flexibility'],
    ],
  },
  {
    id: 'occipital',
    title: 'Occipital cortical zone',
    match: ({ nz }) => nz < -0.48,
    summary: 'This posterior cortical zone is closest to visual processing pathways.',
    transmitters: [
      ['Glutamate', 'the major excitatory signal in visual pathways'],
      ['GABA', 'contrast tuning and inhibitory filtering'],
      ['Acetylcholine', 'visual attention and cortical gain'],
      ['Serotonin', 'state-dependent modulation of visual cortex'],
    ],
  },
  {
    id: 'temporal',
    title: 'Temporal cortical zone',
    match: ({ ax, ny }) => ax > 0.58 && ny < 0.16,
    summary: 'This lateral lower cortical zone is closest to memory, auditory, and limbic pathways.',
    transmitters: [
      ['Glutamate', 'the dominant excitatory cortical transmitter'],
      ['GABA', 'local inhibitory control in temporal circuits'],
      ['Acetylcholine', 'memory encoding and cortical plasticity'],
      ['Dopamine', 'salience and reinforcement signaling'],
      ['Serotonin', 'affect and limbic modulation'],
    ],
  },
  {
    id: 'parietal',
    title: 'Parietal / superior cortical zone',
    match: ({ ny }) => ny > 0.34,
    summary: 'This upper cortical zone is closest to sensory integration and spatial attention circuits.',
    transmitters: [
      ['Glutamate', 'the main excitatory signal in association cortex'],
      ['GABA', 'precision tuning and inhibitory balance'],
      ['Acetylcholine', 'attention and sensory prioritization'],
      ['Norepinephrine', 'vigilance and sensory gain'],
    ],
  },
];

const DEFAULT_REGION = {
  id: 'sensorimotor',
  title: 'Central cortical zone',
  summary: 'This central cortical zone is closest to sensorimotor relay and association pathways.',
  transmitters: [
    ['Glutamate', 'the main excitatory signal across cortex'],
    ['GABA', 'the main inhibitory balancing signal'],
    ['Dopamine', 'action selection and motor learning support'],
    ['Acetylcholine', 'sensorimotor attention and plasticity'],
  ],
};

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function toNormalizedCoordinates(point, extents) {
  return {
    nx: clamp(point.x / Math.max(extents.x, 1)),
    ny: clamp(point.y / Math.max(extents.y, 1)),
    nz: clamp(point.z / Math.max(extents.z, 1)),
    ax: clamp(Math.abs(point.x) / Math.max(extents.x, 1)),
  };
}

function getHemisphereLabel(normalized, region) {
  if (region.id === 'brainstem' || normalized.ax < 0.18) {
    return 'Midline';
  }

  return normalized.nx < 0 ? 'Left' : 'Right';
}

function selectRegion(normalized) {
  return REGION_DEFINITIONS.find((region) => region.match(normalized)) || DEFAULT_REGION;
}

export function describeBrainSpot(point, extents) {
  const normalized = toNormalizedCoordinates(point, extents);
  const region = selectRegion(normalized);
  const hemisphere = getHemisphereLabel(normalized, region);

  return {
    regionId: region.id,
    title: `${hemisphere} ${region.title}`,
    summary: region.summary,
    transmitters: region.transmitters.map(([name, description]) => ({
      name,
      description,
    })),
    note: 'Approximate regional association from a whole-brain surface tap. It is not a medical atlas or diagnosis.',
  };
}
