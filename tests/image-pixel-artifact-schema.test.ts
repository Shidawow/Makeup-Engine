import { describe, expect, it } from 'vitest';
import { IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION } from '../src/training/schema';

describe('image pixel artifact schema', () => {
  it('defines the Phase 6D pixel artifact schema version', () => {
    expect(IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION).toBe('image-pixel-artifact-v0.1');
  });
});
