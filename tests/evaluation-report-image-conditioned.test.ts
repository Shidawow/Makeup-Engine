import { describe, expect, it } from 'vitest';
import { attachImageConditionedEvaluationToReport, createDryRunEvaluationReport, evaluateImageConditionedSegmentationModel } from '../src/training/evaluation';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned evaluation report upgrade', () => {
  it('adds image-conditioned metrics separately from proxy metrics', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const pixels = await loadPixelFixtureMap();
    const model = trainImageConditionedSegmentationModel({ dataset, imagePixelsByImageId: pixels, regions: ['lips'] });
    const report = attachImageConditionedEvaluationToReport({
      report: createDryRunEvaluationReport({ dataset, trainingRunId: model.trainingRunId, createdAt: model.createdAt }),
      model,
      evaluation: evaluateImageConditionedSegmentationModel({ model, dataset, imagePixelsByImageId: pixels }),
    });
    expect(report.imageConditionedModelEvaluation?.metricType).toBe('image-conditioned-pixel-prior');
    expect(report.imageConditionedModelEvaluation?.note).toContain('not neural network');
  });
});
