import { describe, expect, it } from 'vitest';
import { createDefaultTrainerConfig, validateTrainerConfig } from '../src/training/config';

describe('baseline trainer config', () => {
  it('supports baseline-mask-prior configuration without breaking v0.1 config', () => {
    const config = createDefaultTrainerConfig();

    expect(config.baseline?.trainerKind).toBe('baseline-mask-prior');
    expect(config.baseline?.modelOutputFormat).toBe('baseline-mask-prior-json');
    expect(validateTrainerConfig(config)).toEqual([]);
  });
});
