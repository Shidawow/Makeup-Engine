import { describe, expect, it } from 'vitest';
import {
  makeupSemanticExtractionInsufficientExample,
  makeupSemanticExtractionReadyExample,
} from '../src/templates/examples';

describe('makeup semantic blush baseline', () => {
  it('derives blush placement from region pixel center and keeps it candidate-only', () => {
    const placement = makeupSemanticExtractionReadyExample.candidates.blushPlacementCandidate;

    expect(placement.value).toBe('upper_cheek');
    expect(placement.sourceType).toBe('region_pixel_derived');
    expect(placement.evidence[0]?.notes.join('\n')).toContain('Blush center');
    expect(placement.notFinal).toBe(true);
  });

  it('derives blush intensity from saturation and skin-baseline contrast', () => {
    const intensity = makeupSemanticExtractionReadyExample.candidates.blushIntensityCandidate;

    expect(intensity.value).toBe('medium');
    expect(intensity.sourceType).toBe('saturation_rule_derived');
    expect(intensity.evidence[0]?.contrastVsSkinBaseline).toBeGreaterThan(0);
    expect(intensity.humanReviewRequired).toBe(true);
  });

  it('does not guess blush placement when cheek color evidence is missing', () => {
    const placement =
      makeupSemanticExtractionInsufficientExample.candidates.blushPlacementCandidate;

    expect(placement.value).toBe('unknown');
    expect(placement.sourceType).toBe('insufficient_evidence');
    expect(placement.confidenceBand).toBe('insufficient');
  });
});
