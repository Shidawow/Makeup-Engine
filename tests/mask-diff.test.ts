import { describe, expect, it } from 'vitest';
import { diffSegmentationMasks, type CosmeticSegmentationMask } from '../src/vision';

const mask = (
  id: string,
  alpha: readonly number[],
): CosmeticSegmentationMask => ({
  id,
  target: 'lips',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
  },
  bounds: {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    space: 'normalized-image',
  },
  grid: {
    width: 3,
    height: 3,
    alpha,
  },
  confidence: 0.8,
  debug: [],
});

describe('mask diff artifact', () => {
  it('detects expansion with affected bounds and heatmap', () => {
    const diff = diffSegmentationMasks(
      mask('original', [0, 0, 0, 0, 0.6, 0, 0, 0, 0]),
      mask('edited', [0, 0.4, 0, 0.4, 0.8, 0.4, 0, 0.4, 0]),
    );

    expect(diff.schemaVersion).toBe('mask-diff-v0.1');
    expect(diff.addedAreaRatio).toBeCloseTo(5 / 9, 4);
    expect(diff.removedAreaRatio).toBe(0);
    expect(diff.changedAreaRatio).toBeCloseTo(5 / 9, 4);
    expect(diff.affectedBounds).toEqual({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      space: 'normalized-image',
    });
    expect(diff.diffHeatmap.alpha[1]).toBe(0.4);
    expect(diff.correctionType).toBe('expansion');
  });

  it('detects opacity-only adjustment', () => {
    const diff = diffSegmentationMasks(
      mask('original-opacity', new Array(9).fill(0.2)),
      mask('edited-opacity', new Array(9).fill(0.4)),
    );

    expect(diff.addedAreaRatio).toBe(1);
    expect(diff.alphaDeltaMean).toBe(0.2);
    expect(diff.correctionType).toBe('expansion');
  });
});
