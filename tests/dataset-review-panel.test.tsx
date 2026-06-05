import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatasetReviewPanel } from '../src/components/template-studio/dataset-review-panel';
import {
  batchAcceptReviewItems,
  createDatasetReviewQueue,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const noop = () => undefined;

describe('DatasetReviewPanel', () => {
  it('renders queue filters, quality score, decisions, split assignment, and exports', () => {
    const dataset = datasetFixture([
      sampleFixture({ sampleId: 'sample-review-panel' }),
    ]);
    const queue = batchAcceptReviewItems(
      createDatasetReviewQueue({
        dataset,
        evidence: evidenceFixture(),
        createdAt: '2026-05-28T00:02:00.000Z',
      }),
      {
        reviewerMetadata: {
          reviewerId: 'panel-reviewer',
          reviewedAt: '2026-05-28T00:03:00.000Z',
          notes: [],
        },
        decidedAt: '2026-05-28T00:03:00.000Z',
      },
    );
    const html = renderToStaticMarkup(
      <DatasetReviewPanel
        filter="all"
        onAccept={noop}
        onAssignSplit={noop}
        onBatchAccept={noop}
        onBatchReject={noop}
        onExportManifest={noop}
        onExportReviewedJson={noop}
        onExportReviewedJsonl={noop}
        onFilterChange={noop}
        onNeedsSecondReview={noop}
        onOpenReplay={noop}
        onReject={noop}
        queue={queue}
      />,
    );

    expect(html).toContain('Dataset Review Queue');
    expect(html).toContain('pending review all');
    expect(html).toContain('Batch accept');
    expect(html).toContain('Reviewed JSON');
    expect(html).toContain('Reviewed JSONL');
    expect(html).toContain('Manifest');
    expect(html).toContain('quality');
    expect(html).toContain('suggested: ready for training');
    expect(html).toContain('Replay');
    expect(html).toContain('train');
  });
});
