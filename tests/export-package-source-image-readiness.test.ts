import { describe, expect, it } from 'vitest';
import { createExportPreparationManifest, createExportReadyModelPackage } from '../src/training/export';
import type { LightweightSegmentationClassifier } from '../src/training/schema';

const model: LightweightSegmentationClassifier = {
  schemaVersion: 'lightweight-segmentation-classifier-v0.1',
  modelId: 'model-export-source-readiness',
  modelVersion: 'v0',
  classifierKind: 'nearest-centroid',
  sourceDatasetId: 'dataset',
  sourcePackageId: 'package',
  trainedRegions: ['lips'],
  featureConfig: { featureNames: ['r'], alphaPositiveThreshold: 0.5, alphaNegativeThreshold: 0.1, featureStride: 1 },
  regionClassifiers: {
    lips: {
      regionId: 'lips',
      positiveCentroid: [1],
      negativeCentroid: [0],
      featureWeights: [1],
      bias: 0,
      threshold: 0.5,
      positiveSampleCount: 1,
      negativeSampleCount: 1,
      qualityWeightedSampleCount: 1,
      featureNames: ['r'],
      warnings: [],
    },
  },
  trainingSummary: { sampleCount: 1, positivePixelCount: 1, negativePixelCount: 1, featureCount: 1, warnings: [] },
  evaluationSummary: { readinessStatus: 'evaluated-lightweight-classifier', sampleCount: 1, perRegion: {} },
  readinessStatus: 'trained-lightweight-classifier',
  artifactChecksum: 'abc',
  createdAt: '2026-05-30T00:00:00.000Z',
};

describe('export package source image readiness', () => {
  it('includes real photo import and codec readiness fields', () => {
    expect(createExportReadyModelPackage({ model, targets: ['typescript-provider'] }).sourceImageReadiness?.jpegBoundaryStatus).toBe('metadata-only');
    expect(createExportPreparationManifest({ model, targets: ['typescript-provider'] }).sourceImageCodecReadiness).toBe('ready');
  });
});
