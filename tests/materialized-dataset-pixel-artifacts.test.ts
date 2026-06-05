import { describe, expect, it } from 'vitest';
import { resolveImagePixelArtifactPath } from '../src/templates/storage';

describe('materialized dataset pixel artifacts', () => {
  it('resolves optional pixel artifact paths without absolute path leakage', () => {
    expect(resolveImagePixelArtifactPath('image-train')).toBe('image-pixels/image-train.rgba.json');
  });
});
