import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/training-preflight.mjs');

describe('training preflight codec and ONNX readiness', () => {
  it('prints codec, smoke, and ONNX readiness fields', async () => {
    const { stdout } = await exec(process.execPath, [
      script,
      '--dataset',
      path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
      '--json',
    ]);
    const result = JSON.parse(stdout) as { phase6fReadiness: { realisticSyntheticFixtureReady: boolean; onnxExportPreparation: string; exportRuntimeSmokeReady: boolean }; nextExportModelPackageCommand: string };
    expect(result.phase6fReadiness.realisticSyntheticFixtureReady).toBe(true);
    expect(result.phase6fReadiness.onnxExportPreparation).toBe('preparation-only');
    expect(result.nextExportModelPackageCommand).toContain('--include-onnx-prototype');
  });
});
