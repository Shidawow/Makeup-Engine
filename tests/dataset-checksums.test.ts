import { describe, expect, it } from 'vitest';
import {
  checksumJsonStable,
  checksumText,
  createDatasetChecksums,
  exportDatasetChecksumsJson,
  validateDatasetChecksums,
} from '../src/templates/storage';

describe('dataset checksums', () => {
  it('creates stable text and JSON checksums', () => {
    expect(checksumText('abc')).toBe(checksumText('abc'));
    expect(checksumJsonStable({ b: 2, a: 1 })).toBe(
      checksumJsonStable({ a: 1, b: 2 }),
    );
  });

  it('validates tracked files deterministically', () => {
    const files = [
      { path: 'manifest.json', content: '{"ok":true}' },
      { path: 'splits/train.jsonl', content: '{"sampleId":"a"}' },
    ];
    const checksums = createDatasetChecksums({
      files,
      createdAt: '2026-05-30T00:00:00.000Z',
    });

    expect(validateDatasetChecksums({ checksums, files }).valid).toBe(true);
    expect(
      validateDatasetChecksums({
        checksums,
        files: [{ path: 'manifest.json', content: '{"ok":false}' }],
      }).errors,
    ).toContain('checksum mismatch:manifest.json');
    expect(exportDatasetChecksumsJson(checksums)).toContain(
      'dataset-checksums-v0.1',
    );
  });
});
