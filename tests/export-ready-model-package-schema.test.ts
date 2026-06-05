import { describe, expect, it } from 'vitest';
import type { ExportReadyModelPackage } from '../src/training/schema';

describe('export-ready model package schema', () => {
  it('supports lightweight classifier provider package metadata', () => {
    const pkg: ExportReadyModelPackage = {
      schemaVersion: 'export-ready-model-package-v0.1',
      packageId: 'pkg-a',
      packageVersion: 'v1',
      sourceModelId: 'model-a',
      sourceModelVersion: 'v1',
      modelKind: 'lightweight-segmentation-classifier',
      classifierKind: 'nearest-centroid',
      artifactFormat: 'lightweight-classifier-json',
      inputSpec: { requiresPixelData: true, pixelFormat: 'json-rgba-grid', featureNames: ['r'] },
      outputSpec: { outputType: 'CosmeticSegmentationMask', alphaFormat: 'float-alpha-grid', coordinateSpace: 'normalized-image' },
      featureSpec: { featureNames: ['r'] },
      regionSpec: { trainedRegions: ['lips'] },
      runtimeCompatibility: [{ target: 'typescript-provider', supported: true, notes: [] }],
      providerCompatibility: { providerId: 'lightweight-classifier', compatible: true, supportedRegions: ['lips'], fallbackPolicy: 'polygon-refinement', issues: [] },
      lineage: { sourceDatasetId: 'dataset-a', sourcePackageId: 'package-a', trainingRunId: 'run-a', sourceModelId: 'model-a' },
      checksums: { 'model.json': 'abc' },
      readinessStatus: 'export-ready-typescript-provider',
      createdAt: '2026-05-30T00:00:00.000Z',
    };
    expect(pkg.inputSpec.requiresPixelData).toBe(true);
  });
});
