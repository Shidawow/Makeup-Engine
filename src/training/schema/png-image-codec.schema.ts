import type { TrainingBridgeValidationIssue } from './training-bridge.schema';

export const PNG_IMAGE_CODEC_SCHEMA_VERSION = 'png-image-codec-v0.1' as const;
export const PNG_IMAGE_SIDECAR_SCHEMA_VERSION = 'png-image-sidecar.v1' as const;
export const PNG_IMAGE_CODEC_VERSION = 'makeup-engine-png-image-rgba-v0.1' as const;

export type PngImageCodecKind = 'png';
export type PngImageColorType = 'grayscale' | 'rgb' | 'rgba';
export type PngImageAlphaMode = 'straight-alpha' | 'opaque';
export type PngImageCodecReadiness = 'ready' | 'warning' | 'blocked' | 'not-requested';

export interface PngImageCodecMetadata {
  schemaVersion: typeof PNG_IMAGE_CODEC_SCHEMA_VERSION;
  codecKind: PngImageCodecKind;
  codecVersion: typeof PNG_IMAGE_CODEC_VERSION;
  supportedColorTypes: PngImageColorType[];
  bitDepth: 8;
  outputChannels: 4;
  colorSpace: 'srgb';
  compression: 'zlib-stored-deflate';
  filter: 'none';
  nativeBinding: false;
  dependency: 'none';
}

export interface PngImageSidecarMetadata {
  schemaVersion: typeof PNG_IMAGE_SIDECAR_SCHEMA_VERSION;
  imageId: string;
  sampleId?: string;
  width: number;
  height: number;
  channels: 4;
  colorSpace: 'srgb';
  alphaMode: PngImageAlphaMode;
  codecKind: PngImageCodecKind;
  codecVersion: typeof PNG_IMAGE_CODEC_VERSION;
  checksum: string;
  source: 'training-fixture' | 'materialized-image-reference';
}

export interface PngImageDecodeReport {
  schemaVersion: typeof PNG_IMAGE_CODEC_SCHEMA_VERSION;
  reportId: string;
  readiness: PngImageCodecReadiness;
  checkedAt: string;
  artifactCount: number;
  maxChannelDelta: number;
  meanChannelDelta: number;
  changedPixelRatio: number;
  blockingIssues: TrainingBridgeValidationIssue[];
  warnings: TrainingBridgeValidationIssue[];
}

export interface PngImageCodecIssue extends TrainingBridgeValidationIssue {
  codecKind?: PngImageCodecKind;
  imageId?: string;
}

export interface PngImageCodecValidationResult {
  schemaVersion: typeof PNG_IMAGE_CODEC_SCHEMA_VERSION;
  readiness: PngImageCodecReadiness;
  valid: boolean;
  issues: PngImageCodecIssue[];
  metadata?: PngImageCodecMetadata;
}

export const createPngImageCodecMetadata = (): PngImageCodecMetadata => ({
  schemaVersion: PNG_IMAGE_CODEC_SCHEMA_VERSION,
  codecKind: 'png',
  codecVersion: PNG_IMAGE_CODEC_VERSION,
  supportedColorTypes: ['grayscale', 'rgb', 'rgba'],
  bitDepth: 8,
  outputChannels: 4,
  colorSpace: 'srgb',
  compression: 'zlib-stored-deflate',
  filter: 'none',
  nativeBinding: false,
  dependency: 'none',
});
