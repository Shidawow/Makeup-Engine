import { execFile } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { pixelFixtureDatasetRoot } from './baselineTestUtils';

const execFileAsync = promisify(execFile);

describe('train-image-conditioned-segmentation CLI', () => {
  it('prints help', async () => {
    const { stdout } = await execFileAsync('node', ['scripts/train-image-conditioned-segmentation.mjs', '--help']);
    expect(stdout).toContain('train-image-conditioned-segmentation.mjs');
  });

  it('supports dry-run without writing files', async () => {
    const { stdout } = await execFileAsync('node', [
      'scripts/train-image-conditioned-segmentation.mjs',
      '--dataset',
      pixelFixtureDatasetRoot,
      '--regions',
      'lips,blush,eyeshadow',
      '--dry-run',
      '--json',
    ]);
    const result = JSON.parse(stdout) as { dryRun: boolean; outputs: string[]; pixelArtifactCount: number };
    expect(result.dryRun).toBe(true);
    expect(result.outputs).toEqual([]);
    expect(result.pixelArtifactCount).toBe(3);
  });

  it('trains and writes image-conditioned model artifacts', async () => {
    const outDir = await mkdtemp(path.join(os.tmpdir(), 'image-conditioned-model-'));
    const { stdout } = await execFileAsync('node', [
      'scripts/train-image-conditioned-segmentation.mjs',
      '--dataset',
      pixelFixtureDatasetRoot,
      '--regions',
      'lips,blush,eyeshadow',
      '--out',
      outDir,
      '--evaluate',
      '--strict',
      '--json',
    ]);
    const result = JSON.parse(stdout) as { outputs: string[]; readiness: string };
    const model = JSON.parse(await readFile(path.join(outDir, 'model.json'), 'utf8')) as { artifactChecksum: string };
    expect(result.outputs).toEqual(['model.json', 'model-artifact-manifest.json', 'evaluation-report.json', 'training-run-package.json', 'trainer-config.json', 'failed-samples.json']);
    expect(result.readiness).toBe('pass');
    expect(model.artifactChecksum).toMatch(/^[0-9a-f]{8}$/);
  });
});
