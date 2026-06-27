import { describe, expect, it } from 'vitest';
import {
  makeupSemanticExtractionInsufficientExample,
  makeupSemanticExtractionReadyExample,
} from '../src/templates/examples';

describe('makeup semantic eye baseline', () => {
  it('derives eye makeup intensity from brightness contrast, not final eye-style recognition', () => {
    const eyeIntensity =
      makeupSemanticExtractionReadyExample.candidates.eyeMakeupIntensityCandidate;

    expect(eyeIntensity.value).toBe('medium');
    expect(eyeIntensity.sourceType).toBe('brightness_rule_derived');
    expect(eyeIntensity.notFinal).toBe(true);
    expect(eyeIntensity.limitations.join('\n')).toContain('不识别具体眼影产品');
  });

  it('derives eyeshadow tone only when weighted local color samples exist', () => {
    const tone = makeupSemanticExtractionReadyExample.candidates.eyeshadowToneCandidate;
    const insufficientTone =
      makeupSemanticExtractionInsufficientExample.candidates.eyeshadowToneCandidate;

    expect(tone.value).toBe('warm_brown');
    expect(tone.sourceType).toBe('color_rule_derived');
    expect(tone.humanReviewRequired).toBe(true);
    expect(insufficientTone.value).toBe('unknown');
    expect(insufficientTone.sourceType).toBe('insufficient_evidence');
  });

  it('uses FaceMesh region parameters only as brow/highlight signal candidates', () => {
    const brow = makeupSemanticExtractionReadyExample.candidates.browDefinitionCandidate;
    const highlight = makeupSemanticExtractionReadyExample.candidates.highlightSignalCandidate;

    expect(brow.value).toBe('defined');
    expect(brow.sourceType).toBe('facemesh_region_derived');
    expect(highlight.value).toBe('weak_signal');
    expect(highlight.limitations.join('\n')).toContain('signal candidate');
  });
});
