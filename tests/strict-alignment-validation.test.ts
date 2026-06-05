import { describe, expect, it } from 'vitest';
import { validateRawRgbaMaskCompatibility, validateRegionBoundsAgainstPixelGrid } from '../src/training/validation';
import type { RawRgbaBinaryArtifact, BinaryMaskBlob } from '../src/training/artifacts';

describe('strict pixel / mask alignment validation', () => {
  it('flags raw RGBA and mask dimension mismatch', () => {
    const raw: RawRgbaBinaryArtifact = { magic: 'MEARGBA', version: 1, width: 3, height: 3, channels: 4, colorSpace: 'srgb', values: Array.from({ length: 36 }, () => 255) };
    const mask: BinaryMaskBlob = { magic: 'MEAMASK', version: 1, width: 2, height: 3, regionId: 'lips', target: 'lips', valueType: 'uint8-alpha', values: Array.from({ length: 6 }, () => 255) };
    expect(validateRawRgbaMaskCompatibility({ raw, mask }).map((issue) => issue.code)).toContain('pixel-mask-alignment-failed');
    expect(validateRegionBoundsAgainstPixelGrid({ bounds: { x: 0.9, y: 0, width: 0.2, height: 0.2 } })[0]?.code).toBe('region-bounds-invalid');
  });
});
