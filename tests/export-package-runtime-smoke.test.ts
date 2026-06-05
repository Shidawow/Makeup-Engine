import { describe, expect, it } from 'vitest';
import { runExportPackageRuntimeSmokeTest } from '../src/training/export';

describe('export package runtime smoke', () => {
  it('validates provider contract without ONNX or browser runtime', () => {
    const result = runExportPackageRuntimeSmokeTest({
      pkg: {
        packageId: 'pkg-a',
        sourceModelId: 'model-a',
        providerCompatibility: { providerId: 'lightweight-classifier', compatible: true, supportedRegions: ['lips'], fallbackPolicy: 'polygon-refinement', issues: [] },
      } as never,
      model: { modelId: 'model-a', trainedRegions: ['lips'] } as never,
      image: { width: 64, height: 64, colorSpace: 'srgb', pixels: Array.from({ length: 4096 }, () => ({ r: 0, g: 0, b: 0, a: 1 })) },
    });
    expect(result.passed).toBe(true);
    expect(result.maskShape).toEqual({ width: 64, height: 64 });
  });
});
