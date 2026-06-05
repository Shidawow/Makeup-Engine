import { describe, expect, it } from 'vitest';
import {
  createVisionCorrectionRecord,
  createVisionCorrectionSession,
  createVisionCorrectionStorage,
  parseVisionCorrectionSession,
  serializeVisionCorrectionSession,
} from '../src/templates/storage';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';

const storageAdapter = () => {
  const state: { value: string | null } = { value: null };

  return {
    read: () => state.value,
    write: (value: string) => {
      state.value = value;
    },
  };
};

const mask = (id: string, target: CosmeticSegmentationMask['target']): CosmeticSegmentationMask => ({
  id,
  target,
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
    width: 2,
    height: 2,
    alpha: [0, 0.2, 0.2, 0],
  },
  confidence: 0.8,
  debug: [],
});

describe('batch correction save', () => {
  it('saves all and selected corrections and round-trips correction sessions', () => {
    const records = (['lips', 'blush'] as const).map((target) => {
      const editable = applyMaskBrushEdit(
        createEditableCosmeticMask(mask(`mask-${target}`, target)),
        {
          id: `edit-${target}`,
          target,
          tool: 'brush-add',
          point: { x: 0.5, y: 0.5, space: 'normalized-image' },
          radius: 0.25,
          strength: 0.8,
          createdAt: '2026-05-28T00:00:00.000Z',
        },
      );

      return createVisionCorrectionRecord({
        imageId: 'image-batch-save',
        templateId: 'template-batch-save',
        editableMask: editable,
        correctionConfidence: 0.84,
        humanAdjustedRegions: ['lips', 'blush'],
        savedAt: '2026-05-28T00:01:00.000Z',
      });
    });
    const storage = createVisionCorrectionStorage(storageAdapter());
    const all = storage.saveMany(records);
    const selected = storage.saveSelected({
      records,
      selectedRegions: ['lips'],
    });
    const session = createVisionCorrectionSession({
      sessionId: 'session-batch-save',
      imageId: 'image-batch-save',
      templateId: 'template-batch-save',
      records,
      dirtyRegions: ['lips', 'blush'],
      savedAt: '2026-05-28T00:02:00.000Z',
    });
    const roundTrip = parseVisionCorrectionSession(
      serializeVisionCorrectionSession(session),
    );

    expect(all.records).toHaveLength(2);
    expect(selected.records).toHaveLength(2);
    expect(storage.getByImageId('image-batch-save')).toHaveLength(2);
    expect(roundTrip.schemaVersion).toBe('vision-correction-session-v0.1');
    expect(storage.importCorrectionSession(serializeVisionCorrectionSession(session)).importedCount).toBe(2);
  });
});
