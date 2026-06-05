import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import { createSourceImageFixtures, sourceImageFixtureDir } from './source-image-fixtures';

const exec = promisify(execFile);
const importScript = path.resolve('scripts/import-source-images.mjs');
const buildScript = path.resolve('scripts/build-training-dataset.mjs');

describe('build-training-dataset source image boundary', () => {
  it('blocks source image package usage before mask corrections and review', async () => {
    await createSourceImageFixtures();
    const out = await mkdtemp(path.join(tmpdir(), 'source-boundary-'));
    try {
      await exec(process.execPath, [importScript, '--input', sourceImageFixtureDir, '--out', out, '--materialize-json-rgba', '--write-manifest', '--quality-gate']);
      const { stdout } = await exec(process.execPath, [
        buildScript,
        '--source-image-package', path.join(out, 'source-image-manifest.json'),
        '--use-source-image-artifacts',
        '--dry-run',
        '--json',
      ]);
      const result = JSON.parse(stdout) as { blocked: boolean; reason: string };
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('source-image-package-is-not-training-ready-dataset');
      expect(await readFile(path.join(out, 'source-image-manifest.json'), 'utf8')).toContain('ready_for_template_analysis');
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
