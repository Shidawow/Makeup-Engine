import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);
const script = path.resolve('scripts/build-training-dataset.mjs');
const fixture = path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample');

describe('build-training-dataset codec CLI', () => {
  it('reports PNG image and mask ready plus raw fallback pass', async () => {
    const { stdout: pngStdout } = await exec(process.execPath, [script, '--fixture', fixture, '--codec', 'png', '--mask-codec', 'png', '--materialize-png-images', '--materialize-png-masks', '--write-artifact-manifest', '--write-codec-sidecars', '--validate-codec-roundtrip', '--dry-run', '--json']);
    const pngResult = JSON.parse(pngStdout);
    expect(pngResult.pngImageCodecReadiness).toBe('ready');
    expect(pngResult.pngImageDecodeReadiness).toBe('pass');
    expect(pngResult.pngMaskCodecReadiness).toBe('ready');
    expect(pngResult.roundTripReadiness).toBe('pass');
    expect(pngResult.plannedArtifacts.some((artifact: { format: string }) => artifact.format === 'png-image')).toBe(true);
    const { stdout: rawStdout } = await exec(process.execPath, [script, '--fixture', fixture, '--codec', 'raw', '--mask-codec', 'binary', '--materialize-raw-rgba', '--materialize-binary-masks', '--write-artifact-manifest', '--validate-strict-alignment', '--json']);
    expect(JSON.parse(rawStdout).strictAlignmentReadiness).toBe('pass');
  });
});
