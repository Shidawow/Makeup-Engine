import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainingBridgeValidationIssue } from './training-bridge.schema';

export const PNG_MASK_CODEC_SCHEMA_VERSION = 'png-mask-codec-v0.1' as const;
export const PNG_MASK_SIDECAR_SCHEMA_VERSION = 'png-alpha-mask-sidecar.v1' as const;
export const PNG_MASK_CODEC_VERSION = 'makeup-engine-png-alpha-grayscale-v0.1' as const;

export type PngMaskCodecKind = 'png';
export type PngMaskAlphaEncoding = 'uint8-alpha';
export type PngMaskCodecReadiness = 'ready' | 'warning' | 'blocked' | 'not-requested';

export interface PngMaskCodecMetadata {
  schemaVersion: typeof PNG_MASK_CODEC_SCHEMA_VERSION;
  codecKind: PngMaskCodecKind;
  codecVersion: typeof PNG_MASK_CODEC_VERSION;
  colorType: 'grayscale';
  bitDepth: 8;
  alphaEncoding: PngMaskAlphaEncoding;
  compression: 'zlib-stored-deflate';
  filter: 'none';
  nativeBinding: false;
  dependency: 'none';
}

export interface PngMaskSidecarMetadata {
  schemaVersion: typeof PNG_MASK_SIDECAR_SCHEMA_VERSION;
  maskId: string;
  sampleId: string;
  imageId?: string;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  width: number;
  height: number;
  coordinateSpace: 'image-pixel';
  alphaEncoding: PngMaskAlphaEncoding;
  codecKind: PngMaskCodecKind;
  codecVersion: typeof PNG_MASK_CODEC_VERSION;
  checksum: string;
  sourceAlphaGridChecksum?: string;
  sourceBinaryMaskChecksum?: string;
}

export interface PngMaskRoundTripReport {
  schemaVersion: typeof PNG_MASK_CODEC_SCHEMA_VERSION;
  reportId: string;
  readiness: PngMaskCodecReadiness;
  checkedAt: string;
  artifactCount: number;
  maxAlphaDelta: number;
  meanAlphaDelta: number;
  changedPixelRatio: number;
  blockingIssues: TrainingBridgeValidationIssue[];
  warnings: TrainingBridgeValidationIssue[];
}

export interface PngMaskCodecIssue extends TrainingBridgeValidationIssue {
  codecKind?: PngMaskCodecKind;
  artifactId?: string;
  sampleId?: string;
}

export interface PngMaskCodecValidationResult {
  schemaVersion: typeof PNG_MASK_CODEC_SCHEMA_VERSION;
  readiness: PngMaskCodecReadiness;
  valid: boolean;
  issues: PngMaskCodecIssue[];
  metadata?: PngMaskCodecMetadata;
}

export const createPngMaskCodecMetadata = (): PngMaskCodecMetadata => ({
  schemaVersion: PNG_MASK_CODEC_SCHEMA_VERSION,
  codecKind: 'png',
  codecVersion: PNG_MASK_CODEC_VERSION,
  colorType: 'grayscale',
  bitDepth: 8,
  alphaEncoding: 'uint8-alpha',
  compression: 'zlib-stored-deflate',
  filter: 'none',
  nativeBinding: false,
  dependency: 'none',
});
