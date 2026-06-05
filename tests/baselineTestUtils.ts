import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeImagePixelData } from '../src/training/artifacts';
import type { ImagePixelArtifact, ImagePixelData } from '../src/training/schema';
import type { TrainingDatasetFileReader } from '../src/training/loaders';

export const fixtureDatasetRoot = path.resolve(
  'tests/fixtures/materialized-dataset.sample',
);

export const pixelFixtureDatasetRoot = path.resolve(
  'tests/fixtures/materialized-dataset-with-pixels.sample',
);

export const createFixtureReader = (): TrainingDatasetFileReader => ({
  readText: async (relativePath: string) =>
    readFile(path.join(fixtureDatasetRoot, ...relativePath.split('/')), 'utf8'),
  exists: async (relativePath: string) => {
    try {
      await access(path.join(fixtureDatasetRoot, ...relativePath.split('/')));
      return true;
    } catch {
      return false;
    }
  },
});

export const loadPixelFixtureMap = async (): Promise<Map<string, ImagePixelData>> => {
  const imageIds = ['image-train', 'image-validation', 'image-test'];
  const entries = await Promise.all(
    imageIds.map(async (imageId) => {
      const artifact = JSON.parse(
        await readFile(
          path.join(pixelFixtureDatasetRoot, 'image-pixels', `${imageId}.rgba.json`),
          'utf8',
        ),
      ) as ImagePixelArtifact;
      return [imageId, normalizeImagePixelData(artifact)] as const;
    }),
  );
  return new Map(entries);
};
