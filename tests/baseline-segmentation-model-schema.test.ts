import { describe, expect, it } from 'vitest';
import { BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION } from '../src/training/schema';

describe('baseline segmentation model schema', () => {
  it('exposes a deterministic schema version', () => {
    expect(BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION).toBe(
      'baseline-segmentation-model-v0.1',
    );
  });
});
