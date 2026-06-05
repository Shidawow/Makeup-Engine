import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('full-region materialized fixture coverage', () => {
  it('covers all six cosmetic regions across train/validation/test', async () => {
    const root = path.resolve('tests/fixtures/materialized-dataset-full-regions.sample');
    const rows = (await Promise.all(['train', 'validation', 'test'].map(async (split) =>
      (await readFile(path.join(root, 'splits', `${split}.jsonl`), 'utf8')).trim().split(/\r?\n/).map((line) => JSON.parse(line) as { regionId: string; split: string }),
    ))).flat();
    expect([...new Set(rows.map((row) => row.regionId))].sort()).toEqual(['blush', 'contour', 'eyeliner', 'eyeshadow', 'highlight', 'lips']);
    expect(rows).toHaveLength(18);
  });
});
