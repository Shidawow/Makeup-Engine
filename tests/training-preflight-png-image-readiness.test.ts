import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('training preflight PNG image readiness', () => {
  it('reports PNG image artifact and decode readiness', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'me-png-image-preflight-'));
    try {
      await exec(process.execPath, [path.resolve('scripts/build-training-dataset.mjs'), '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'), '--codec', 'png', '--mask-codec', 'png', '--materialize-png-images', '--materialize-png-masks', '--write-artifact-manifest', '--write-codec-sidecars', '--out', out, '--json']);
      const preflight = await exec(process.execPath, [path.resolve('scripts/training-preflight.mjs'), '--dataset', out, '--json']);
      const result = JSON.parse(preflight.stdout);
      expect(result.phase6fReadiness.pngImageCodecReady).toBe(true);
      expect(result.phase6fReadiness.pngImageDecodeReady).toBe(true);
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  }, 15000);
});
