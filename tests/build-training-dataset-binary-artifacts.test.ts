import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('build-training-dataset binary artifact options', () => {
  it('accepts binary materialization flags in dry-run output', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'build-training-binary-'));
    try {
      const { stdout } = await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--package',
        path.resolve('tests/fixtures/offline-package.sample.json'),
        '--manifest',
        path.resolve('tests/fixtures/offline-package-manifest.sample.json'),
        '--audit',
        path.resolve('tests/fixtures/audit-report.sample.json'),
        '--out',
        out,
        '--materialize-binary-masks',
        '--materialize-binary-diffs',
        '--include-pixel-artifacts',
        '--validate-alignment',
        '--dry-run',
      ]);
      expect(stdout).toContain('binary mask materialization: enabled');
      await expect(readFile(path.join(out, 'manifest.json'), 'utf8')).rejects.toThrow();
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
