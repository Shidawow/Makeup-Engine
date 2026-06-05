import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('export package codec readiness', () => {
  it('reports PNG alpha mask support in export package output', async () => {
    const datasetOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-export-dataset-'));
    const modelOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-export-model-'));
    const exportOut = await mkdtemp(path.join(os.tmpdir(), 'makeup-export-package-'));
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
      await exec(process.execPath, [
        path.resolve('scripts/train-lightweight-segmentation.mjs'),
        '--dataset', datasetOut,
        '--regions', 'lips,blush,eyeshadow,eyeliner,contour,highlight',
        '--classifier', 'nearest-centroid',
        '--mask-format-preference', 'png,binary,json',
        '--out', modelOut,
        '--evaluate',
        '--strict',
        '--json',
      ]);
      const { stdout } = await exec(process.execPath, [
        path.resolve('scripts/export-model-package.mjs'),
        '--model', path.join(modelOut, 'model.json'),
        '--manifest', path.join(modelOut, 'model-artifact-manifest.json'),
        '--evaluation', path.join(modelOut, 'evaluation-report.json'),
        '--out', exportOut,
        '--target', 'typescript-provider,browser-provider,onnx-placeholder,webgpu-placeholder',
        '--include-runtime-smoke',
        '--include-onnx-prototype',
        '--strict',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { codecReadiness: { pngAlphaMaskSupport: boolean; preferredMaskArtifactFormat: string }; readiness: string };
      expect(result.codecReadiness.pngAlphaMaskSupport).toBe(true);
      expect(result.codecReadiness.preferredMaskArtifactFormat).toBe('png-alpha-mask');
      expect(result.readiness).toBe('pass');
    } finally {
      await rm(datasetOut, { force: true, recursive: true });
      await rm(modelOut, { force: true, recursive: true });
      await rm(exportOut, { force: true, recursive: true });
    }
  }, 20000);
});
