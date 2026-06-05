import { describe, expect, it } from 'vitest';
import { createEditableCosmeticMask } from '../src/vision';
import { createVisionCorrectionRecord, createVisionCorrectionStorage } from '../src/templates/storage';

const storageAdapter = () => {
  const state: { value: string | null } = { value: null };
  return {
    read: () => state.value,
    write: (value: string) => {
      state.value = value;
    },
  };
};

describe('vision correction persistence', () => {
  it('stores human edits and convergence metadata in schema-first records', () => {
    const mask = createEditableCosmeticMask({
      id: 'persist-mask',
      target: 'lips',
      polygon: {
        space: 'normalized-image',
        points: [
          { x: 0.2, y: 0.3 },
          { x: 0.8, y: 0.3 },
          { x: 0.8, y: 0.7 },
          { x: 0.2, y: 0.7 },
        ],
      },
      bounds: {
        x: 0.2,
        y: 0.3,
        width: 0.6,
        height: 0.4,
        space: 'normalized-image',
      },
      grid: {
        width: 4,
        height: 4,
        alpha: new Array(16).fill(0.5),
      },
      confidence: 0.9,
      debug: [],
    });

    const record = createVisionCorrectionRecord({
      imageId: 'image-1',
      templateId: 'template-1',
      editableMask: mask,
      correctionConfidence: 0.82,
      humanAdjustedRegions: ['lips'],
      savedAt: '2026-05-28T00:00:00.000Z',
    });
    const storage = createVisionCorrectionStorage(storageAdapter());
    const snapshot = storage.save(record);

    expect(snapshot.records).toHaveLength(1);
    expect(storage.getByImageId('image-1')[0].convergence.analysisVersion).toBe('vision-first-4c');
  });
});

