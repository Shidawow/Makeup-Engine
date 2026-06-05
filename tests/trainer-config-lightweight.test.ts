import { describe, expect, it } from 'vitest';
import { createDefaultTrainerConfig, validateTrainerConfig } from '../src/training/config';

describe('trainer config lightweight extension', () => {
  it('validates lightweight classifier config', () => {
    const config = createDefaultTrainerConfig();
    expect(config.lightweight?.trainerKind).toBe('lightweight-segmentation-classifier');
    expect(validateTrainerConfig(config)).toEqual([]);
    expect(validateTrainerConfig({ ...config, lightweight: { ...config.lightweight!, featureStride: 0 } })).toContain('lightweight featureStride must be positive');
  });
});
