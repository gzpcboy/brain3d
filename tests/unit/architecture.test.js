import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');

function walk(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (['.git', 'dist', 'node_modules', 'playwright-report', 'test-results'].includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (/\.(js|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('architecture guardrails', () => {
  it('keeps every JS file under 500 lines', () => {
    const violations = walk(root)
      .map((file) => ({
        relative: path.relative(root, file),
        lines: readFileSync(file, 'utf8').split('\n').length,
      }))
      .filter((entry) => entry.lines <= 0 || entry.lines > 500);

    expect(violations).toEqual([]);
  });
});

