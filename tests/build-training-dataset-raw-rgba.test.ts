import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/build-training-dataset.mjs');

describe('build-training-dataset raw RGBA fixture mode', () => {
  it('dry-runs raw RGBA and artifact manifest readiness', async () => {
    const { stdout } = await exec(process.execPath, [
      script,
      '--fixture',
      path.resolve('tests/fixtures/materialized-dataset-with-pixels.sample'),
      '--materialize-raw-rgba',
      '--write-artifact-manifest',
      '--validate-strict-alignment',
      '--dry-run',
      '--json',
    ]);
    const result = JSON.parse(stdout) as { rawRgbaReadiness: string; artifactManifestReadiness: string; strictAlignmentReadiness: string };
    expect(result.rawRgbaReadiness).toBe('ready');
    expect(result.artifactManifestReadiness).toBe('ready');
    expect(result.strictAlignmentReadiness).toBe('pass');
  });
});
