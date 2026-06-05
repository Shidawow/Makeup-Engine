import { execFile } from 'node:child_process';
import { access, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('build-training-dataset PNG image CLI', () => {
  it('dry-runs and writes real PNG image artifacts with sidecars', async () => {
    const script = path.resolve('scripts/build-training-dataset.mjs');
    const fixture = path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample');
    const dryRun = await exec(process.execPath, [script, '--fixture', fixture, '--codec', 'png', '--materialize-png-images', '--write-artifact-manifest', '--write-codec-sidecars', '--validate-codec-roundtrip', '--dry-run', '--json']);
    const dryRunResult = JSON.parse(dryRun.stdout);
    expect(dryRunResult.pngImageCodecReadiness).toBe('ready');
    expect(dryRunResult.pngImageDecodeReadiness).toBe('pass');
    const out = await mkdtemp(path.join(tmpdir(), 'me-png-image-cli-'));
    try {
      await exec(process.execPath, [script, '--fixture', fixture, '--codec', 'png', '--materialize-png-images', '--write-artifact-manifest', '--write-codec-sidecars', '--out', out, '--json']);
      await expect(access(path.join(out, 'images-png/image-train.png'))).resolves.toBeUndefined();
      await expect(access(path.join(out, 'images-png/image-train.png.meta.json'))).resolves.toBeUndefined();
      await expect(access(path.join(out, 'image-codec-report.json'))).resolves.toBeUndefined();
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
