import { describe, expect, it } from 'vitest';
import { createSourceImageQuarantine } from '../src/training/quarantine';
import type { SourceImageEntry } from '../src/training/schema';

describe('source image quarantine', () => {
  it('summarizes blocking import failures without deleting source data', () => {
    const entry = {
      sourceImageId: 'bad',
      originalFileName: 'bad.jpg',
      originalFileChecksum: 'abc',
      originalFileKind: 'jpeg',
      decodedWidth: 0,
      decodedHeight: 0,
      colorSpace: 'unknown',
      channels: 0,
      orientation: 'missing',
      normalizedArtifactLinks: [],
      codecReport: { originalKind: 'jpeg', pngCodecReadiness: 'not-applicable', jpegBoundaryStatus: 'metadata-only', decoded: false, issueCodes: ['jpeg-decode-unsupported'] },
      qualityReport: { readiness: 'blocked', qualityScore: 0, width: 0, height: 0, brightness: 0, contrast: 0, colorVariance: 0, alphaCoverage: 0, issueCodes: ['source-image-quality-blocked'] },
      lineage: { importedBy: 'source-image-import-cli', sourceUri: 'bad.jpg', normalizedFromChecksum: 'abc' },
      importStatus: 'blocked_by_codec',
      createdAt: '2026-05-30T00:00:00.000Z',
    } satisfies SourceImageEntry;
    const quarantine = createSourceImageQuarantine({ packageId: 'pkg', entries: [entry] });
    expect(quarantine.blockingCount).toBe(1);
    expect(quarantine.items[0]?.reasons).toContain('jpeg-decode-unsupported');
  });
});
