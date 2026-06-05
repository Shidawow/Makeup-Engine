import type {
  DatasetCurationMetrics,
  DatasetManifest,
  DatasetQualityStatus,
  DatasetReviewQueue,
  DatasetReviewReason,
  DatasetSplit,
  HumanCorrectionDataset,
} from '../schema';
import { DATASET_METRICS_SCHEMA_VERSION } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';
import type { ImageQualityAssessment } from '../../vision/image-quality';
import { validateReviewQueueSplitLeakage } from './datasetReviewQueue';

const REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const REASONS: DatasetReviewReason[] = [
  'mask_boundary_error',
  'wrong_region',
  'low_confidence',
  'semantic_drift',
  'bad_source_image',
  'duplicate_sample',
  'insufficient_makeup_signal',
  'editor_uncertain',
  'accepted_clean',
  'accepted_minor_issue',
];

const STATUSES: DatasetQualityStatus[] = [
  'pending_review',
  'accepted',
  'rejected',
  'needs_second_review',
  'ready_for_training',
  'excluded',
];

const SPLITS: DatasetSplit[] = [
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
];

const round4 = (value: number): number => Number(value.toFixed(4));

const countRecord = <T extends string>(keys: readonly T[]): Record<T, number> =>
  Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : round4(values.reduce((sum, value) => sum + value, 0) / values.length);

export const computeRegionDistribution = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['regionDistribution'] => {
  const totalByRegion = countRecord(REGIONS);
  const acceptedByRegion = countRecord(REGIONS);
  const trainingReadyByRegion = countRecord(REGIONS);

  for (const item of queue.items) {
    totalByRegion[item.regionId] += 1;

    if (
      item.currentDecision.status === 'accepted' ||
      item.currentDecision.status === 'ready_for_training'
    ) {
      acceptedByRegion[item.regionId] += 1;
    }

    if (item.evidenceSummary.isTrainingReady) {
      trainingReadyByRegion[item.regionId] += 1;
    }
  }

  const missingRegions = REGIONS.filter((region) => totalByRegion[region] === 0);
  const dominantRegion =
    [...REGIONS].sort((left, right) => totalByRegion[right] - totalByRegion[left])[0] ??
    null;

  return {
    totalByRegion,
    acceptedByRegion,
    trainingReadyByRegion,
    missingRegions,
    dominantRegion: totalByRegion[dominantRegion] > 0 ? dominantRegion : null,
  };
};

export const computeReviewReasonDistribution = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['reviewReasonDistribution'] => {
  const totalByReason = countRecord(REASONS);

  for (const item of queue.items) {
    for (const reason of item.reviewReasons) {
      totalByReason[reason] += 1;
    }
  }

  return {
    totalByReason,
    rejectionReasons: REASONS.filter((reason) =>
      queue.items.some(
        (item) =>
          item.currentDecision.status === 'rejected' &&
          item.reviewReasons.includes(reason),
      ),
    ),
    secondReviewReasons: REASONS.filter((reason) =>
      queue.items.some(
        (item) =>
          item.currentDecision.status === 'needs_second_review' &&
          item.reviewReasons.includes(reason),
      ),
    ),
  };
};

export const computeQualityDistribution = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['qualityScoreDistribution'] => {
  const totalByStatus = countRecord(STATUSES);

  for (const item of queue.items) {
    totalByStatus[item.currentDecision.status] += 1;
  }

  return {
    totalByStatus,
    scoreBuckets: {
      low: queue.items.filter((item) => item.qualityScore < 0.5).length,
      medium: queue.items.filter(
        (item) => item.qualityScore >= 0.5 && item.qualityScore < 0.75,
      ).length,
      high: queue.items.filter((item) => item.qualityScore >= 0.75).length,
    },
    averageQualityScore: average(queue.items.map((item) => item.qualityScore)),
    averageEvidenceConfidence: average(
      queue.items.map((item) => item.evidenceSummary.evidenceConfidence),
    ),
  };
};

export const computeReviewerConsistency = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['reviewerCorrectionStats'] => {
  const decisionsByReviewer: Record<string, number> = {};
  const acceptedByReviewer: Record<string, number> = {};

  for (const item of queue.items) {
    const reviewerId = item.currentDecision.reviewerMetadata.reviewerId;

    decisionsByReviewer[reviewerId] = (decisionsByReviewer[reviewerId] ?? 0) + 1;
    if (
      item.currentDecision.status === 'accepted' ||
      item.currentDecision.status === 'ready_for_training'
    ) {
      acceptedByReviewer[reviewerId] = (acceptedByReviewer[reviewerId] ?? 0) + 1;
    }
  }

  return {
    reviewerCount: Object.keys(decisionsByReviewer).length,
    decisionsByReviewer,
    acceptanceRateByReviewer: Object.fromEntries(
      Object.entries(decisionsByReviewer)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([reviewerId, total]) => [
          reviewerId,
          round4((acceptedByReviewer[reviewerId] ?? 0) / Math.max(1, total)),
        ]),
    ),
    secondReviewRate: round4(
      queue.items.filter(
        (item) => item.currentDecision.status === 'needs_second_review',
      ).length / Math.max(1, queue.items.length),
    ),
  };
};

export const computeSplitBalance = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['splitDistribution'] => {
  const splitDistribution = countRecord(SPLITS);

  for (const item of queue.items) {
    splitDistribution[item.assignedSplit] += 1;
  }

  const total = Math.max(1, queue.items.length);
  const trainRatio = round4(splitDistribution.train / total);
  const validationRatio = round4(splitDistribution.validation / total);
  const testRatio = round4(splitDistribution.test / total);
  const imbalanceWarnings = [
    ...(trainRatio > 0.9 ? ['train split dominates dataset'] : []),
    ...(queue.items.length >= 3 && splitDistribution.validation === 0
      ? ['validation split is empty']
      : []),
    ...(queue.items.length >= 3 && splitDistribution.test === 0
      ? ['test split is empty']
      : []),
  ];

  return {
    splitDistribution,
    trainRatio,
    validationRatio,
    testRatio,
    imbalanceWarnings,
  };
};

export const computeTrainingReadiness = (
  queue: DatasetReviewQueue,
): DatasetCurationMetrics['trainingReadinessScore'] => {
  const accepted = queue.items.filter(
    (item) =>
      item.currentDecision.status === 'accepted' ||
      item.currentDecision.status === 'ready_for_training',
  ).length;
  const trainingReady = queue.items.filter(
    (item) => item.evidenceSummary.isTrainingReady,
  ).length;
  const leakagePenalty = validateReviewQueueSplitLeakage(queue).valid ? 0 : 0.2;
  const score =
    (accepted / Math.max(1, queue.items.length)) * 0.42 +
    (trainingReady / Math.max(1, queue.items.length)) * 0.42 +
    average(queue.items.map((item) => item.qualityScore)) * 0.16 -
    leakagePenalty;

  return round4(Math.max(0, Math.min(1, score)));
};

export const detectDatasetImbalance = (
  queue: DatasetReviewQueue,
): string[] => {
  const regionDistribution = computeRegionDistribution(queue);
  const total = Math.max(1, queue.items.length);

  return [
    ...regionDistribution.missingRegions.map((region) => `missing region:${region}`),
    ...REGIONS.filter((region) => regionDistribution.totalByRegion[region] / total > 0.6)
      .map((region) => `region dominates:${region}`),
    ...computeSplitBalance(queue).imbalanceWarnings,
  ].sort();
};

export const summarizeDatasetRisks = (
  input: {
    queue: DatasetReviewQueue;
    manifest?: DatasetManifest | null;
  },
): DatasetCurationMetrics['riskSummary'] => {
  const leakageValidation = validateReviewQueueSplitLeakage(input.queue);
  const duplicateImageIds =
    input.manifest?.imageDeduplicationSummary.duplicateIds ?? [];
  const duplicateTemplateIds =
    input.manifest?.templateDeduplicationSummary.duplicateIds ?? [];
  const imbalanceWarnings = detectDatasetImbalance(input.queue);
  const duplicateRiskScore = round4(
    (duplicateImageIds.length + duplicateTemplateIds.length) /
      Math.max(1, input.queue.items.length),
  );
  const highRisk =
    !leakageValidation.valid ||
    duplicateRiskScore > 0.35 ||
    imbalanceWarnings.length >= 4;

  return {
    duplicateRiskSummary: {
      duplicateImageIds,
      duplicateTemplateIds,
      duplicateRiskScore,
    },
    leakageRiskSummary: {
      hasTrainTestLeakage: !leakageValidation.valid,
      leakageIds: leakageValidation.issues.map((issue) => issue.id).sort(),
    },
    imbalanceWarnings,
    riskLevel: highRisk ? 'high' : imbalanceWarnings.length > 0 ? 'medium' : 'low',
  };
};

export const computeDatasetCurationMetrics = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  manifest?: DatasetManifest | null;
  imageQualityAssessments?: readonly ImageQualityAssessment[];
  createdAt?: string;
}): DatasetCurationMetrics => {
  const regionDistribution = computeRegionDistribution(input.queue);
  const qualityScoreDistribution = computeQualityDistribution(input.queue);
  const splitDistribution = computeSplitBalance(input.queue);
  const riskSummary = summarizeDatasetRisks({
    queue: input.queue,
    manifest: input.manifest,
  });
  const acceptedSamples = input.queue.items.filter(
    (item) =>
      item.currentDecision.status === 'accepted' ||
      item.currentDecision.status === 'ready_for_training',
  ).length;
  const rejectedSamples = input.queue.items.filter(
    (item) =>
      item.currentDecision.status === 'rejected' ||
      item.currentDecision.status === 'excluded',
  ).length;
  const trainingReadySamples = input.queue.items.filter(
    (item) => item.evidenceSummary.isTrainingReady,
  ).length;
  const lowQualityImageIds = (input.imageQualityAssessments ?? [])
    .filter((assessment) => assessment.overallImageQualityScore < 0.68)
    .map((assessment) => assessment.imageId)
    .sort();
  const trainingReadinessScore = computeTrainingReadiness(input.queue);

  return {
    schemaVersion: DATASET_METRICS_SCHEMA_VERSION,
    datasetId: input.dataset.datasetId,
    queueId: input.queue.queueId,
    createdAt: input.createdAt ?? input.queue.updatedAt,
    totalSamples: input.queue.items.length,
    acceptedSamples,
    rejectedSamples,
    trainingReadySamples,
    regionDistribution,
    reviewReasonDistribution: computeReviewReasonDistribution(input.queue),
    splitDistribution,
    qualityScoreDistribution,
    evidenceConfidenceDistribution: {
      average: qualityScoreDistribution.averageEvidenceConfidence,
      lowConfidenceSamples: input.queue.items
        .filter((item) => item.evidenceSummary.evidenceConfidence < 0.65)
        .map((item) => item.sampleId)
        .sort(),
    },
    reviewerCorrectionStats: computeReviewerConsistency(input.queue),
    imageQualitySummary: {
      assessedSamples: input.imageQualityAssessments?.length ?? 0,
      averageOverallImageQualityScore: average(
        (input.imageQualityAssessments ?? []).map(
          (assessment) => assessment.overallImageQualityScore,
        ),
      ),
      lowQualityImageIds,
      reasons: Array.from(
        new Set(
          (input.imageQualityAssessments ?? []).flatMap(
            (assessment) => assessment.reasons,
          ),
        ),
      ).sort(),
    },
    duplicateRiskSummary: riskSummary.duplicateRiskSummary,
    leakageRiskSummary: riskSummary.leakageRiskSummary,
    imbalanceWarnings: riskSummary.imbalanceWarnings,
    trainingReadinessScore,
    riskSummary,
  };
};
