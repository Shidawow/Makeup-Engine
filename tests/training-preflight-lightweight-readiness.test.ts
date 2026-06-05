import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('training preflight lightweight readiness', () => {
  it('prints lightweight next command in json output', async () => {
    const { stdout } = await exec(process.execPath, [
      path.resolve('scripts/training-preflight.mjs'),
      '--dataset',
      path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample'),
      '--classifier',
      'nearest-centroid',
      '--json',
    ]);
    const result = JSON.parse(stdout) as {
      nextLightweightTrainingCommand: string | null;
      lightweightReadiness: { featureCoverage: number };
    };
    expect(result.nextLightweightTrainingCommand).toContain('train-lightweight-segmentation');
    expect(result.lightweightReadiness.featureCoverage).toBeGreaterThan(0);
  });
});
