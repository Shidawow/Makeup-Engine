import { describe, expect, it } from 'vitest';
import { assessImageQuality } from '../src/vision';

describe('image quality scorer placeholder', () => {
  it('scores image quality deterministically without ML dependencies', () => {
    const good = assessImageQuality({
      imageId: 'quality-good',
      width: 1200,
      height: 1200,
      faceConfidence: 0.92,
      faceCoverageRatio: 0.34,
    });
    const risky = assessImageQuality({
      imageId: 'quality-risk',
      width: 240,
      height: 240,
      faceConfidence: 0.4,
      faceCoverageRatio: 0.12,
      debugSignals: ['blur-risk', 'underexposed', 'occlusion-risk'],
    });

    expect(good.overallImageQualityScore).toBeGreaterThan(risky.overallImageQualityScore);
    expect(good.suggestedDecision).toBe('usable');
    expect(risky.reasons).toEqual(
      expect.arrayContaining(['blur_risk', 'lighting_risk', 'low_resolution']),
    );
    expect(assessImageQuality({ imageId: 'quality-good', width: 1200, height: 1200 })).toEqual(
      assessImageQuality({ imageId: 'quality-good', width: 1200, height: 1200 }),
    );
  });
});
