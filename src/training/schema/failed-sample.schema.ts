import type { CosmeticSegmentationTarget } from '../../vision';

export const FAILED_SAMPLE_SCHEMA_VERSION = 'failed-sample-quarantine-v0.1' as const;

export type FailedSampleReason =
  | 'missing-image-reference'
  | 'missing-mask-artifact'
  | 'missing-diff-artifact'
  | 'invalid-mask-shape'
  | 'invalid-diff-shape'
  | 'checksum-mismatch'
  | 'low-quality-score'
  | 'unsupported-region'
  | 'split-leakage-risk'
  | 'artifact-format-unsupported'
  | 'insufficient-region-samples'
  | 'invalid-alpha-grid'
  | 'incompatible-mask-size'
  | 'evaluation-sample-missing-target'
  | 'baseline-prediction-failed'
  | 'unsupported-baseline-region'
  | 'missing-pixel-artifact'
  | 'invalid-pixel-artifact'
  | 'pixel-mask-size-mismatch'
  | 'insufficient-positive-pixels'
  | 'insufficient-negative-pixels'
  | 'skin-baseline-unavailable'
  | 'feature-extraction-failed'
  | 'image-conditioned-prediction-failed'
  | 'missing-binary-mask-artifact'
  | 'invalid-binary-mask-artifact'
  | 'binary-mask-roundtrip-failed'
  | 'missing-binary-diff-artifact'
  | 'invalid-binary-diff-artifact'
  | 'pixel-mask-alignment-failed'
  | 'insufficient-classifier-positive-samples'
  | 'insufficient-classifier-negative-samples'
  | 'classifier-training-failed'
  | 'classifier-prediction-failed'
  | 'feature-normalization-failed'
  | 'raw-rgba-read-failed'
  | 'raw-rgba-roundtrip-failed'
  | 'png-mask-unsupported'
  | 'png-mask-read-failed'
  | 'artifact-manifest-link-missing'
  | 'artifact-manifest-checksum-mismatch'
  | 'coordinate-space-mismatch'
  | 'provider-compatibility-failed'
  | 'export-package-validation-failed'
  | 'full-region-coverage-insufficient'
  | 'png-image-decode-failed'
  | 'png-image-roundtrip-failed'
  | 'png-image-sidecar-missing'
  | 'png-image-sidecar-mismatch'
  | 'png-image-checksum-mismatch'
  | 'png-image-dimension-mismatch'
  | 'png-image-color-space-mismatch'
  | 'png-image-lineage-mismatch'
  | 'image-mask-codec-mismatch'
  | 'image-artifact-resolution-failed'
  | 'png-alpha-mask-encode-failed'
  | 'png-alpha-mask-decode-failed'
  | 'png-alpha-mask-roundtrip-failed'
  | 'png-diff-heatmap-failed'
  | 'codec-sidecar-missing'
  | 'codec-sidecar-mismatch'
  | 'png-mask-checksum-mismatch'
  | 'png-mask-dimension-mismatch'
  | 'png-mask-coordinate-space-mismatch'
  | 'png-mask-lineage-mismatch'
  | 'runtime-smoke-failed'
  | 'onnx-prototype-generation-failed'
  | 'onnx-prototype-validation-failed';

export type FailedSampleSeverity = 'warning' | 'blocking';

export interface FailedTrainingSample {
  sampleId: string;
  regionId: CosmeticSegmentationTarget | 'unknown';
  reason: FailedSampleReason;
  severity: FailedSampleSeverity;
  message: string;
}

export interface FailedSampleQuarantine {
  schemaVersion: typeof FAILED_SAMPLE_SCHEMA_VERSION;
  quarantineId: string;
  datasetId: string;
  createdAt: string;
  failedSamples: FailedTrainingSample[];
}

export interface FailedSampleQuarantineReport {
  schemaVersion: typeof FAILED_SAMPLE_SCHEMA_VERSION;
  quarantineId: string;
  failedSampleCount: number;
  blockingCount: number;
  warningCount: number;
  reasonCounts: Record<string, number>;
}
