import { describe, expect, it } from 'vitest';
import {
  createTemplateAnalysisSeedFromSourceImage,
  listReadySourceImages,
  readSourceImageManifest,
  validateSourceImageReadyForTemplateAnalysis,
} from '../src/templates/storage';
import type { SourceImageManifest } from '../src/training/schema';

describe('source image package storage boundary', () => {
  it('creates template analysis seeds only from ready source image entries', () => {
    const manifest = readSourceImageManifest(JSON.stringify({
      schemaVersion: 'source-image-package-v0.1',
      packageId: 'pkg',
      createdAt: '2026-05-30T00:00:00.000Z',
      readiness: 'ready',
      issueCodes: [],
      entries: [{
        sourceImageId: 'img',
        originalFileName: 'img.png',
        originalFileChecksum: 'abc',
        originalFileKind: 'png',
        decodedWidth: 2,
        decodedHeight: 2,
        colorSpace: 'srgb',
        channels: 4,
        orientation: 'missing',
        normalizedArtifactLinks: [{ kind: 'json-rgba', uri: 'json-rgba/img.rgba.json' }, { kind: 'original', uri: 'originals/img.png' }],
        codecReport: { originalKind: 'png', pngCodecReadiness: 'ready', jpegBoundaryStatus: 'not-applicable', decoded: true, issueCodes: [] },
        qualityReport: { readiness: 'ready', qualityScore: 1, width: 2, height: 2, brightness: 0.5, contrast: 0.2, colorVariance: 0.1, alphaCoverage: 1, issueCodes: [] },
        lineage: { importedBy: 'source-image-import-cli', sourceUri: 'img.png', normalizedFromChecksum: 'abc' },
        importStatus: 'ready_for_template_analysis',
        createdAt: '2026-05-30T00:00:00.000Z',
      }],
    } satisfies SourceImageManifest));
    const ready = listReadySourceImages(manifest);
    expect(ready).toHaveLength(1);
    expect(validateSourceImageReadyForTemplateAnalysis(ready[0]!).length).toBe(1);
    expect(createTemplateAnalysisSeedFromSourceImage(ready[0]!).jsonRgbaUri).toBe('json-rgba/img.rgba.json');
    expect(createTemplateAnalysisSeedFromSourceImage(ready[0]!).readiness).toBe(
      'blocked_by_missing_artifact',
    );
  });
});
