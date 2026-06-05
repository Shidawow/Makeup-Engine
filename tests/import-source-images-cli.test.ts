import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { createSourceImageFixtures, sourceImageFixtureDir } from './source-image-fixtures';

const exec = promisify(execFile);
const script = path.resolve('scripts/import-source-images.mjs');

describe('import-source-images CLI', () => {
  it('dry-runs and writes source image packages', async () => {
    await createSourceImageFixtures();
    const out = await mkdtemp(path.join(tmpdir(), 'source-image-import-'));
    try {
      const dry = await exec(process.execPath, [
        script,
        '--input', sourceImageFixtureDir,
        '--out', out,
        '--codec-preference', 'png,jpeg',
        '--materialize-normalized-png',
        '--materialize-raw-rgba',
        '--materialize-json-rgba',
        '--write-manifest',
        '--quality-gate',
        '--dry-run',
        '--json',
      ]);
      const dryRun = JSON.parse(dry.stdout) as { dryRun: boolean; binaryFileReaderReady: boolean; plannedArtifacts: string[] };
      expect(dryRun.dryRun).toBe(true);
      expect(dryRun.binaryFileReaderReady).toBe(true);
      expect(dryRun.plannedArtifacts).toContain('normalized-png/simple-rgba.png');
      const write = await exec(process.execPath, [
        script,
        '--input', sourceImageFixtureDir,
        '--out', out,
        '--materialize-normalized-png',
        '--materialize-raw-rgba',
        '--materialize-json-rgba',
        '--write-manifest',
        '--quality-gate',
        '--json',
      ]);
      expect(JSON.parse(write.stdout).writtenFiles).toContain('source-image-manifest.json');
      expect(await readFile(path.join(out, 'source-image-manifest.json'), 'utf8')).toContain('source-image-package-v0.1');
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
