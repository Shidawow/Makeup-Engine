import { describe, expect, it } from 'vitest';
import { runQualityGate } from '../src/templates/storage';
import { evidenceFixture, sampleFixture } from './dataset-review-fixtures';

describe('quality gate', () => {
  it('accepts high-confidence human verified samples as training ready', () => {
    const sample = sampleFixture({
      sampleId: 'sample-quality-good',
      correctionConfidence: 0.92,
      humanVerificationStatus: 'ready_for_dataset',
    });
    const result = runQualityGate({ sample, evidence: evidenceFixture() });

    expect(result.qualityScore).toBeGreaterThanOrEqual(0.74);
    expect(result.suggestedDecision).toBe('ready_for_training');
    expect(result.isTrainingReady).toBe(true);
    expect(result.suggestedReasons).toContain('accepted_clean');
  });

  it('flags low confidence and semantic drift without random behavior', () => {
    const sample = sampleFixture({
      sampleId: 'sample-quality-drift',
      correctionConfidence: 0.48,
      originalSemantics: ['lip_style:defined_satin'],
      updatedSemantics: ['eye_style:smokey', 'blush_style:high_lift'],
    });
    const first = runQualityGate({
      sample,
      evidence: evidenceFixture(),
      sourceImageQuality: 0.5,
    });
    const second = runQualityGate({
      sample,
      evidence: evidenceFixture(),
      sourceImageQuality: 0.5,
    });

    expect(first).toEqual(second);
    expect(first.suggestedDecision).toBe('rejected');
    expect(first.suggestedReasons).toEqual(
      expect.arrayContaining(['low_confidence', 'semantic_drift', 'bad_source_image']),
    );
    expect(first.isTrainingReady).toBe(false);
  });
});
