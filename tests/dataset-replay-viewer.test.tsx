import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatasetReplayViewer } from '../src/components/template-studio/dataset-replay-viewer';
import {
  createDatasetReplayPayload,
  createDatasetReviewQueue,
} from '../src/templates/storage';
import {
  datasetFixture,
  evidenceFixture,
  sampleFixture,
  templateFixture,
} from './dataset-review-fixtures';
describe('DatasetReplayViewer', () => {
  it('renders mask replay, pixel analysis, semantics, templates, and evidence summary', () => {
    const sample = sampleFixture({ sampleId: 'sample-replay-viewer' });
    const dataset = datasetFixture([sample]);
    const queue = createDatasetReviewQueue({
      dataset,
      evidence: evidenceFixture(),
      createdAt: '2026-05-28T00:02:00.000Z',
    });
    const payload = createDatasetReplayPayload({
      sample,
      item: queue.items[0],
      templateBefore: templateFixture('template-before'),
      templateAfter: templateFixture('template-after'),
    });
    const html = renderToStaticMarkup(<DatasetReplayViewer payload={payload} />);
    expect(html).toContain('数据回放');
    expect(html).toContain('AI 原始蒙版');
    expect(html).toContain('人工编辑蒙版');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('sample-replay-viewer');
    expect(html).toContain('证据摘要');
    expect(html).toContain('sample-replay-viewer');
  });
  it('renders an empty state without runtime dependencies', () => {
    const html = renderToStaticMarkup(<DatasetReplayViewer payload={null} />);
    expect(html.length).toBeGreaterThan(0);
  });
});