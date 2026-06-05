import { describe, expect, it } from 'vitest';
import { createExportPreparationManifest, summarizeExportPreparationManifest, validateExportPreparationReadiness } from '../src/training/export';
import type { LightweightSegmentationClassifier } from '../src/training/schema';

const model = {
  modelId: 'model-a',
  trainedRegions: ['lips'],
  featureConfig: { featureNames: ['r'] },
} as LightweightSegmentationClassifier;

describe('export preparation manifest', () => {
  it('keeps ONNX and WebGPU as preparation-only boundaries', () => {
    const manifest = createExportPreparationManifest({ model, targets: ['onnx-placeholder', 'webgpu-placeholder'] });
    expect(manifest.readiness).toBe('preparation-only');
    expect(validateExportPreparationReadiness(manifest).map((issue) => issue.code)).toContain('onnx-export-not-implemented');
    expect(summarizeExportPreparationManifest(manifest)).toContain('model-a');
  });
});
