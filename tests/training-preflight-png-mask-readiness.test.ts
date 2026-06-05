import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('training preflight PNG mask readiness', () => {
  it('reports PNG mask sidecar and round-trip readiness', async () => {
    const datasetOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-preflight-png-'));
    try {
      await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
        '--mask-codec', 'png',
        '--materialize-png-masks',
        '--write-artifact-manifest',
        '--write-codec-sidecars',
        '--validate-codec-roundtrip',
        '--out', datasetOut,
        '--json',
      ]);
      const { stdout } = await exec(process.execPath, [
        path.resolve('scripts/training-preflight.mjs'),
        '--dataset', datasetOut,
        '--json',
      ]);
      const result = JSON.parse(stdout) as {
        pngMaskCodecReadiness: {
          pngAlphaMaskCodecReady: boolean;
          pngMaskSidecarReady: boolean;
          pngMaskRoundTripReady: boolean;
        };
      };
      expect(result.pngMaskCodecReadiness.pngAlphaMaskCodecReady).toBe(true);
      expect(result.pngMaskCodecReadiness.pngMaskSidecarReady).toBe(true);
      expect(result.pngMaskCodecReadiness.pngMaskRoundTripReady).toBe(true);
    } finally {
      await rm(datasetOut, { force: true, recursive: true });
    }
  }, 15000);
});
