import { describe, expect, it } from 'vitest';
import {
  HUMAN_CORRECTION_DATASET_SCHEMA_VERSION,
  type HumanCorrectionEditorMetadata,
} from '../src/templates/schema';
import {
  createHumanCorrectionDataset,
  createHumanMaskCorrectionSample,
} from '../src/templates/storage';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';

const baseMask: CosmeticSegmentationMask = {
  id: 'dataset-base',
  target: 'blush',
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
    width: 3,
    height: 3,
    alpha: [0, 0, 0, 0, 0.2, 0, 0, 0, 0],
  },
  confidence: 0.75,
  debug: [],
};

const editorMetadata: HumanCorrectionEditorMetadata = {
  editorId: 'tester',
  tool: 'template-studio',
  sessionId: 'session-1',
  editedAt: '2026-05-28T00:00:00.000Z',
  notes: ['fixture'],
};

describe('human correction dataset schema', () => {
  it('creates schema-first correction samples and dataset metadata', () => {
    const editable = applyMaskBrushEdit(createEditableCosmeticMask(baseMask), {
      id: 'dataset-edit',
      target: 'blush',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.4,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const sample = createHumanMaskCorrectionSample({
      imageId: 'image-1',
      templateId: 'template-1',
      editableMask: editable,
      editorMetadata,
      correctionReason: 'expand blush placement',
      correctionConfidence: 0.84,
      humanVerificationStatus: 'ready_for_dataset',
      exportedAt: '2026-05-28T00:01:00.000Z',
    });
    const dataset = createHumanCorrectionDataset({
      imageId: 'image-1',
      templateId: 'template-1',
      samples: [sample],
      createdAt: '2026-05-28T00:00:00.000Z',
      exportedAt: '2026-05-28T00:01:00.000Z',
      humanVerificationStatus: 'ready_for_dataset',
    });

    expect(sample.schemaVersion).toBe(HUMAN_CORRECTION_DATASET_SCHEMA_VERSION);
    expect(sample.sampleId).toMatch(/^sample-/);
    expect(sample.originalSegmentationMask.id).toBe('dataset-base');
    expect(sample.humanEditedMask.target).toBe('blush');
    expect(sample.maskDiff.changedAreaRatio).toBeGreaterThan(0);
    expect(dataset.schemaVersion).toBe(HUMAN_CORRECTION_DATASET_SCHEMA_VERSION);
    expect(dataset.sampleCount).toBe(1);
    expect(dataset.summary.readyForTraining).toBe(true);
  });
});
