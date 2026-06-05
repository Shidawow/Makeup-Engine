import { describe, expect, it } from 'vitest';
import type { MaterializedArtifactManifest } from '../src/templates/schema';
import { validateArtifactManifestAlignment } from '../src/training/validation';

describe('artifact manifest links', () => {
  it('validates typed checksum and coordinate-space metadata', () => {
    const manifest: MaterializedArtifactManifest = {
      schemaVersion: 'materialized-training-dataset-v0.1',
      datasetId: 'dataset-a',
      createdAt: '2026-05-30T00:00:00.000Z',
      artifactLinks: [{
        artifactId: 'pixel-a',
        artifactType: 'image-pixel',
        imageId: 'image-a',
        format: 'json-rgba-grid',
        relativePath: 'image-pixels/image-a.rgba.json',
        checksum: { algorithm: 'fnv1a32-stable', value: 'abc' },
        width: 3,
        height: 3,
        coordinateSpace: { space: 'pixel-grid', width: 3, height: 3, origin: 'top-left' },
        source: 'fixture',
        lineage: { generatedBy: 'fixture', sourceImageId: 'image-a' },
      }],
    };
    expect(validateArtifactManifestAlignment(manifest)).toEqual([]);
  });
});
