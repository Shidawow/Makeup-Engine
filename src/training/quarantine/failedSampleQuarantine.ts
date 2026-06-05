import { stableStringify } from '../../templates/storage/datasetExport';
import type { LoadedTrainingDataset, TrainingBridgeValidationIssue } from '../schema';
import type {
  FailedSampleReason,
  FailedSampleQuarantine,
  FailedSampleQuarantineReport,
  FailedTrainingSample,
} from '../schema/failed-sample.schema';
import { FAILED_SAMPLE_SCHEMA_VERSION } from '../schema/failed-sample.schema';

export const classifyTrainingBridgeIssue = (
  issue: TrainingBridgeValidationIssue,
): FailedSampleReason => {
  if (issue.code.includes('png-mask-checksum')) return 'png-mask-checksum-mismatch';
  if (issue.code.includes('png-mask-dimension')) return 'png-mask-dimension-mismatch';
  if (issue.code.includes('png-mask-coordinate-space')) return 'png-mask-coordinate-space-mismatch';
  if (issue.code.includes('png-mask-lineage')) return 'png-mask-lineage-mismatch';
  if (issue.code.includes('png-image-sidecar-missing')) return 'png-image-sidecar-missing';
  if (issue.code.includes('png-image-sidecar-mismatch')) return 'png-image-sidecar-mismatch';
  if (issue.code.includes('png-image-checksum')) return 'png-image-checksum-mismatch';
  if (issue.code.includes('png-image-dimension')) return 'png-image-dimension-mismatch';
  if (issue.code.includes('png-image-color-space')) return 'png-image-color-space-mismatch';
  if (issue.code.includes('png-image-lineage')) return 'png-image-lineage-mismatch';
  if (issue.code.includes('image-mask-codec')) return 'image-mask-codec-mismatch';
  if (issue.code.includes('image-artifact-resolution')) return 'image-artifact-resolution-failed';
  if (issue.code.includes('checksum')) return 'checksum-mismatch';
  if (issue.code.includes('onnx-prototype-validation')) return 'onnx-prototype-validation-failed';
  if (issue.code.includes('onnx-prototype')) return 'onnx-prototype-generation-failed';
  if (issue.code.includes('runtime-smoke')) return 'runtime-smoke-failed';
  if (issue.code.includes('codec-sidecar-mismatch')) return 'codec-sidecar-mismatch';
  if (issue.code.includes('codec-sidecar')) return 'codec-sidecar-missing';
  if (issue.code.includes('png-image-roundtrip')) return 'png-image-roundtrip-failed';
  if (issue.code.includes('png-image')) return 'png-image-decode-failed';
  if (issue.code.includes('png-alpha-mask-roundtrip')) return 'png-alpha-mask-roundtrip-failed';
  if (issue.code.includes('png-alpha-mask-encode')) return 'png-alpha-mask-encode-failed';
  if (issue.code.includes('png-alpha-mask')) return 'png-alpha-mask-decode-failed';
  if (issue.code.includes('png-diff-heatmap')) return 'png-diff-heatmap-failed';
  if (issue.code.includes('raw-rgba-roundtrip')) return 'raw-rgba-roundtrip-failed';
  if (issue.code.includes('raw-rgba')) return 'raw-rgba-read-failed';
  if (issue.code.includes('png-mask-unsupported')) return 'png-mask-unsupported';
  if (issue.code.includes('png-mask')) return 'png-mask-read-failed';
  if (issue.code.includes('artifact-manifest-link')) return 'artifact-manifest-link-missing';
  if (issue.code.includes('artifact-manifest-checksum')) return 'artifact-manifest-checksum-mismatch';
  if (issue.code.includes('coordinate-space')) return 'coordinate-space-mismatch';
  if (issue.code.includes('provider-compatibility')) return 'provider-compatibility-failed';
  if (issue.code.includes('export-package')) return 'export-package-validation-failed';
  if (issue.code.includes('full-region')) return 'full-region-coverage-insufficient';
  if (issue.code.includes('binary-mask-roundtrip')) return 'binary-mask-roundtrip-failed';
  if (issue.code.includes('binary-mask')) return 'invalid-binary-mask-artifact';
  if (issue.code.includes('binary-diff')) return 'invalid-binary-diff-artifact';
  if (issue.code.includes('pixel-mask')) return 'pixel-mask-alignment-failed';
  if (issue.code.includes('classifier-positive')) return 'insufficient-classifier-positive-samples';
  if (issue.code.includes('classifier-negative')) return 'insufficient-classifier-negative-samples';
  if (issue.code.includes('classifier-prediction')) return 'classifier-prediction-failed';
  if (issue.code.includes('classifier')) return 'classifier-training-failed';
  if (issue.code.includes('normalization')) return 'feature-normalization-failed';
  if (issue.code.includes('alpha-grid')) return 'invalid-alpha-grid';
  if (issue.code.includes('pixel-mask-size')) return 'pixel-mask-size-mismatch';
  if (issue.code.includes('pixel-artifact-invalid')) return 'invalid-pixel-artifact';
  if (issue.code.includes('pixel')) return 'missing-pixel-artifact';
  if (issue.code.includes('feature')) return 'feature-extraction-failed';
  if (issue.code.includes('image-conditioned')) return 'image-conditioned-prediction-failed';
  if (issue.code.includes('mask-size')) return 'incompatible-mask-size';
  if (issue.code.includes('baseline')) return 'baseline-prediction-failed';
  if (issue.code.includes('image')) return 'missing-image-reference';
  if (issue.code.includes('diff')) return 'missing-diff-artifact';
  if (issue.code.includes('mask')) return 'missing-mask-artifact';
  if (issue.code.includes('region')) return 'unsupported-region';
  return 'artifact-format-unsupported';
};

export const addFailedSample = (
  quarantine: FailedSampleQuarantine,
  sample: FailedTrainingSample,
): FailedSampleQuarantine => ({
  ...quarantine,
  failedSamples: [...quarantine.failedSamples, sample].sort((left, right) =>
    `${left.sampleId}:${left.reason}`.localeCompare(`${right.sampleId}:${right.reason}`),
  ),
});

export const createFailedSampleQuarantine = (input: {
  datasetId: string;
  createdAt: string;
  failedSamples?: readonly FailedTrainingSample[];
}): FailedSampleQuarantine => ({
  schemaVersion: FAILED_SAMPLE_SCHEMA_VERSION,
  quarantineId: `quarantine-${input.datasetId}`,
  datasetId: input.datasetId,
  createdAt: input.createdAt,
  failedSamples: [...(input.failedSamples ?? [])].sort((left, right) =>
    `${left.sampleId}:${left.reason}`.localeCompare(`${right.sampleId}:${right.reason}`),
  ),
});

export const quarantineInvalidSamples = (input: {
  dataset: LoadedTrainingDataset;
  minQualityScore?: number;
  createdAt: string;
}): FailedSampleQuarantine => {
  const issueSamples = input.dataset.samples.flatMap((sample) =>
    sample.validationIssues.map((issue) => ({
      sampleId: sample.sampleId,
      regionId: sample.regionId,
      reason: classifyTrainingBridgeIssue(issue),
      severity: issue.severity === 'error' ? 'blocking' as const : 'warning' as const,
      message: issue.message,
    })),
  );
  const lowQuality = input.dataset.samples
    .filter((sample) => sample.qualityScore < (input.minQualityScore ?? 0))
    .map((sample) => ({
      sampleId: sample.sampleId,
      regionId: sample.regionId,
      reason: 'low-quality-score' as const,
      severity: 'warning' as const,
      message: `quality score below ${input.minQualityScore ?? 0}`,
    }));

  return createFailedSampleQuarantine({
    datasetId: input.dataset.summary.datasetId,
    createdAt: input.createdAt,
    failedSamples: [...issueSamples, ...lowQuality],
  });
};

export const summarizeFailedSamples = (
  quarantine: FailedSampleQuarantine,
): FailedSampleQuarantineReport => {
  const reasonCounts = quarantine.failedSamples.reduce<Record<string, number>>(
    (counts, sample) => {
      counts[sample.reason] = (counts[sample.reason] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return {
    schemaVersion: FAILED_SAMPLE_SCHEMA_VERSION,
    quarantineId: quarantine.quarantineId,
    failedSampleCount: quarantine.failedSamples.length,
    blockingCount: quarantine.failedSamples.filter((sample) => sample.severity === 'blocking').length,
    warningCount: quarantine.failedSamples.filter((sample) => sample.severity === 'warning').length,
    reasonCounts: Object.fromEntries(Object.entries(reasonCounts).sort()),
  };
};

export const exportFailedSampleQuarantineJson = (
  quarantine: FailedSampleQuarantine,
): string => stableStringify(quarantine);
