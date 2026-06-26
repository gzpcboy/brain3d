import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const maxLines = 500;
const allowedExtensions = new Set(['.js', '.mjs']);
const ignoredDirectories = new Set([
  '.git',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await walk(fullPath)));
      }
      continue;
    }

    if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(root);
const violations = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const lines = content.split('\n').length;

  if (lines > maxLines) {
    violations.push(`${path.relative(root, file)}: ${lines}`);
  }
}

if (violations.length > 0) {
  console.error(`Files over ${maxLines} lines:\n${violations.join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${files.length} files. All within ${maxLines} lines.`);

