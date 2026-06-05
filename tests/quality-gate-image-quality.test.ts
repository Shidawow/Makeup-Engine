import { describe, expect, it } from 'vitest';
import { runQualityGate } from '../src/templates/storage';
import { assessImageQuality } from '../src/vision';
import { evidenceFixture, sampleFixture } from './dataset-review-fixtures';

describe('quality gate image quality integration', () => {
  it('keeps old behavior when image quality is absent and adds optional image quality summary when present', () => {
    const sample = sampleFixture({ sampleId: 'sample-quality-image' });
    const legacy = runQualityGate({ sample, evidence: evidenceFixture() });
    const imageQualityAssessment = assessImageQuality({
      imageId: sample.imageId,
      width: 200,
      height: 200,
      faceConfidence: 0.35,
      faceCoverageRatio: 0.1,
      debugSignals: ['blur-risk', 'underexposed'],
    });
    const upgraded = runQualityGate({
      sample,
      evidence: evidenceFixture(),
      imageQualityAssessment,
    });

    expect(legacy.imageQualitySummary).toBeUndefined();
    expect(upgraded.imageQualitySummary?.imageId).toBe(sample.imageId);
    expect(upgraded.qualityScore).toBeLessThan(legacy.qualityScore);
    expect(upgraded.suggestedReasons).toContain('bad_source_image');
  });
});
