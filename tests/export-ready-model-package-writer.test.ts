import { describe, expect, it } from 'vitest';
import {
  createExportReadyModelPackage,
  summarizeExportReadyModelPackage,
  validateExportReadyModelPackage,
  writeExportReadyModelPackage,
} from '../src/training/export';
import type { LightweightSegmentationClassifier } from '../src/training/schema';

const model: LightweightSegmentationClassifier = {
  modelId: 'lightweight-model-a',
  modelVersion: 'v0',
  schemaVersion: 'lightweight-classifier-v0.1',
  classifierKind: 'nearest-centroid',
  createdAt: '2026-05-30T00:00:00.000Z',
  sourceDatasetId: 'dataset-a',
  sourcePackageId: 'package-a',
  trainingRunId: 'run-a',
  trainerConfigVersion: 'trainer-config-v0.1',
  trainedRegions: ['lips'],
  featureConfig: { featureStride: 1, alphaPositiveThreshold: 0.4, alphaNegativeThreshold: 0.05, featureNames: ['r', 'g', 'b'] },
  regionClassifiers: {},
  trainingSummary: { sampleCount: 1, trainedRegionCount: 1, positivePixelCount: 4, negativePixelCount: 5, classifierKind: 'nearest-centroid', warnings: [] },
  evaluationSummary: { evaluatedSampleCount: 1, evaluatedRegionCount: 1, meanHardIoU: 0, meanDice: 0, meanPixelF1: 0, readinessStatus: 'trained-lightweight-classifier' },
  readinessStatus: 'trained-lightweight-classifier',
  artifactChecksum: 'model-checksum',
};

describe('export-ready model package writer', () => {
  it('creates and writes deterministic export package records', async () => {
    const pkg = createExportReadyModelPackage({ model, targets: ['browser-provider', 'onnx-placeholder'] });
    expect(validateExportReadyModelPackage(pkg)).toEqual([]);
    expect(summarizeExportReadyModelPackage(pkg)).toContain('export-package');
    const writes: string[] = [];
    await writeExportReadyModelPackage({
      outDir: 'out',
      model,
      targets: ['typescript-provider'],
      adapter: {
        mkdirp: async () => undefined,
        writeFile: async (filePath) => {
          writes.push(filePath);
        },
      },
    });
    expect(writes).toContain('out/export-preparation-manifest.json');
  });
});
