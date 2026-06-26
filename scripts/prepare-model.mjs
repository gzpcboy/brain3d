import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceUrl =
  'https://raw.githubusercontent.com/PittBrains3D/PittBrains3D---Digital-3D-Models-for-Neuroanatomy-Instruction/main/Whole_brain_and_hemisected_brain/Whole%20brain.stl';
const repoRoot = path.resolve(import.meta.dirname, '..');
const cacheDir = path.join(repoRoot, '.local');
const sourcePath = path.join(cacheDir, 'whole-brain-source.stl');
const outputPath = path.join(repoRoot, 'public', 'models', 'whole-brain-lite.stl');
const metadataPath = path.join(repoRoot, 'public', 'data', 'brain-model.json');
const stride = Number(process.env.BRAIN3D_REDUCTION_STRIDE || 12);

function isBinaryStl(buffer) {
  if (buffer.length < 84) {
    return false;
  }

  const triangleCount = buffer.readUInt32LE(80);
  return 84 + triangleCount * 50 <= buffer.length;
}

function reduceBinaryStl(buffer, faceStride) {
  if (!isBinaryStl(buffer)) {
    throw new Error('The PittBrains3D source asset is not a binary STL.');
  }

  const originalTriangleCount = buffer.readUInt32LE(80);
  const keptTriangles = [];

  for (let index = 0; index < originalTriangleCount; index += faceStride) {
    const start = 84 + index * 50;
    keptTriangles.push(buffer.subarray(start, start + 50));
  }

  const output = Buffer.allocUnsafe(84 + keptTriangles.length * 50);
  buffer.copy(output, 0, 0, 80);
  output.writeUInt32LE(keptTriangles.length, 80);

  keptTriangles.forEach((triangle, index) => {
    triangle.copy(output, 84 + index * 50);
  });

  return {
    buffer: output,
    originalTriangleCount,
    reducedTriangleCount: keptTriangles.length,
  };
}

async function ensureSourceFile() {
  await mkdir(cacheDir, { recursive: true });

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
const reduced = reduceBinaryStl(sourceBuffer, stride);
const reductionRatio = `${Math.round((1 - reduced.reducedTriangleCount / reduced.originalTriangleCount) * 100)}% smaller`;

await writeFile(outputPath, reduced.buffer);
await writeFile(
  metadataPath,
  JSON.stringify(
    {
      sourceUrl,
      originalTriangleCount: reduced.originalTriangleCount,
      reducedTriangleCount: reduced.reducedTriangleCount,
      stride,
      reductionRatio,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

console.log(
  `Prepared reduced PittBrains3D model: ${reduced.originalTriangleCount} -> ${reduced.reducedTriangleCount} triangles.`,
);

