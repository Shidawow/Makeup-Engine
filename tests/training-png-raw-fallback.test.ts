import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/build-training-dataset.mjs');

describe('training codec fallback', () => {
  it('reports PNG mask readiness and raw fallback readiness in fixture dry-run', async () => {
    const png = await exec(process.execPath, [script, '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'), '--codec', 'png', '--mask-codec', 'png', '--materialize-png-images', '--materialize-png-masks', '--write-artifact-manifest', '--write-codec-sidecars', '--validate-codec-roundtrip', '--dry-run', '--json']);
    const pngResult = JSON.parse(png.stdout) as { pngImageCodecReadiness: string; pngImageDecodeReadiness: string; pngMaskCodecReadiness: string; roundTripReadiness: string };
    expect(pngResult.pngImageCodecReadiness).toBe('ready');
    expect(pngResult.pngImageDecodeReadiness).toBe('pass');
    expect(pngResult.pngMaskCodecReadiness).toBe('ready');
    expect(pngResult.roundTripReadiness).toBe('pass');
    const raw = await exec(process.execPath, [script, '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'), '--codec', 'raw', '--mask-codec', 'binary', '--materialize-raw-rgba', '--materialize-binary-masks', '--write-artifact-manifest', '--validate-strict-alignment', '--json']);
    expect(JSON.parse(raw.stdout).rawRgbaReadiness).toBe('ready');
  });
});
