import { describe, expect, it } from 'vitest';
import {
  createDefaultTrainerConfig,
  createModelArtifactManifestPlaceholder,
  exportModelArtifactManifestJson,
  loadMaterializedDataset,
  summarizeModelArtifactManifest,
  validateModelArtifactManifest,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('model artifact manifest placeholder', () => {
  it('creates deterministic placeholder model lineage', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const manifest = createModelArtifactManifestPlaceholder({
      dataset,
      config: createDefaultTrainerConfig(),
      trainingRunId: 'training-run-test',
      createdAt: '2026-05-30T00:00:00.000Z',
    });

    expect(manifest.readinessStatus.status).toBe('placeholder');
    expect(validateModelArtifactManifest(manifest).valid).toBe(true);
    expect(summarizeModelArtifactManifest(manifest)).toContain('dry-run');
    expect(exportModelArtifactManifestJson(manifest)).toContain(
      'model-artifact-manifest-v0.1',
    );
  });
});
