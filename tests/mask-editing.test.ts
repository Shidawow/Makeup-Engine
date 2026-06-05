import { describe, expect, it } from 'vitest';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  redoMaskEdit,
  smoothEditableMask,
  undoMaskEdit,
  type CosmeticSegmentationMask,
} from '../src/vision';

const createMask = (): CosmeticSegmentationMask => ({
  id: 'brush-base',
  target: 'lips',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 },
    ],
  },
  bounds: {
    x: 0.2,
    y: 0.2,
    width: 0.6,
    height: 0.6,
    space: 'normalized-image',
  },
  grid: {
    width: 5,
    height: 5,
    alpha: Array.from({ length: 25 }, (_, index) => (index === 12 ? 0.2 : 0)),
  },
  confidence: 0.7,
  debug: [],
});

describe('mask editing operations', () => {
  it('applies brush add, erase, smoothing, undo and redo deterministically', () => {
    const editable = createEditableCosmeticMask(createMask());
    const added = applyMaskBrushEdit(editable, {
      id: 'edit-add',
      target: 'lips',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.35,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const erased = applyMaskBrushEdit(added, {
      id: 'edit-erase',
      target: 'lips',
      tool: 'brush-erase',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.2,
      strength: 0.5,
      createdAt: '2026-05-28T00:01:00.000Z',
    });
    const smoothed = smoothEditableMask(erased);
    const undone = undoMaskEdit(smoothed);
    const redone = redoMaskEdit(undone);

    expect(added.mergedMask.grid.alpha[12]).toBeGreaterThan(0.2);
    expect(erased.mergedMask.grid.alpha[12]).toBeLessThan(added.mergedMask.grid.alpha[12]);
    expect(smoothed.history.undo).toHaveLength(3);
    expect(undone.history.redo).toHaveLength(1);
    expect(redone.mergedMask.grid.alpha).toEqual(smoothed.mergedMask.grid.alpha);
  });
});

