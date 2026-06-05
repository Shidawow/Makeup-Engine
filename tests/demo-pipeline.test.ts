import { describe, expect, it } from 'vitest';
import { runDemoPipeline } from '../src/examples/demoPipeline';

describe('demo pipeline', () => {
  it('runs photo input through mock analysis, recommendation, compiler, and runtime', async () => {
    const result = await runDemoPipeline({
      fileName: 'warm-round-hooded-full-demo.jpg',
      size: 12000,
      type: 'image/jpeg',
    });

    expect(result.faceAnalysis.features).toEqual({
      faceShape: 'round',
      skinType: 'oily',
      skinTone: 'warm',
      eyeType: 'hooded',
      lipShape: 'full',
    });
    expect(result.styleInference.recommendation.foundation).toBe('matte');
    expect(result.recommendationScore.confidence).toBeGreaterThan(0);
    expect(result.renderInstructions.length).toBe(result.plan.steps.length);
    expect(result.logs.map((entry) => entry.message)).toContain('Mock face analysis completed.');
  });
});
