import { describe, expect, it } from 'vitest';
import type { OnnxExportPrototype } from '../src/training/schema';

describe('ONNX export prototype schema', () => {
  it('represents JSON graph prototype without binary ONNX', () => {
    const prototype: OnnxExportPrototype = {
      schemaVersion: 'onnx-export-prototype-v0.1',
      prototypeId: 'onnx-a',
      modelId: 'model-a',
      modelVersion: 'v1',
      classifierKind: 'nearest-centroid',
      graphs: [],
      tensorSpec: { inputs: [], outputs: [] },
      readiness: { status: 'prototype-only', reasons: ['no .onnx binary'] },
      limitations: [{ code: 'no-onnx-binary', message: 'prototype only' }],
      checksum: 'abc',
    };
    expect(prototype.readiness.status).toBe('prototype-only');
  });
});
