import { describe, expect, it } from 'vitest';
import { evaluateBaselineSegmentationModel } from '../src/training/evaluation';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

describe('baseline model evaluator', () => {
  it('computes real baseline mask-vs-mask metrics', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainBaselineSegmentationModel({
      dataset,
      regions: ['lips', 'blush', 'eyeshadow'],
    });
    const evaluation = evaluateBaselineSegmentationModel({ model, dataset });

    expect(evaluation.evaluationSampleCount).toBe(2);
    expect(evaluation.perRegionMetrics.map((metric) => metric.regionId)).toEqual([
      'blush',
      'eyeshadow',
    ]);
    expect(evaluation.softIoU).toBeGreaterThanOrEqual(0);
    expect(evaluation.dice).toBeGreaterThanOrEqual(0);
  });
});
