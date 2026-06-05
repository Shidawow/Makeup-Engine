import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/train-lightweight-segmentation.mjs');
const dataset = path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample');

describe('train-lightweight-segmentation CLI', () => {
  it('prints help', async () => {
    const { stdout } = await exec(process.execPath, [script, '--help']);
    expect(stdout).toContain('train-lightweight-segmentation');
  });

  it('dry-runs nearest-centroid without writing files', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'lightweight-dry-run-'));
    try {
      const { stdout } = await exec(process.execPath, [
        script,
        '--dataset',
        dataset,
        '--regions',
        'lips,blush,eyeshadow',
        '--classifier',
        'nearest-centroid',
        '--dry-run',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { dryRun: boolean; trainedRegions: string[] };
      expect(result.dryRun).toBe(true);
      expect(result.trainedRegions).toEqual(['blush', 'eyeshadow', 'lips']);
      await expect(readFile(path.join(out, 'model.json'), 'utf8')).rejects.toThrow();
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });

  it('writes nearest-centroid and logistic-linear model packages', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'lightweight-train-'));
    const logisticOut = await mkdtemp(path.join(tmpdir(), 'lightweight-logistic-'));
    try {
      for (const [classifier, target] of [['nearest-centroid', out], ['logistic-linear', logisticOut]] as const) {
        const { stdout } = await exec(process.execPath, [
          script,
          '--dataset',
          dataset,
          '--regions',
          'lips,blush,eyeshadow',
          '--classifier',
          classifier,
          '--out',
          target,
          '--evaluate',
          '--strict',
          '--json',
        ]);
        expect(JSON.parse(stdout).outputs).toContain('model.json');
        await expect(readFile(path.join(target, 'model.json'), 'utf8')).resolves.toContain('lightweight-classifier-v0.1');
        await expect(readFile(path.join(target, 'model-artifact-manifest.json'), 'utf8')).resolves.toContain('lightweight-classifier');
        await expect(readFile(path.join(target, 'evaluation-report.json'), 'utf8')).resolves.toContain('lightweightClassifierEvaluation');
        await expect(readFile(path.join(target, 'training-run-package.json'), 'utf8')).resolves.toContain('lightweight-classifier-trained');
        await expect(readFile(path.join(target, 'trainer-config.json'), 'utf8')).resolves.toBeDefined();
        await expect(readFile(path.join(target, 'failed-samples.json'), 'utf8')).resolves.toContain('failedSamples');
      }
    } finally {
      await rm(out, { recursive: true, force: true });
      await rm(logisticOut, { recursive: true, force: true });
    }
  });
});
