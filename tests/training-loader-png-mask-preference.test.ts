import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('training loader PNG mask preference', () => {
  it('uses png-alpha-mask when materialized PNG masks are available', async () => {
    const datasetOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-png-dataset-'));
    const modelOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-png-model-'));
    try {
      await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--fixture',
        path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
        '--mask-codec',
        'png',
        '--materialize-png-masks',
        '--write-artifact-manifest',
        '--write-codec-sidecars',
        '--validate-codec-roundtrip',
        '--out',
        datasetOut,
        '--json',
      ]);
      const { stdout } = await exec(process.execPath, [
        path.resolve('scripts/train-lightweight-segmentation.mjs'),
        '--dataset',
        datasetOut,
        '--config',
        path.resolve('tests/fixtures/trainer-config.realistic-synthetic.lightweight.json'),
        '--regions',
        'lips,blush,eyeshadow,eyeliner,contour,highlight',
        '--classifier',
        'nearest-centroid',
        '--mask-format-preference',
        'png,binary,json',
        '--out',
        modelOut,
        '--evaluate',
        '--strict',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { actualMaskArtifactFormats: string[]; readiness: string };
      expect(result.actualMaskArtifactFormats).toContain('png-alpha-mask');
      expect(result.readiness).toBe('pass');
    } finally {
      await rm(datasetOut, { force: true, recursive: true });
      await rm(modelOut, { force: true, recursive: true });
    }
  }, 20000);
});
