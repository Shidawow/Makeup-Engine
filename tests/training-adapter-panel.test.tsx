import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TrainingAdapterPanel } from '../src/components/template-studio/training-adapter-panel';
import {
  assignReviewItemSplit,
  batchAcceptReviewItems,
  createDatasetReviewQueue,
  createSegmentationTrainingManifest,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const noop = () => undefined;

describe('TrainingAdapterPanel', () => {
  it('renders split counts, validation status, export actions, and runtime hint', () => {
    const dataset = datasetFixture([sampleFixture({ sampleId: 'sample-training-panel' })]);
    const accepted = batchAcceptReviewItems(
      createDatasetReviewQueue({ dataset, evidence: evidenceFixture() }),
      {
        reviewerMetadata: {
          reviewerId: 'training-panel',
          reviewedAt: '2026-05-29T00:00:00.000Z',
          notes: [],
        },
        decidedAt: '2026-05-29T00:00:00.000Z',
      },
    );
    const queue = assignReviewItemSplit(accepted, {
      reviewItemId: accepted.items[0].reviewItemId,
      split: 'train',
      updatedAt: '2026-05-29T00:01:00.000Z',
    });
    const manifest = createSegmentationTrainingManifest({ dataset, queue });
    const html = renderToStaticMarkup(
      <TrainingAdapterPanel
        manifest={manifest}
        onCopySummary={noop}
        onExportManifest={noop}
        onExportTest={noop}
        onExportTrain={noop}
        onExportValidation={noop}
      />,
    );

    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('导出清单');
    expect(html).toContain('校验：通过');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('training-preflight');
    expect(html).toContain('--export-run-package');
  });
});
