import {
  MODEL_METADATA_PATH,
  MODEL_PATH,
  SOURCE_METADATA_PATH,
} from '../config.js';

export function createBrainModelDescriptor() {
  return {
    id: 'whole-brain',
    label: 'Whole Brain',
    meshPath: MODEL_PATH,
    metadataPath: MODEL_METADATA_PATH,
    sourcePath: SOURCE_METADATA_PATH,
  };
}

export async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return response.json();
}

export async function loadBrainModelBundle(descriptor = createBrainModelDescriptor()) {
  const [metadata, source] = await Promise.all([
    loadJson(descriptor.metadataPath),
    loadJson(descriptor.sourcePath),
  ]);

  return {
    descriptor,
    metadata,
    source,
  };
}

