import { describe, expect, it } from 'vitest';
import { attachExportReadyReferencesToModelManifest } from '../src/training/artifacts';

describe('model artifact manifest codec and ONNX references', () => {
  it('attaches runtime smoke and ONNX prototype references', () => {
    const manifest = attachExportReadyReferencesToModelManifest({
      manifest: {
        schemaVersion: 'model-artifact-manifest-v0.1',
        modelId: 'model-a',
        modelVersion: 'v1',
        trainingRunId: 'run-a',
        sourceDatasetId: 'dataset-a',
        sourcePackageId: 'package-a',
        trainerConfigVersion: 'trainer-config-v0.1',
        runtimeKind: 'dry-run',
        artifactEntries: [{ artifactId: 'a', format: 'lightweight-classifier-json', referenceUri: 'model.json', checksum: 'abc', byteSize: 1 }],
        metricsReference: 'evaluation-report.json',
        evaluationReportReference: 'evaluation-report.json',
        createdAt: '2026-05-30T00:00:00.000Z',
        readinessStatus: { status: 'trained-lightweight-classifier', reasons: [] },
        lineage: { sourceDatasetId: 'dataset-a', sourcePackageId: 'package-a', trainingRunId: 'run-a', trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run' },
      },
      exportPackageReference: 'export-package.json',
      providerSpecReference: 'provider-spec.json',
      runtimeCompatibilityReference: 'runtime-compatibility.json',
      exportPreparationReference: 'export-preparation-manifest.json',
      runtimeSmokeReportReference: 'runtime-smoke-report.json',
      onnxPrototypeReference: 'onnx-prototype/onnx-prototype.json',
      onnxPrototypeManifestReference: 'onnx-prototype/onnx-prototype-manifest.json',
      tensorSpecReference: 'onnx-prototype/tensor-spec.json',
    });
    expect(manifest.runtimeSmokeReportReference).toBe('runtime-smoke-report.json');
    expect(manifest.onnxPrototypeReference).toContain('onnx-prototype');
  });
});
