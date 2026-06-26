import { MODEL_METADATA_PATH, SOURCE_METADATA_PATH } from '../config.js';

export function createBrainModelDescriptor() {
  return {
    id: 'whole-brain',
    label: 'Whole Brain',
    metadataPath: MODEL_METADATA_PATH,
    sourcePath: SOURCE_METADATA_PATH,
    meshMode: 'full',
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

  if (!metadata.model) {
    throw new Error(`Missing model metadata in ${descriptor.metadataPath}`);
  }

  if (!source.title || !source.sourceRepository || !source.licenseUrl || !source.licenseName) {
    throw new Error(`Missing source attribution metadata in ${descriptor.sourcePath}`);
  }

  return {
    descriptor,
    model: metadata.model,
    source,
  };
}
