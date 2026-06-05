import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('export package image codec readiness', () => {
  it('reports PNG image codec support in export package output', async () => {
    const dataset = await mkdtemp(path.join(tmpdir(), 'me-png-image-export-dataset-'));
    const modelOut = await mkdtemp(path.join(tmpdir(), 'me-png-image-export-model-'));
    try {
      await exec(process.execPath, [path.resolve('scripts/build-training-dataset.mjs'), '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'), '--codec', 'png', '--mask-codec', 'png', '--materialize-png-images', '--materialize-png-masks', '--write-artifact-manifest', '--write-codec-sidecars', '--out', dataset, '--json']);
      await exec(process.execPath, [path.resolve('scripts/train-lightweight-segmentation.mjs'), '--dataset', dataset, '--regions', 'lips,blush,eyeshadow', '--classifier', 'nearest-centroid', '--image-format-preference', 'png,raw,json', '--mask-format-preference', 'png,binary,json', '--out', modelOut, '--evaluate', '--json']);
      const exported = await exec(process.execPath, [path.resolve('scripts/export-model-package.mjs'), '--model', path.join(modelOut, 'model.json'), '--manifest', path.join(modelOut, 'model-artifact-manifest.json'), '--evaluation', path.join(modelOut, 'evaluation-report.json'), '--out', path.join(modelOut, 'export'), '--codec-preference', 'png,raw,json', '--mask-preference', 'png,binary,json', '--dry-run', '--json']);
      const result = JSON.parse(exported.stdout);
      expect(result.codecReadiness.imageCodecReadiness).toBe('ready');
      expect(result.codecReadiness.supportedImageArtifactFormats).toContain('png-image');
    } finally {
      await rm(dataset, { recursive: true, force: true });
      await rm(modelOut, { recursive: true, force: true });
    }
  });
});
