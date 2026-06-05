import { describe, expect, it } from 'vitest';
import { decodeJpegImageArtifact, summarizeJpegDecodeResult } from '../src/training/artifacts';

describe('JPEG decoder boundary', () => {
  it('detects JPEG but reports a metadata-only unsupported boundary', () => {
    const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]);
    const result = decodeJpegImageArtifact(bytes);
    expect(result.decoded).toBeNull();
    expect(result.readiness.ready).toBe(false);
    expect(result.validation.issues.map((issue) => issue.code)).toContain('jpeg-decode-unsupported');
    expect(summarizeJpegDecodeResult(result)).toContain('jpeg-boundary');
  });
});
