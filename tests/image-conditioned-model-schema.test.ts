import { describe, expect, it } from 'vitest';
import { IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION } from '../src/training/schema';

describe('image-conditioned model schema', () => {
  it('defines a deterministic model schema version', () => {
    expect(IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION).toBe('image-conditioned-segmentation-model-v0.1');
  });
});
