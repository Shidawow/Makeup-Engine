import { describe, expect, it } from 'vitest';
import { attachBaselineEvaluationToReport, createDryRunEvaluationReport, evaluateBaselineSegmentationModel } from '../src/training/evaluation';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

describe('baseline evaluation report upgrade', () => {
  it('keeps dry-run proxy metrics and adds baseline model metrics separately', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainBaselineSegmentationModel({
      dataset,
      regions: ['lips', 'blush', 'eyeshadow'],
    });
    const report = createDryRunEvaluationReport({
      dataset,
      trainingRunId: model.trainingRunId,
      createdAt: model.createdAt,
    });
    const upgraded = attachBaselineEvaluationToReport({
      report,
      baselineEvaluation: evaluateBaselineSegmentationModel({ model, dataset }),
    });

    expect(upgraded.maskMetricSummary.some((metric) => metric.metricName === 'dry_run_proxy_mask_area')).toBe(true);
    expect(upgraded.baselineModelEvaluation?.metricType).toBe('baseline-mask-prior');
    expect(upgraded.baselineModelEvaluation?.note).toContain('not a neural network');
  });
});
