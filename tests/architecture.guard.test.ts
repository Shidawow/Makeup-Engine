import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);

    return stat.isDirectory() ? walk(path) : [path];
  });

describe('architecture guard', () => {
  it('engine and intelligence do not import UI, React, or Zustand', () => {
    const files = [...walk('src/engine'), ...walk('src/intelligence')].filter((file) =>
      file.endsWith('.ts'),
    );

    files.forEach((file) => {
      const source = readFileSync(file, 'utf8');
      expect(source.includes('react')).toBe(false);
      expect(source.includes('zustand')).toBe(false);
      expect(source.includes('components')).toBe(false);
    });
  });

  it('engine and compiler do not use any', () => {
    const files = [...walk('src/engine'), ...walk('src/compiler')].filter((file) =>
      file.endsWith('.ts'),
    );

    files.forEach((file) => {
      const source = readFileSync(file, 'utf8');
      expect(/\bany\b/.test(source)).toBe(false);
    });
  });
});
