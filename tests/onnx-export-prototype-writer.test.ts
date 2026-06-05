import { describe, expect, it } from 'vitest';
import { createOnnxExportPrototypeFromLightweightClassifier, validateOnnxExportPrototype } from '../src/training/export';

describe('ONNX export prototype writer', () => {
  it('creates deterministic region graph prototypes', () => {
    const prototype = createOnnxExportPrototypeFromLightweightClassifier({
      modelId: 'model-a',
      modelVersion: 'v1',
      classifierKind: 'nearest-centroid',
      trainedRegions: ['lips'],
      featureConfig: { featureNames: ['r', 'g'], featureStride: 1, alphaPositiveThreshold: 0.4, alphaNegativeThreshold: 0.05 },
      regionClassifiers: { lips: { featureNames: ['r', 'g'], featureWeights: { r: 1, g: 1 } } },
    } as never);
    expect(validateOnnxExportPrototype(prototype)).toEqual([]);
    expect(prototype.graphs[0]?.nodes.map((node) => node.opType)).toContain('NearestCentroidDistance');
  });
});
