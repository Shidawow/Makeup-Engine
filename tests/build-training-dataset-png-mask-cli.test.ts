import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('build-training-dataset PNG mask CLI', () => {
  it('writes PNG masks, sidecars, manifest links, and round-trip report', async () => {
    const out = await mkdtemp(path.join(os.tmpdir(), 'makeup-png-mask-'));
    try {
      const { stdout } = await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--fixture',
        path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
        '--mask-codec',
        'png',
        '--materialize-png-masks',
        '--write-artifact-manifest',
        '--write-codec-sidecars',
        '--validate-codec-roundtrip',
        '--out',
        out,
        '--json',
      ]);
      const result = JSON.parse(stdout) as { pngAlphaMaskCodecReadiness: string; roundTripReadiness: string };
      expect(result.pngAlphaMaskCodecReadiness).toBe('ready');
      expect(result.roundTripReadiness).toBe('pass');
      expect(existsSync(path.join(out, 'masks-png', 'sample-train-lips-lips.png'))).toBe(true);
      expect(existsSync(path.join(out, 'masks-png', 'sample-train-lips-lips.png.meta.json'))).toBe(true);
      expect(existsSync(path.join(out, 'artifact-manifest.json'))).toBe(true);
      expect(existsSync(path.join(out, 'codec-roundtrip-report.json'))).toBe(true);
      expect(existsSync(path.join(out, 'checksums.json'))).toBe(true);
    } finally {
      await rm(out, { force: true, recursive: true });
    }
  });
});
