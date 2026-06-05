import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainingBridgeValidationIssue } from './training-bridge.schema';

export const MASK_BINARY_ARTIFACT_SCHEMA_VERSION = 'mask-binary-artifact-v0.1' as const;

export type MaskBinaryArtifactFormat =
  | 'json-alpha-grid'
  | 'png-alpha-mask'
  | 'binary-alpha-mask'
  | 'png-diff-heatmap'
  | 'binary-diff-grid';

export type MaskArtifactValueType = 'uint8-alpha' | 'float32-alpha';

export interface MaskArtifactCoordinateSpace {
  space: 'normalized-image' | 'pixel-grid';
  width: number;
  height: number;
  origin: 'top-left';
}

export interface MaskArtifactPixelGrid {
  width: number;
  height: number;
  values: number[];
  valueType: MaskArtifactValueType;
}

export interface BinaryMaskArtifact {
  schemaVersion: typeof MASK_BINARY_ARTIFACT_SCHEMA_VERSION;
  artifactId: string;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  format: 'binary-alpha-mask';
  valueType: MaskArtifactValueType;
  width: number;
  height: number;
  byteLength: number;
  checksum: string;
  sourceJsonArtifactUri: string;
  referenceUri: string;
  coordinateSpace: MaskArtifactCoordinateSpace;
}

export interface PngMaskArtifact {
  schemaVersion: typeof MASK_BINARY_ARTIFACT_SCHEMA_VERSION;
  artifactId: string;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  format: 'png-alpha-mask' | 'png-diff-heatmap';
  width: number;
  height: number;
  checksum: string;
  sourceJsonArtifactUri: string;
  referenceUri: string;
  unsupportedReason: string;
}

export interface MaskArtifactMaterialization {
  materializationId: string;
  sourceArtifactId: string;
  outputArtifactId: string;
  sourceFormat: 'json-alpha-grid' | 'json-diff-grid';
  outputFormat: MaskBinaryArtifactFormat;
  relativePath: string;
  checksum: string;
}

export interface MaskArtifactMaterializationResult {
  schemaVersion: typeof MASK_BINARY_ARTIFACT_SCHEMA_VERSION;
  materializations: MaskArtifactMaterialization[];
  errors: TrainingBridgeValidationIssue[];
  warnings: TrainingBridgeValidationIssue[];
}

export interface MaskArtifactDimensionValidation {
  valid: boolean;
  width: number;
  height: number;
  expectedLength: number;
  actualLength: number;
  issues: TrainingBridgeValidationIssue[];
}

export interface MaskArtifactFormatValidationResult {
  supported: boolean;
  format: MaskBinaryArtifactFormat;
  issues: TrainingBridgeValidationIssue[];
}
