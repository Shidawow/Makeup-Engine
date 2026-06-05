import { describe, expect, it } from 'vitest';
import { validateModelProviderCompatibility } from '../src/training/export';
import type { LightweightSegmentationClassifier } from '../src/training/schema';

describe('provider compatibility validation', () => {
  it('accepts supported lightweight feature specs and rejects unknown features', () => {
    const model = {
      classifierKind: 'nearest-centroid',
      trainedRegions: ['lips'],
    } as LightweightSegmentationClassifier;
    const valid = validateModelProviderCompatibility({
      model,
      providerId: 'lightweight-classifier',
      inputSpec: { requiresPixelData: true, pixelFormat: 'json-rgba-grid', featureNames: ['r', 'g'] },
      outputSpec: { outputType: 'CosmeticSegmentationMask', alphaFormat: 'float-alpha-grid', coordinateSpace: 'normalized-image' },
    });
    const invalid = validateModelProviderCompatibility({
      model,
      providerId: 'lightweight-classifier',
      inputSpec: { requiresPixelData: true, pixelFormat: 'json-rgba-grid', featureNames: ['unknown-feature'] },
      outputSpec: { outputType: 'CosmeticSegmentationMask', alphaFormat: 'float-alpha-grid', coordinateSpace: 'normalized-image' },
    });
    expect(valid.compatible).toBe(true);
    expect(invalid.issues[0]).toBe('unsupported feature:unknown-feature');
  });
});
