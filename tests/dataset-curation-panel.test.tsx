import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatasetCurationPanel } from '../src/components/template-studio/dataset-curation-panel';
import {
  batchAcceptReviewItems,
  computeDatasetCurationMetrics,
  createDatasetReviewQueue,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
} from './dataset-review-fixtures';

const noop = () => undefined;

describe('DatasetCurationPanel', () => {
  it('renders metrics, filters, warnings, and export actions', () => {
    const dataset = datasetFixture([sampleFixture({ sampleId: 'sample-curation-panel' })]);
    const queue = batchAcceptReviewItems(
      createDatasetReviewQueue({ dataset, evidence: evidenceFixture() }),
      {
        reviewerMetadata: {
          reviewerId: 'curation-panel',
          reviewedAt: '2026-05-29T00:00:00.000Z',
          notes: [],
        },
        decidedAt: '2026-05-29T00:00:00.000Z',
      },
    );
    const metrics = computeDatasetCurationMetrics({ dataset, queue });
    const html = renderToStaticMarkup(
      <DatasetCurationPanel
        metrics={metrics}
        onCopySummary={noop}
        onExportMetricsJson={noop}
        onExportTrainingManifestJson={noop}
        onRegionFilterChange={noop}
        onSplitFilterChange={noop}
        onStatusFilterChange={noop}
        onValidateTrainingManifest={noop}
        regionFilter="all"
        splitFilter="all"
        statusFilter="all"
      />,
    );

    expect(html).toContain('Dataset Curation Metrics');
    expect(html).toContain('Export metrics');
    expect(html).toContain('Training manifest');
    expect(html).toContain('Accepted');
    expect(html).toContain('warnings:');
  });
});
