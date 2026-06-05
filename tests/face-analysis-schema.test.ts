import { describe, expect, it } from 'vitest';
import { analyzeFace } from '../src/engine/stages/analyze-face';
import type { FaceFeatures } from '../src/intelligence/types';

describe('face analysis schema', () => {
  it('accepts normalized face features and returns analysis result', async () => {
    const features: FaceFeatures = {
      faceShape: 'heart',
      skinType: 'dry',
      skinTone: 'cool',
      eyeType: 'double',
      lipShape: 'thin',
    };

    const result = await analyzeFace({
      features,
      source: 'manual',
    });

    expect(result.features).toEqual(features);
    expect(result.confidence).toBe(1);
    expect(result.notes).toEqual([
      'Face features received and normalized for downstream inference.',
    ]);
  });
});
