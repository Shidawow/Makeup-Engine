import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('artifact manifest codec links', () => {
  it('records codec metadata for realistic synthetic pixels', async () => {
    const manifest = JSON.parse(await readFile(path.resolve('tests/fixtures/materialized-dataset-realistic-synthetic.sample/artifact-manifest.json'), 'utf8')) as { artifactLinks: Array<{ codecKind?: string; codecVersion?: string; width: number }> };
    expect(manifest.artifactLinks.every((link) => link.codecKind === 'json')).toBe(true);
    expect(manifest.artifactLinks.every((link) => link.codecVersion)).toBe(true);
    expect(manifest.artifactLinks.every((link) => link.width === 64)).toBe(true);
  });
});
