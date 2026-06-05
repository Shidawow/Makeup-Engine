import { describe, expect, it } from 'vitest';
import { inferMakeupSemantics, type MakeupPixelAnalysis } from '../src/vision';

const pixelAnalysis: MakeupPixelAnalysis = {
  version: '0.1',
  imageId: 'semantic-fixture',
  lips: {
    dominantHue: 350,
    saturation: 0.52,
    brightness: 0.62,
    edgeSoftness: 0.9,
    gradientDirection: 'center',
  },
  blush: {
    blushCenter: { x: 0.5, y: 0.5 },
    spreadRadius: 0.16,
    opacity: 0.28,
    tone: 'warm',
  },
  eyes: {
    eyeshadowDarkness: 0.5,
    shimmerEstimation: 0.08,
    eyelinerDirection: 'upward',
  },
  debug: [],
};

describe('makeup semantic layer', () => {
  it('classifies pixel features into explainable beauty semantics', () => {
    const semantics = inferMakeupSemantics(pixelAnalysis);

    expect(semantics.lipStyle).toBe('soft_gradient');
    expect(semantics.lipFinish).toBe('velvet');
    expect(semantics.blushStyle).toBe('high_lift');
    expect(semantics.eyeStyle).toBe('soft_smokey');
    expect(semantics.explanations.length).toBeGreaterThan(0);
  });
});

