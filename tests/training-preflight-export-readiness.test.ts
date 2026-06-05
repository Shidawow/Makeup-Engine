import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/training-preflight.mjs');

describe('training preflight export readiness', () => {
  it('reports Phase 6F readiness fields and next export command', async () => {
    const { stdout } = await exec(process.execPath, [
      script,
      '--dataset',
      path.resolve('tests/fixtures/materialized-dataset-full-regions.sample'),
      '--runtime',
      'dry-run',
      '--json',
    ]);
    const result = JSON.parse(stdout) as {
      phase6fReadiness: { fullRegionCoverageReady: boolean; exportPackageReady: boolean };
      nextExportModelPackageCommand: string | null;
    };
    expect(result.phase6fReadiness.fullRegionCoverageReady).toBe(true);
    expect(result.phase6fReadiness.exportPackageReady).toBe(true);
    expect(result.nextExportModelPackageCommand).toContain('export-model-package');
  });
});
