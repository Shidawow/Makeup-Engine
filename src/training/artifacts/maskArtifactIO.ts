import type { OfflineMaskArtifact } from '../../templates/schema';
import type { CosmeticSegmentationTarget } from '../../vision';
import type { TrainingBridgeValidationIssue } from '../schema';

export type MaskArtifactFormat =
  | 'json-alpha-grid'
  | 'png-alpha-mask-placeholder'
  | 'binary-alpha-mask-placeholder';

export interface MaskArtifactReadOptions {
  format?: MaskArtifactFormat;
  sourceArtifactUri?: string;
}

export interface MaskArtifactWriteOptions {
  format: MaskArtifactFormat;
  referenceUri: string;
}

export interface TrainingMaskArtifactPayload {
  format: MaskArtifactFormat;
  width: number;
  height: number;
  regionId: CosmeticSegmentationTarget;
  target: CosmeticSegmentationTarget;
  alphaGrid: {
    width: number;
    height: number;
    alpha: number[];
  } | null;
  alphaStats: OfflineMaskArtifact['alphaStats'];
  bounds: OfflineMaskArtifact['bounds'];
  checksum: string;
  sourceArtifactUri: string;
}

const issue = (
  code: string,
  message: string,
): TrainingBridgeValidationIssue => ({
  severity: 'error',
  code,
  message,
});

export const convertJsonMaskToTrainingMaskPayload = (
  artifact: OfflineMaskArtifact,
  options: MaskArtifactReadOptions = {},
): TrainingMaskArtifactPayload => ({
  format: options.format ?? 'json-alpha-grid',
  width: artifact.width,
  height: artifact.height,
  regionId: artifact.regionId,
  target: artifact.target,
  alphaGrid: {
    width: artifact.width,
    height: artifact.height,
    alpha: [],
  },
  alphaStats: artifact.alphaStats,
  bounds: artifact.bounds,
  checksum: artifact.checksum,
  sourceArtifactUri: options.sourceArtifactUri ?? artifact.referenceUri,
});

export const validateTrainingMaskArtifactPayload = (
  payload: TrainingMaskArtifactPayload,
): TrainingBridgeValidationIssue[] => [
  ...(payload.width <= 0 ? [issue('mask-width-invalid', 'mask width must be positive')] : []),
  ...(payload.height <= 0 ? [issue('mask-height-invalid', 'mask height must be positive')] : []),
  ...(payload.checksum.length === 0
    ? [issue('mask-checksum-missing', 'mask checksum is required')]
    : []),
  ...(payload.format !== 'json-alpha-grid' && payload.alphaGrid !== null
    ? [issue('mask-placeholder-invalid', 'placeholder formats must not include alpha grid')]
    : []),
];

export const readTrainingMaskArtifact = (
  artifact: OfflineMaskArtifact,
  options: MaskArtifactReadOptions = {},
): TrainingMaskArtifactPayload => {
  if (
    options.format === 'png-alpha-mask-placeholder' ||
    options.format === 'binary-alpha-mask-placeholder'
  ) {
    return {
      ...convertJsonMaskToTrainingMaskPayload(artifact, options),
      alphaGrid: null,
    };
  }

  return convertJsonMaskToTrainingMaskPayload(artifact, options);
};

export const writeTrainingMaskArtifactMetadata = (
  payload: TrainingMaskArtifactPayload,
  options: MaskArtifactWriteOptions,
): TrainingMaskArtifactPayload => ({
  ...payload,
  format: options.format,
  sourceArtifactUri: options.referenceUri,
  alphaGrid:
    options.format === 'json-alpha-grid'
      ? payload.alphaGrid
      : null,
});

export const summarizeTrainingMaskPayload = (
  payload: TrainingMaskArtifactPayload,
): string =>
  `${payload.format}:${payload.regionId}:${payload.width}x${payload.height}:active=${payload.alphaStats.activeRatio}`;
