import { describe, expect, it } from 'vitest';
import { exportImageConditionedModelJson, validateImageConditionedModelArtifact, writeImageConditionedSegmentationModel } from '../src/training/artifacts';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainImageConditionedSegmentationModel } from '../src/training/trainers';
import { createFixtureReader, loadPixelFixtureMap } from './baselineTestUtils';

describe('image-conditioned model artifact writer', () => {
  it('writes deterministic model JSON through an adapter', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainImageConditionedSegmentationModel({ dataset, imagePixelsByImageId: await loadPixelFixtureMap(), regions: ['lips'] });
    const files = new Map<string, string>();
    const artifact = await writeImageConditionedSegmentationModel({
      outDir: 'models/image-conditioned',
      model,
      adapter: {
        mkdirp: async () => undefined,
        writeFile: async (filePath, content) => files.set(filePath, content),
      },
    });
    expect(validateImageConditionedModelArtifact(model).valid).toBe(true);
    expect(artifact.relativePath).toBe('model.json');
    expect(files.get('models/image-conditioned/model.json')).toBe(`${exportImageConditionedModelJson(model)}\n`);
  });
});
