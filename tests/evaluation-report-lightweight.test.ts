import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { attachLightweightClassifierEvaluationToReport, createDryRunEvaluationReport, evaluateLightweightSegmentationClassifier } from '../src/training/evaluation';
import { loadMaterializedDataset, type TrainingDatasetFileReader } from '../src/training/loaders';
import { trainLightweightSegmentationClassifier } from '../src/training/trainers';
import { loadPixelFixtureMap, pixelFixtureDatasetRoot } from './baselineTestUtils';

const reader: TrainingDatasetFileReader = {
  readText: async (relativePath) =>
    readFile(path.join(pixelFixtureDatasetRoot, ...relativePath.split('/')), 'utf8'),
  exists: async (relativePath) => {
    try {
      await access(path.join(pixelFixtureDatasetRoot, ...relativePath.split('/')));
      return true;
    } catch {
      return false;
    }
  },
};

describe('evaluation report lightweight block', () => {
  it('attaches classifier metrics without overwriting existing report', async () => {
    const dataset = await loadMaterializedDataset({ reader });
    const pixels = await loadPixelFixtureMap();
    const model = trainLightweightSegmentationClassifier({ dataset, imagePixelsByImageId: pixels, regions: ['lips', 'blush', 'eyeshadow'] });
    const evaluation = evaluateLightweightSegmentationClassifier({ model, dataset, imagePixelsByImageId: pixels });
    const report = attachLightweightClassifierEvaluationToReport({
      report: createDryRunEvaluationReport({ dataset, trainingRunId: 'run', createdAt: '2026-05-30T00:00:00.000Z' }),
      model,
      evaluation,
    });
    expect(report.lightweightClassifierEvaluation?.metricType).toBe('lightweight-segmentation-classifier');
  });
});
