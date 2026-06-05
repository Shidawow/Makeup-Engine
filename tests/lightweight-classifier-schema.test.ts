import { describe, expect, it } from 'vitest';
import { LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION, type LightweightSegmentationClassifier } from '../src/training/schema';

describe('lightweight classifier schema', () => {
  it('supports nearest-centroid model artifacts', () => {
    const model: LightweightSegmentationClassifier = {
      modelId: 'm',
      modelVersion: 'v',
      schemaVersion: LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION,
      classifierKind: 'nearest-centroid',
      createdAt: '2026-05-30T00:00:00.000Z',
      sourceDatasetId: 'd',
      sourcePackageId: 'p',
      trainingRunId: 'r',
      trainerConfigVersion: 'trainer-config-v0.1',
      trainedRegions: [],
      featureConfig: { featureStride: 1, alphaPositiveThreshold: 0.4, alphaNegativeThreshold: 0.05, featureNames: [] },
      regionClassifiers: {},
      trainingSummary: { sampleCount: 0, trainedRegionCount: 0, positivePixelCount: 0, negativePixelCount: 0, classifierKind: 'nearest-centroid', warnings: [] },
      evaluationSummary: { evaluatedSampleCount: 0, evaluatedRegionCount: 0, meanHardIoU: 0, meanDice: 0, meanPixelF1: 0, readinessStatus: 'insufficient-feature-data' },
      readinessStatus: 'insufficient-feature-data',
      artifactChecksum: '0',
    };
    expect(model.schemaVersion).toBe('lightweight-classifier-v0.1');
  });
});
