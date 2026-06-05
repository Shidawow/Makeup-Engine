import { describe, expect, it } from 'vitest';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';
import {
  applyVisionCorrectionToEditableMask,
  createVisionCorrectionRecord,
  createVisionCorrectionStorage,
  parseVisionCorrectionSnapshot,
  serializeVisionCorrectionSnapshot,
} from '../src/templates/storage';

const storageAdapter = () => {
  const state: { value: string | null } = { value: null };

  return {
    read: () => state.value,
    write: (value: string) => {
      state.value = value;
    },
  };
};

const mask: CosmeticSegmentationMask = {
  id: 'correction-mask',
  target: 'eyeshadow',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.7, y: 0.5 },
      { x: 0.3, y: 0.5 },
    ],
  },
  bounds: {
    x: 0.3,
    y: 0.3,
    width: 0.4,
    height: 0.2,
    space: 'normalized-image',
  },
  grid: {
    width: 3,
    height: 3,
    alpha: [0, 0.1, 0, 0.1, 0.4, 0.1, 0, 0.1, 0],
  },
  confidence: 0.8,
  debug: [],
};

describe('correction import and export', () => {
  it('serializes, imports, and applies correction JSON to an editable mask', () => {
    const baseEditable = createEditableCosmeticMask(mask);
    const edited = applyMaskBrushEdit(baseEditable, {
      id: 'correction-edit',
      target: 'eyeshadow',
      tool: 'feather-brush',
      point: { x: 0.5, y: 0.4, space: 'normalized-image' },
      radius: 0.25,
      strength: 0.7,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const record = createVisionCorrectionRecord({
      imageId: 'image-correction',
      templateId: 'template-correction',
      editableMask: edited,
      correctionConfidence: 0.86,
      humanAdjustedRegions: ['eyeshadow'],
      savedAt: '2026-05-28T00:01:00.000Z',
    });
    const snapshot = {
      records: [record],
      savedAt: '2026-05-28T00:01:00.000Z',
    };
    const json = serializeVisionCorrectionSnapshot(snapshot);
    const parsed = parseVisionCorrectionSnapshot(json);
    const storage = createVisionCorrectionStorage(storageAdapter());
    const imported = storage.importJson(json);
    const applied = applyVisionCorrectionToEditableMask(baseEditable, record);

    expect(parsed.records[0].region).toBe('eyeshadow');
    expect(imported.importedCount).toBe(1);
    expect(imported.snapshot.records).toHaveLength(1);
    expect(storage.exportSnapshot()).toContain('template-correction');
    expect(applied?.mergedMask.grid.alpha).toEqual(record.mergedAlpha);
    expect(applied?.metadata.source).toBe('human-adjusted');
  });
});
