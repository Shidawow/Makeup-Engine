import { execFile } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { fixtureDatasetRoot } from './baselineTestUtils';

const execFileAsync = promisify(execFile);

describe('train-baseline-segmentation CLI', () => {
  it('prints help', async () => {
    const { stdout } = await execFileAsync('node', [
      'scripts/train-baseline-segmentation.mjs',
      '--help',
    ]);

    expect(stdout).toContain('train-baseline-segmentation.mjs');
    expect(stdout).toContain('--dry-run');
  });

  it('supports dry-run without writing files', async () => {
    const { stdout } = await execFileAsync('node', [
      'scripts/train-baseline-segmentation.mjs',
      '--dataset',
      fixtureDatasetRoot,
      '--regions',
      'lips,blush,eyeshadow',
      '--dry-run',
      '--json',
    ]);
    const result = JSON.parse(stdout) as { dryRun: boolean; outputs: string[] };

    expect(result.dryRun).toBe(true);
    expect(result.outputs).toEqual([]);
  });

  it('trains and writes model artifacts deterministically', async () => {
    const outDir = await mkdtemp(path.join(os.tmpdir(), 'baseline-model-'));
    const { stdout } = await execFileAsync('node', [
      'scripts/train-baseline-segmentation.mjs',
      '--dataset',
      fixtureDatasetRoot,
      '--regions',
      'lips,blush,eyeshadow',
      '--out',
      outDir,
      '--evaluate',
      '--strict',
      '--json',
    ]);
    const result = JSON.parse(stdout) as { outputs: string[]; readiness: string };
    const model = JSON.parse(await readFile(path.join(outDir, 'model.json'), 'utf8')) as {
      artifactChecksum: string;
      readinessStatus: string;
    };

    expect(result.outputs).toEqual([
      'model.json',
      'model-artifact-manifest.json',
      'evaluation-report.json',
      'training-run-package.json',
      'trainer-config.json',
      'failed-samples.json',
    ]);
    expect(result.readiness).toBe('pass');
    expect(model.artifactChecksum).toMatch(/^[0-9a-f]{8}$/);
    expect(model.readinessStatus).toBe('evaluated-baseline');
  });
});
