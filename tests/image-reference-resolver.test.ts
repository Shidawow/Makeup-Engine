import { describe, expect, it } from 'vitest';
import {
  resolveTrainingImageReference,
  summarizeTrainingImageReference,
  validateTrainingImageReference,
} from '../src/training';

describe('image reference resolver boundary', () => {
  it('resolves metadata-only image references without reading pixels', () => {
    const resolved = resolveTrainingImageReference({
      imageReferenceId: 'image-ref-a',
      imageId: 'image-a',
      split: 'train',
      sampleIds: ['sample-a'],
      referenceUri: 'offline://images/image-a',
      checksum: 'checksum',
      source: 'reviewed-dataset',
    });

    expect(resolved.kind).toBe('metadata-only');
    expect(resolved.relativePath).toBe('images/image-ref-a.json');
    expect(validateTrainingImageReference(resolved).valid).toBe(true);
    expect(validateTrainingImageReference(resolved).warnings).toContain(
      'image pixels are not loaded in Phase 6B',
    );
    expect(summarizeTrainingImageReference(resolved)).toContain('image-a');
  });
});
