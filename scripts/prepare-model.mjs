import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceUrl =
  'https://raw.githubusercontent.com/PittBrains3D/PittBrains3D---Digital-3D-Models-for-Neuroanatomy-Instruction/main/Whole_brain_and_hemisected_brain/Whole%20brain.stl';
const repoRoot = path.resolve(import.meta.dirname, '..');
const cacheDir = path.join(repoRoot, '.local');
const sourcePath = path.join(cacheDir, 'whole-brain-source.stl');
const outputDir = path.join(repoRoot, 'public', 'models');
const metadataPath = path.join(repoRoot, 'public', 'data', 'brain-model.json');
const outputPath = path.join(outputDir, 'whole-brain-full.stl');

function isBinaryStl(buffer) {
  if (buffer.length < 84) {
    return false;
  }

  const triangleCount = buffer.readUInt32LE(80);
  return 84 + triangleCount * 50 <= buffer.length;
}

function readBinaryStlTriangleCount(buffer) {
  if (!isBinaryStl(buffer)) {
    throw new Error('The PittBrains3D source asset is not a binary STL.');
  }

  return buffer.readUInt32LE(80);
}

async function ensureSourceFile() {
  await mkdir(cacheDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });

  try {
    await stat(sourcePath);
    return;
  } catch {
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      throw new Error(`Failed to download PittBrains3D source STL: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await writeFile(sourcePath, Buffer.from(arrayBuffer));
  }
}

await ensureSourceFile();

const sourceBuffer = await readFile(sourcePath);
const triangleCount = readBinaryStlTriangleCount(sourceBuffer);

await writeFile(outputPath, sourceBuffer);

await writeFile(
  metadataPath,
  JSON.stringify(
    {
      sourceUrl,
      model: {
        id: 'full',
        label: 'Full',
        meshPath: '/models/whole-brain-full.stl',
        originalTriangleCount: triangleCount,
        reducedTriangleCount: triangleCount,
        stride: 1,
        reductionPercent: 0,
        reductionRatio: 'Full resolution',
      },
    },
    null,
    2,
  ),
);

console.log(`Prepared full PittBrains3D brain model: ${triangleCount} triangles.`);
