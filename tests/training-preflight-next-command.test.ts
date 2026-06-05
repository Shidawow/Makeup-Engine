import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { fixtureDatasetRoot } from './baselineTestUtils';

const execFileAsync = promisify(execFile);

describe('training preflight next command', () => {
  it('prints a baseline training command when preflight has no blocking errors', async () => {
    const { stdout } = await execFileAsync('node', [
      'scripts/training-preflight.mjs',
      '--dataset',
      fixtureDatasetRoot,
      '--runtime',
      'dry-run',
      '--json',
    ]);
    const result = JSON.parse(stdout) as {
      nextBaselineTrainingCommand: string | null;
      regionCoverageGuidance: string | null;
    };

    expect(result.nextBaselineTrainingCommand).toContain(
      'scripts/train-baseline-segmentation.mjs',
    );
    expect(result.regionCoverageGuidance).toContain('Coverage warnings');
  });
});
