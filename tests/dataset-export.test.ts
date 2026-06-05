import { describe, expect, it } from 'vitest';
import {
  createHumanCorrectionDataset,
  createHumanMaskCorrectionSample,
  exportCorrectionDatasetJsonBundle,
  exportCorrectionDatasetJsonl,
  exportCorrectionSampleJson,
  stableHash,
} from '../src/templates/storage';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';

const mask: CosmeticSegmentationMask = {
  id: 'export-mask',
  target: 'eyeshadow',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.6 },
      { x: 0.2, y: 0.6 },
    ],
  },
  bounds: {
    x: 0.2,
    y: 0.2,
    width: 0.6,
    height: 0.4,
    space: 'normalized-image',
  },
  grid: {
    width: 2,
    height: 2,
    alpha: [0, 0.2, 0.2, 0],
  },
  confidence: 0.8,
  debug: [],
};

describe('dataset export system', () => {
  it('exports deterministic sample JSON, JSON bundle, and JSONL', () => {
    const editable = applyMaskBrushEdit(createEditableCosmeticMask(mask), {
      id: 'export-edit',
      target: 'eyeshadow',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.4, space: 'normalized-image' },
      radius: 0.5,
      strength: 0.9,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const sample = createHumanMaskCorrectionSample({
      imageId: 'image-export',
      templateId: 'template-export',
      editableMask: editable,
      editorMetadata: {
        editorId: 'tester',
        tool: 'template-studio',
        sessionId: 'session-export',
        editedAt: '2026-05-28T00:00:00.000Z',
        notes: [],
      },
      correctionReason: 'raise eyeshadow opacity',
      correctionConfidence: 0.83,
      humanVerificationStatus: 'ready_for_dataset',
      exportedAt: '2026-05-28T00:01:00.000Z',
    });
    const dataset = createHumanCorrectionDataset({
      imageId: 'image-export',
      templateId: 'template-export',
      samples: [sample],
      createdAt: '2026-05-28T00:00:00.000Z',
      exportedAt: '2026-05-28T00:01:00.000Z',
      humanVerificationStatus: 'ready_for_dataset',
    });
    const sampleJson = exportCorrectionSampleJson(sample);
    const bundleA = exportCorrectionDatasetJsonBundle(dataset);
    const bundleB = exportCorrectionDatasetJsonBundle(dataset);
    const jsonl = exportCorrectionDatasetJsonl(dataset);

    expect(bundleA).toBe(bundleB);
    expect(bundleA).toContain('"schemaVersion":"human-correction-dataset-v0.1"');
    expect(sampleJson).toContain(sample.sampleId);
    expect(jsonl.split('\n')).toHaveLength(1);
    expect(stableHash({ b: 2, a: 1 })).toBe(stableHash({ a: 1, b: 2 }));
  });
});
