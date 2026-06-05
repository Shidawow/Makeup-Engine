import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatasetPanel } from '../src/components/template-studio/dataset-panel';
import {
  createHumanCorrectionDataset,
  createHumanMaskCorrectionSample,
} from '../src/templates/storage';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';

const noop = () => undefined;

const mask: CosmeticSegmentationMask = {
  id: 'dataset-panel-mask',
  target: 'highlight',
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
};

describe('DatasetPanel', () => {
  it('renders correction samples, diff summary, export actions, and batch actions', () => {
    const editable = applyMaskBrushEdit(createEditableCosmeticMask(mask), {
      id: 'dataset-panel-edit',
      target: 'highlight',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.4,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const sample = createHumanMaskCorrectionSample({
      imageId: 'dataset-panel-image',
      templateId: 'dataset-panel-template',
      editableMask: editable,
      editorMetadata: {
        editorId: 'tester',
        tool: 'template-studio',
        sessionId: 'dataset-panel-session',
        editedAt: '2026-05-28T00:00:00.000Z',
        notes: [],
      },
      correctionReason: 'highlight boundary correction',
      correctionConfidence: 0.85,
      humanVerificationStatus: 'ready_for_dataset',
      exportedAt: '2026-05-28T00:01:00.000Z',
    });
    const dataset = createHumanCorrectionDataset({
      imageId: 'dataset-panel-image',
      templateId: 'dataset-panel-template',
      samples: [sample],
      createdAt: '2026-05-28T00:00:00.000Z',
      exportedAt: '2026-05-28T00:01:00.000Z',
      humanVerificationStatus: 'ready_for_dataset',
    });
    const html = renderToStaticMarkup(
      <DatasetPanel
        canBatchReanalysis
        canBatchSave
        dataset={dataset}
        onBatchReanalysis={noop}
        onBatchSave={noop}
        onCopyDatasetSummary={noop}
        onExportJson={noop}
        onExportJsonl={noop}
        samples={[sample]}
      />,
    );

    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('JSON');
    expect(html).toContain('JSONL');
    expect(html).toContain('highlight');
    expect(html).toContain('highlight');
    expect(html).toContain('ready_for_dataset');
    expect(html).toContain('0.85');
  });
});
