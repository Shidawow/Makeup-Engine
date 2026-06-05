import type { OfflineMaskArtifact } from '../../templates/schema';
import type { TrainingBridgeValidationIssue } from '../schema';

export type DiffArtifactFormat =
  | 'json-diff-grid'
  | 'png-diff-heatmap-placeholder'
  | 'binary-diff-placeholder';

export interface TrainingDiffArtifactPayload {
  format: DiffArtifactFormat;
  correctionType: string;
  changedAreaRatio: number;
  edgeShiftScore: number;
  alphaDeltaMean: number;
  affectedBounds: OfflineMaskArtifact['bounds'];
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

export const convertJsonDiffToTrainingDiffPayload = (
  artifact: OfflineMaskArtifact,
  format: DiffArtifactFormat = 'json-diff-grid',
): TrainingDiffArtifactPayload => ({
  format,
  correctionType: 'artifact-diff',
  changedAreaRatio: artifact.alphaStats.activeRatio,
  edgeShiftScore: 0,
  alphaDeltaMean: artifact.alphaStats.mean,
  affectedBounds: artifact.bounds,
  checksum: artifact.checksum,
  sourceArtifactUri: artifact.referenceUri,
});

export const readTrainingDiffArtifact = (
  artifact: OfflineMaskArtifact,
  format: DiffArtifactFormat = 'json-diff-grid',
): TrainingDiffArtifactPayload =>
  convertJsonDiffToTrainingDiffPayload(artifact, format);

export const writeTrainingDiffArtifactMetadata = (
  payload: TrainingDiffArtifactPayload,
  format: DiffArtifactFormat,
): TrainingDiffArtifactPayload => ({
  ...payload,
  format,
});

export const validateTrainingDiffArtifactPayload = (
  payload: TrainingDiffArtifactPayload,
): TrainingBridgeValidationIssue[] => [
  ...(payload.checksum.length === 0
    ? [issue('diff-checksum-missing', 'diff checksum is required')]
    : []),
  ...(payload.changedAreaRatio < 0 || payload.changedAreaRatio > 1
    ? [issue('diff-area-invalid', 'changedAreaRatio must stay in 0..1')]
    : []),
];

export const summarizeTrainingDiffPayload = (
  payload: TrainingDiffArtifactPayload,
): string =>
  `${payload.format}:changed=${payload.changedAreaRatio}:alphaDelta=${payload.alphaDeltaMean}`;
