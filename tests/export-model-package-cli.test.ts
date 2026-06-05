import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const trainScript = path.resolve('scripts/train-lightweight-segmentation.mjs');
const exportScript = path.resolve('scripts/export-model-package.mjs');
const dataset = path.resolve('tests/fixtures/materialized-dataset-full-regions.sample');

describe('export-model-package CLI', () => {
  it('prints help', async () => {
    const { stdout } = await exec(process.execPath, [exportScript, '--help']);
    expect(stdout).toContain('export-model-package');
  });

  it('exports a trained lightweight model package', async () => {
    const modelOut = await mkdtemp(path.join(tmpdir(), 'full-region-model-'));
    const exportOut = await mkdtemp(path.join(tmpdir(), 'export-ready-model-'));
    try {
      await exec(process.execPath, [
        trainScript,
        '--dataset',
        dataset,
        '--config',
        path.resolve('tests/fixtures/trainer-config.full-regions.lightweight.json'),
        '--regions',
        'lips,blush,eyeshadow,eyeliner,contour,highlight',
        '--classifier',
        'nearest-centroid',
        '--out',
        modelOut,
        '--evaluate',
        '--strict',
        '--json',
      ]);
      const { stdout } = await exec(process.execPath, [
        exportScript,
        '--model',
        path.join(modelOut, 'model.json'),
        '--manifest',
        path.join(modelOut, 'model-artifact-manifest.json'),
        '--evaluation',
        path.join(modelOut, 'evaluation-report.json'),
        '--out',
        exportOut,
        '--target',
        'typescript-provider,browser-provider,onnx-placeholder,webgpu-placeholder',
        '--strict',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { outputs: string[]; providerCompatibility: { compatible: boolean } };
      expect(result.providerCompatibility.compatible).toBe(true);
      expect(result.outputs).toContain('export-package.json');
      await expect(readFile(path.join(exportOut, 'export-preparation-manifest.json'), 'utf8')).resolves.toContain('onnx-export-not-implemented');
    } finally {
      await rm(modelOut, { recursive: true, force: true });
      await rm(exportOut, { recursive: true, force: true });
    }
  });
});
