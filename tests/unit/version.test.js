import { describe, expect, it } from 'vitest';
import { formatVersionLabel } from '../../src/version.js';

describe('formatVersionLabel', () => {
  it('renders the version string for the UI badge', () => {
    expect(formatVersionLabel('1.2.3')).toBe('Version 1.2.3');
  });
});

