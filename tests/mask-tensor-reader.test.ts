import { describe, expect, it } from 'vitest';
import { createMaskTensorFromArtifact } from '../src/training/tensors';

describe('mask tensor reader', () => {
  it('creates deterministic alpha tensors from JSON mask metadata', () => {
    const tensor = createMaskTensorFromArtifact({
      format: 'json-alpha-grid',
      width: 3,
      height: 3,
      regionId: 'lips',
      target: 'lips',
      alphaGrid: null,
      alphaStats: { min: 0, max: 0.9, mean: 0.25, activeRatio: 0.44 },
      bounds: { x: 0.2, y: 0.2, width: 0.4, height: 0.2, space: 'normalized-image' },
      checksum: 'checksum',
      sourceArtifactUri: 'materialized://masks/example.json',
    });

    expect(tensor.width).toBe(3);
    expect(tensor.values).toHaveLength(9);
    expect(tensor.nonZeroRatio).toBe(0.4444);
    expect(tensor.mean).toBeGreaterThan(0);
  });
});
