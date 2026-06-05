import { describe, expect, it } from 'vitest';
import { inferStyle } from '../src/engine/stages/infer-style';

describe('style inference stage', () => {
  it('converts face analysis into style inference with explanations', async () => {
    const result = await inferStyle({
      features: {
        faceShape: 'round',
        skinType: 'oily',
        skinTone: 'warm',
        eyeType: 'hooded',
        lipShape: 'full',
      },
      confidence: 0.92,
      notes: ['manual features'],
    });

    expect(result.styleName).toBe('intelligence-default');
    expect(result.recommendation.foundation).toBe('matte');
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.confidence).toBe(1);
  });
});
