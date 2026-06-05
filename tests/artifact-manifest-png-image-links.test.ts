import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const exec = promisify(execFile);

describe('artifact manifest PNG image links', () => {
  it('writes png-image links with sidecar metadata references', async () => {
    const out = await mkdtemp(path.join(tmpdir(), 'me-png-image-manifest-'));
    try {
      await exec(process.execPath, [
        path.resolve('scripts/build-training-dataset.mjs'),
        '--fixture', path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample'),
        '--codec', 'png',
        '--mask-codec', 'png',
        '--materialize-png-images',
        '--materialize-png-masks',
        '--write-artifact-manifest',
        '--write-codec-sidecars',
        '--out', out,
        '--json',
      ]);
      const manifest = JSON.parse(await readFile(path.join(out, 'artifact-manifest.json'), 'utf8'));
      const imageLinks = manifest.artifactLinks.filter((link: { format: string }) => link.format === 'png-image');
      expect(imageLinks.length).toBeGreaterThan(0);
      expect(imageLinks[0].relativePath).toMatch(/^images-png\//);
      expect(imageLinks[0].sidecarMetadataReference).toMatch(/\.png\.meta\.json$/);
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  });
});
