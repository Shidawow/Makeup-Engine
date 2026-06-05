import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { createSourceImageFixtures, sourceImageFixtureDir } from './source-image-fixtures';

const exec = promisify(execFile);
const script = path.resolve('scripts/import-source-images.mjs');

describe('source image import pipeline', () => {
  it('imports PNG source images and quarantines unsupported JPEG/invalid files', async () => {
    await createSourceImageFixtures();
    const out = await mkdtemp(path.join(tmpdir(), 'source-image-pipeline-'));
    try {
      const { stdout } = await exec(process.execPath, [
        script,
        '--input', sourceImageFixtureDir,
        '--out', out,
        '--materialize-normalized-png',
        '--materialize-raw-rgba',
        '--materialize-json-rgba',
        '--write-manifest',
        '--quality-gate',
        '--dry-run',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { readyCount: number; quarantineCount: number; plannedArtifacts: string[] };
      expect(result.readyCount).toBeGreaterThanOrEqual(5);
      expect(result.quarantineCount).toBeGreaterThanOrEqual(2);
      expect(result.plannedArtifacts).toContain('json-rgba/simple-rgba.rgba.json');
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
