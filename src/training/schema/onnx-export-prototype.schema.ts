import type { CosmeticSegmentationTarget } from '../../vision';
import type { LightweightClassifierKind } from './lightweight-classifier.schema';

export const ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION = 'onnx-export-prototype-v0.1' as const;

export interface OnnxTensorSpec {
  name: string;
  dataType: 'float32' | 'int64' | 'string';
  shape: Array<number | string>;
  description: string;
}

export interface OnnxInitializerSpec {
  name: string;
  dataType: 'float32';
  dims: number[];
  checksum: string;
}

export interface OnnxNodePrototype {
  nodeId: string;
  opType: 'FeatureInput' | 'NearestCentroidDistance' | 'Linear' | 'Sigmoid' | 'ThresholdToAlpha';
  inputs: string[];
  outputs: string[];
  attributes?: Record<string, string | number | string[]>;
}

export interface OnnxGraphPrototype {
  graphId: string;
  regionId: CosmeticSegmentationTarget | string;
  nodes: OnnxNodePrototype[];
  inputs: OnnxTensorSpec[];
  outputs: OnnxTensorSpec[];
  initializers: OnnxInitializerSpec[];
}

export interface OnnxExportReadiness {
  status: 'prototype-only' | 'blocked';
  reasons: string[];
}

export interface OnnxExportLimitation {
  code: string;
  message: string;
}

export interface OnnxExportPrototype {
  schemaVersion: typeof ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION;
  prototypeId: string;
  modelId: string;
  modelVersion: string;
  classifierKind: LightweightClassifierKind;
  graphs: OnnxGraphPrototype[];
  tensorSpec: {
    inputs: OnnxTensorSpec[];
    outputs: OnnxTensorSpec[];
  };
  readiness: OnnxExportReadiness;
  limitations: OnnxExportLimitation[];
  checksum: string;
}

export interface OnnxExportPrototypeManifest {
  schemaVersion: typeof ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION;
  prototypeId: string;
  modelId: string;
  entries: Array<{
    entryId: string;
    relativePath: string;
    checksum: string;
  }>;
}
