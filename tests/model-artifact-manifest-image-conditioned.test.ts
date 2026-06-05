import { describe, expect, it } from 'vitest';
import { createDefaultTrainerConfig } from '../src/training/config';
import { createImageConditionedModelArtifactManifest } from '../src/training/artifacts';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned model artifact manifest', () => {
  it('contains image-conditioned model JSON entries and lineage', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const config = createDefaultTrainerConfig();
    const model = trainImageConditionedSegmentationModel({ dataset, config, imagePixelsByImageId: await loadPixelFixtureMap(), regions: ['lips'] });
    const manifest = createImageConditionedModelArtifactManifest({ model, config, createdAt: model.createdAt });
    expect(manifest.artifactEntries[0].format).toBe('image-conditioned-pixel-prior-json');
    expect(manifest.readinessStatus.status).toBe('trained-image-conditioned-baseline');
  });
});
