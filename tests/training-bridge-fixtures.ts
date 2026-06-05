import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TrainingDatasetFileReader } from '../src/training';

export const materializedFixtureRoot = join(
  'tests',
  'fixtures',
  'materialized-dataset.sample',
);

export const fixtureReader = (
  root = materializedFixtureRoot,
): TrainingDatasetFileReader => ({
  readText: async (relativePath: string) =>
    readFileSync(join(root, ...relativePath.split('/')), 'utf8'),
  exists: async (relativePath: string) =>
    existsSync(join(root, ...relativePath.split('/'))),
});
