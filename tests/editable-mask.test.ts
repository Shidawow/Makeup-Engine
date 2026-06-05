import { describe, expect, it } from 'vitest';
import {
  createEditableCosmeticMask,
  editableMasksToSegmentationMasks,
  type CosmeticSegmentationMask,
} from '../src/vision';

const baseMask: CosmeticSegmentationMask = {
  id: 'editable-base',
  target: 'lips',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.25, y: 0.45 },
      { x: 0.75, y: 0.45 },
      { x: 0.75, y: 0.65 },
      { x: 0.25, y: 0.65 },
    ],
  },
  bounds: {
    x: 0.25,
    y: 0.45,
    width: 0.5,
    height: 0.2,
    space: 'normalized-image',
  },
  grid: {
    width: 4,
    height: 4,
    alpha: [
      0, 0.1, 0.1, 0,
      0.1, 0.8, 0.8, 0.1,
      0.1, 0.8, 0.8, 0.1,
      0, 0.1, 0.1, 0,
    ],
  },
  confidence: 0.74,
  debug: ['fixture'],
};

describe('editable cosmetic mask model', () => {
  it('wraps a segmentation mask without mutating the base contract', () => {
    const editable = createEditableCosmeticMask(baseMask);

    expect(editable.baseMask.id).toBe(baseMask.id);
    expect(editable.mergedMask.id).toBe('editable-base-editable-merged');
    expect(editable.userModifications).toHaveLength(0);
    expect(editable.metadata.source).toBe('segmentation');
    expect(editableMasksToSegmentationMasks([editable])[0].target).toBe('lips');
  });
});

