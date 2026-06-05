import { describe, expect, it } from 'vitest';
import {
  exportBaselineModelJson,
  validateBaselineModelArtifact,
  writeBaselineSegmentationModel,
} from '../src/training/artifacts';
import { loadMaterializedDataset } from '../src/training/loaders';
import { trainBaselineSegmentationModel } from '../src/training/trainers';
import { createFixtureReader } from './baselineTestUtils';

describe('baseline model artifact writer', () => {
  it('writes deterministic model.json content through an adapter', async () => {
    const dataset = await loadMaterializedDataset({ reader: createFixtureReader() });
    const model = trainBaselineSegmentationModel({
      dataset,
      regions: ['lips', 'blush', 'eyeshadow'],
    });
    const files = new Map<string, string>();
    const artifact = await writeBaselineSegmentationModel({
      outDir: 'models/baseline',
      model,
      adapter: {
        mkdirp: async () => undefined,
        writeFile: async (filePath, content) => {
          files.set(filePath, content);
        },
      },
    });

    expect(validateBaselineModelArtifact(model).valid).toBe(true);
    expect(artifact.relativePath).toBe('model.json');
    expect(files.get('models/baseline/model.json')).toBe(`${exportBaselineModelJson(model)}\n`);
  });
});
