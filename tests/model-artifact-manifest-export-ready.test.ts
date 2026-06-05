import { describe, expect, it } from 'vitest';
import { attachExportReadyReferencesToModelManifest } from '../src/training/artifacts';
import type { ModelArtifactManifest } from '../src/training/schema';

describe('model artifact manifest export-ready references', () => {
  it('attaches export package and provider references', () => {
    const manifest: ModelArtifactManifest = {
      schemaVersion: 'model-artifact-manifest-v0.1',
      modelId: 'model-a',
      modelVersion: 'v1',
      trainingRunId: 'run-a',
      sourceDatasetId: 'dataset-a',
      sourcePackageId: 'package-a',
      trainerConfigVersion: 'trainer-config-v0.1',
      runtimeKind: 'dry-run',
      artifactEntries: [{ artifactId: 'model-json', format: 'lightweight-classifier-json', referenceUri: 'model.json', checksum: 'abc', byteSize: 1 }],
      metricsReference: 'evaluation-report.json',
      evaluationReportReference: 'evaluation-report.json',
      createdAt: '2026-05-30T00:00:00.000Z',
      readinessStatus: { status: 'placeholder', reasons: [] },
      lineage: { sourceDatasetId: 'dataset-a', sourcePackageId: 'package-a', trainingRunId: 'run-a', trainerConfigVersion: 'trainer-config-v0.1', runtimeKind: 'dry-run' },
    };
    const upgraded = attachExportReadyReferencesToModelManifest({
      manifest,
      exportPackageReference: 'export-package.json',
      providerSpecReference: 'provider-spec.json',
      runtimeCompatibilityReference: 'runtime-compatibility.json',
      exportPreparationReference: 'export-preparation-manifest.json',
    });
    expect(upgraded.exportPackageReference).toBe('export-package.json');
    expect(upgraded.readinessStatus.status).toBe('export-preparation-only');
  });
});
