import { describe, expect, it } from 'vitest';
import { createBaselineModelArtifactManifest, validateModelArtifactManifest } from '../src/training/artifacts';
import { createDefaultTrainerConfig } from '../src/training/config';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

describe('baseline model artifact manifest', () => {
  it('contains baseline model.json artifact entries', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const config = createDefaultTrainerConfig();
    const model = trainBaselineSegmentationModel({
      dataset,
      config,
      regions: ['lips', 'blush', 'eyeshadow'],
    });
    const manifest = createBaselineModelArtifactManifest({
      model,
      config,
      createdAt: model.createdAt,
    });

    expect(manifest.artifactEntries[0].format).toBe('baseline-mask-prior-json');
    expect(validateModelArtifactManifest(manifest).valid).toBe(true);
  });
});
