import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('training loader PNG image preference', () => {
  it('uses png-image when materialized PNG images are available', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'me-png-image-loader-'));
    try {
      await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
        '--codec', 'png',
        '--mask-codec', 'png',
        '--materialize-png-images',
        '--materialize-png-masks',
        '--write-artifact-manifest',
        '--write-codec-sidecars',
        '--out', out,
        '--json',
      ]);
      const trained = await exec(process.execPath, [
        path.resolve('scripts/train-lightweight-segmentation.mjs'),
        '--dataset', out,
        '--regions', 'lips,blush,eyeshadow',
        '--classifier', 'nearest-centroid',
        '--image-format-preference', 'png,raw,json',
        '--mask-format-preference', 'png,binary,json',
        '--dry-run',
        '--json',
      ]);
      const result = JSON.parse(trained.stdout);
      expect(result.actualImageArtifactFormats).toContain('png-image');
      expect(result.actualMaskArtifactFormats).toContain('png-alpha-mask');
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  }, 20000);
});
