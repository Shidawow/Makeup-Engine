import type {
  DatasetReviewQueue,
  HumanCorrectionDataset,
  OfflineOperatorAuditReport,
  OfflinePackageValidationResult,
  SegmentationTrainingManifest,
} from '../schema';
import { OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';
import { stableHash, stableStringify } from './datasetExport';

const REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const emptyRegionCounts = (): Record<CosmeticSegmentationTarget, number> =>
  Object.fromEntries(REGIONS.map((region) => [region, 0])) as Record<
    CosmeticSegmentationTarget,
    number
  >;

export const summarizeOperatorActions = (
  dataset: HumanCorrectionDataset,
): OfflineOperatorAuditReport['correctionSummary'] => {
  const regionCounts = emptyRegionCounts();

  for (const sample of dataset.samples) {
    regionCounts[sample.regionId] += 1;
  }

  return {
    totalCorrections: dataset.samples.length,
    regionCounts,
    averageCorrectionConfidence:
      dataset.samples.length === 0
        ? 0
        : Number(
            (
              dataset.samples.reduce(
                (sum, sample) => sum + sample.correctionConfidence,
                0,
              ) / dataset.samples.length
            ).toFixed(4),
          ),
  };
};

export const summarizeReviewDecisions = (
  queue: DatasetReviewQueue | null,
): OfflineOperatorAuditReport['reviewSummary'] => {
  const reviewerCounts: Record<string, number> = {};

  for (const item of queue?.items ?? []) {
    const reviewerId = item.currentDecision.reviewerMetadata.reviewerId;
    reviewerCounts[reviewerId] = (reviewerCounts[reviewerId] ?? 0) + 1;
  }

  return {
    accepted: queue?.summary.accepted ?? 0,
    rejected: queue?.summary.rejected ?? 0,
    needsSecondReview: queue?.summary.needsSecondReview ?? 0,
    readyForTraining: queue?.summary.readyForTraining ?? 0,
    reviewerCounts: Object.fromEntries(
      Object.entries(reviewerCounts).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  };
};

export const summarizeCorrectionVolume = (
  dataset: HumanCorrectionDataset,
): string =>
  `${dataset.samples.length} corrections across ${dataset.summary.regions.length} regions`;

export const summarizeRejectedReasons = (
  queue: DatasetReviewQueue | null,
): Record<string, number> => {
  const counts: Record<string, number> = {};

  for (const item of queue?.items ?? []) {
    if (item.currentDecision.status !== 'rejected') {
      continue;
    }

    for (const reason of item.currentDecision.reasons) {
      counts[reason] = (counts[reason] ?? 0) + 1;
    }
  }

  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
};

export const summarizeDatasetReadiness = (input: {
  manifest: SegmentationTrainingManifest;
  validation: OfflinePackageValidationResult;
}): OfflineOperatorAuditReport['readinessSummary'] => ({
  trainingReadySamples: input.manifest.targetSummary.totalSamples,
  blockedSamples: input.manifest.targetSummary.excludedSampleIds.length,
  validationPassed: input.validation.valid,
  warnings: [...input.validation.warnings],
});

const recommendations = (
  validation: OfflinePackageValidationResult,
): string[] => {
  const output = [
    ...(validation.summary.splitCompleteness.validation
      ? []
      : ['补充或重新分配 validation split 样本。']),
    ...(validation.summary.splitCompleteness.test
      ? []
      : ['补充或重新分配 test split 样本。']),
    ...(validation.summary.leakageIssueCount > 0
      ? ['处理 train/test 泄漏后再交给训练 pipeline。']
      : []),
    ...(validation.valid ? ['可以进入离线训练准备阶段。'] : []),
  ];

  return output.length > 0 ? output : ['继续积累更多区域均衡样本。'];
};

export const createOperatorAuditReport = (input: {
  packageId: string;
  dataset: HumanCorrectionDataset;
  manifest: SegmentationTrainingManifest;
  queue?: DatasetReviewQueue | null;
  validation: OfflinePackageValidationResult;
  createdAt?: string;
}): OfflineOperatorAuditReport => {
  const createdAt = input.createdAt ?? input.manifest.createdAt;
  const stableIdentity = {
    packageId: input.packageId,
    datasetId: input.dataset.datasetId,
    manifestId: input.manifest.manifestId,
    validation: input.validation.valid,
    createdAt,
  };

  return {
    schemaVersion: OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION,
    reportId: `operator-audit-${stableHash(stableIdentity)}`,
    packageId: input.packageId,
    sourceReviewedDatasetId: input.dataset.datasetId,
    sourceTrainingManifestId: input.manifest.manifestId,
    createdAt,
    correctionSummary: summarizeOperatorActions(input.dataset),
    reviewSummary: summarizeReviewDecisions(input.queue ?? null),
    rejectedReasonSummary: summarizeRejectedReasons(input.queue ?? null),
    readinessSummary: summarizeDatasetReadiness({
      manifest: input.manifest,
      validation: input.validation,
    }),
    recommendations: recommendations(input.validation),
  };
};

export const exportOperatorAuditReportJson = (
  report: OfflineOperatorAuditReport,
): string => stableStringify(report);
