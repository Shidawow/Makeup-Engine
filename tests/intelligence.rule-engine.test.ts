import { describe, expect, it } from 'vitest';
import { inferMakeup, inferMakeupWithTrace } from '../src/intelligence/runtime/rule-engine';

describe('rule engine', () => {
  it('merges multiple matching rules with explanations', () => {
    const recommendation = inferMakeup({
      faceShape: 'round',
      skinType: 'oily',
      skinTone: 'warm',
      eyeType: 'hooded',
      lipShape: 'full',
    });

    expect(recommendation.foundation).toBe('matte');
    expect(recommendation.eyeliner).toBe('thin lifted eyeliner');
    expect(recommendation.contour).toBe(true);
    expect(recommendation.blush).toContain('lifted diagonal blush');
    expect(recommendation.blush).toContain('peach coral blush');
    expect(recommendation.lipstick).toContain('warm coral lipstick');
    expect(recommendation.explanations).toHaveLength(5);
  });

  it('returns traceable matched rules ordered by priority', () => {
    const result = inferMakeupWithTrace({
      faceShape: 'round',
      skinType: 'dry',
      skinTone: 'neutral',
      eyeType: 'monolid',
      lipShape: 'thin',
    });

    expect(result.recommendation.foundation).toBe('dewy hydrating');
    expect(result.matchedRules.map((rule) => rule.id)).toEqual([
      'skin-dry-dewy-foundation',
      'eye-monolid-gradient-liner',
      'face-round-soft-contour',
      'lip-thin-soft-overline',
    ]);
  });
});
