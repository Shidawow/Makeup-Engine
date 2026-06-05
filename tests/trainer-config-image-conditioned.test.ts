import { describe, expect, it } from 'vitest';
import { createDefaultTrainerConfig, validateTrainerConfig } from '../src/training/config';

describe('image-conditioned trainer config', () => {
  it('supports image-conditioned-pixel-prior config', () => {
    const config = createDefaultTrainerConfig();
    expect(config.imageConditioned?.trainerKind).toBe('image-conditioned-pixel-prior');
    expect(validateTrainerConfig(config)).toEqual([]);
  });
});
