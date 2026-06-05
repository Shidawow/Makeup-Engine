import { describe, expect, it } from 'vitest';
import { buildMakeupPlan } from '../src/engine/stages/build-makeup-plan';
import { naturalDaily } from '../src/examples/naturalDaily';

describe('makeup plan generator', () => {
  it('builds a plan from analysis, style inference, and source look', async () => {
    const plan = await buildMakeupPlan({
      look: naturalDaily,
      faceAnalysis: {
        features: {
          faceShape: 'oval',
          skinType: 'combination',
          skinTone: 'neutral',
          eyeType: 'double',
          lipShape: 'full',
        },
        confidence: 1,
        notes: ['features ready'],
      },
      beautyScore: {
        score: 0.7,
        confidence: 0.9,
        dimensions: {
          skinBalance: 0.7,
          symmetry: 0.6,
          eyeDefinition: 0.6,
          lipBalance: 0.6,
        },
        notes: ['score ready'],
      },
      styleInference: {
        styleName: 'CleanGirl',
        recommendation: {
          foundation: 'natural satin',
          explanations: ['clean style'],
        },
        explanations: ['clean style'],
        confidence: 0.8,
      },
    });

    expect(plan.id).toBe('look-natural-daily-v01-plan');
    expect(plan.sourceLook).toBe(naturalDaily);
    expect(plan.steps).toHaveLength(naturalDaily.steps.length);
    expect(plan.styleInference.recommendation.foundation).toBe('natural satin');
  });
});
