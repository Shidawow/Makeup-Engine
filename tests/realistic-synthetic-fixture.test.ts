import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('realistic synthetic fixture', () => {
  it('uses 64x64 generated pixel artifacts and all six regions', async () => {
    const root = path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample');
    const pixel = JSON.parse(await readFile(path.join(root, 'image-pixels/image-train.rgba.json'), 'utf8')) as { width: number; height: number; pixels: { generator?: string } };
    const rows = (await readFile(path.join(root, 'splits/train.jsonl'), 'utf8')).trim().split(/\r?\n/).map((line) => JSON.parse(line) as { regionId: string });
    expect(pixel.width).toBe(64);
    expect(pixel.height).toBe(64);
    expect(pixel.pixels.generator).toBe('face-like-regions-v0');
    expect([...new Set(rows.map((row) => row.regionId))].sort()).toEqual(['blush', 'contour', 'eyeliner', 'eyeshadow', 'highlight', 'lips']);
  });
});
