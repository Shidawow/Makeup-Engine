import type {
  DatasetReviewItem,
  DatasetReviewQueue,
  DatasetSplit,
  HumanCorrectionDataset,
  SegmentationTrainingManifest,
  TrainingDatasetAdapterConfig,
  TrainingMaskTarget,
  TrainingSampleReference,
  TrainingSplitBundle,
  TrainingTargetSummary,
} from '../schema';
import { TRAINING_ADAPTER_SCHEMA_VERSION } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';
import { stableHash } from './datasetExport';
import { validateReviewQueueSplitLeakage } from './datasetReviewQueue';

const REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const TRAINING_SPLITS: DatasetSplit[] = ['train', 'validation', 'test'];

export const defaultTrainingAdapterConfig =
  (): TrainingDatasetAdapterConfig => ({
    schemaVersion: TRAINING_ADAPTER_SCHEMA_VERSION,
    includeRegions: [...REGIONS],
    minQualityScore: 0.74,
    includeDiffHeatmap: true,
    allowTrainTestLeakage: false,
  });

export const filterTrainingReadySamples = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  config?: TrainingDatasetAdapterConfig;
}): Array<{
  item: DatasetReviewItem;
  sample: HumanCorrectionDataset['samples'][number];
}> => {
  const config = input.config ?? defaultTrainingAdapterConfig();
  const sampleById = new Map(
    input.dataset.samples.map((sample) => [sample.sampleId, sample]),
  );

  return input.queue.items
    .filter(
      (item) =>
        (item.currentDecision.status === 'accepted' ||
          item.currentDecision.status === 'ready_for_training') &&
        item.evidenceSummary.isTrainingReady &&
        TRAINING_SPLITS.includes(item.assignedSplit) &&
        item.qualityScore >= config.minQualityScore &&
        config.includeRegions.includes(item.regionId),
    )
    .map((item) => ({
      item,
      sample: sampleById.get(item.sampleId),
    }))
    .filter(
      (entry): entry is {
        item: DatasetReviewItem;
        sample: HumanCorrectionDataset['samples'][number];
      } => Boolean(entry.sample),
    )
    .sort((left, right) => left.item.sampleId.localeCompare(right.item.sampleId));
};

const sampleWeight = (item: DatasetReviewItem): number =>
  Number(
    Math.max(
      0.1,
      Math.min(
        1,
        item.qualityScore * 0.7 + item.evidenceSummary.correctionConfidence * 0.3,
      ),
    ).toFixed(4),
  );

const createMaskTarget = (
  sample: HumanCorrectionDataset['samples'][number],
): TrainingMaskTarget => ({
  regionId: sample.regionId,
  originalMaskId: sample.originalSegmentationMask.id,
  humanEditedMaskId: sample.humanEditedMask.id,
  diffHeatmapId: `${sample.sampleId}:diffHeatmap`,
  maskDiffSummary: {
    changedAreaRatio: sample.maskDiff.changedAreaRatio,
    edgeShiftScore: sample.maskDiff.edgeShiftScore,
    alphaDeltaMean: sample.maskDiff.alphaDeltaMean,
  },
});

export const createTrainingSampleReferences = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  config?: TrainingDatasetAdapterConfig;
}): TrainingSampleReference[] =>
  filterTrainingReadySamples(input).map(({ item, sample }) => ({
    sampleId: sample.sampleId,
    imageId: sample.imageId,
    templateId: sample.templateId,
    split: item.assignedSplit,
    qualityScore: item.qualityScore,
    sampleWeight: sampleWeight(item),
    imageReference: `image:${sample.imageId}`,
    maskTarget: createMaskTarget(sample),
    excludeReasons: [],
  }));

export const createTrainingSplitBundle = (
  split: DatasetSplit,
  references: readonly TrainingSampleReference[],
): TrainingSplitBundle => {
  const samples = references
    .filter((reference) => reference.split === split)
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));

  return {
    split,
    sampleCount: samples.length,
    samples,
  };
};

export const summarizeTrainingTargets = (
  references: readonly TrainingSampleReference[],
  excludedSampleIds: readonly string[] = [],
): TrainingTargetSummary => {
  const regionCounts = Object.fromEntries(
    REGIONS.map((region) => [region, 0]),
  ) as Record<CosmeticSegmentationTarget, number>;

  for (const reference of references) {
    regionCounts[reference.maskTarget.regionId] += 1;
  }

  return {
    totalSamples: references.length,
    regionCounts,
    averageSampleWeight:
      references.length === 0
        ? 0
        : Number(
            (
              references.reduce(
                (sum, reference) => sum + reference.sampleWeight,
                0,
              ) / references.length
            ).toFixed(4),
          ),
    excludedSampleIds: [...excludedSampleIds].sort(),
  };
};

export const validateTrainingManifest = (
  manifest: SegmentationTrainingManifest,
): SegmentationTrainingManifest['validationResult'] => {
  const samples = [
    ...manifest.train.samples,
    ...manifest.validation.samples,
    ...manifest.test.samples,
  ];
  const errors = [
    ...(manifest.train.sampleCount === 0 ? ['train split is empty'] : []),
    ...samples
      .filter((sample) => sample.excludeReasons.length > 0)
      .map((sample) => `sample excluded:${sample.sampleId}`),
  ];
  const warnings = [
    ...(manifest.validation.sampleCount === 0
      ? ['validation split is empty']
      : []),
    ...(manifest.test.sampleCount === 0 ? ['test split is empty'] : []),
  ];

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    leakageValidation: manifest.validationResult.leakageValidation,
  };
};

export const createSegmentationTrainingManifest = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  config?: TrainingDatasetAdapterConfig;
  createdAt?: string;
}): SegmentationTrainingManifest => {
  const config = input.config ?? defaultTrainingAdapterConfig();
  const references = createTrainingSampleReferences({
    dataset: input.dataset,
    queue: input.queue,
    config,
  });
  const includedIds = new Set(references.map((reference) => reference.sampleId));
  const excludedSampleIds = input.dataset.samples
    .filter((sample) => !includedIds.has(sample.sampleId))
    .map((sample) => sample.sampleId)
    .sort();
  const leakageValidation = validateReviewQueueSplitLeakage(input.queue, {
    allowTemplateLeakage: config.allowTrainTestLeakage,
    allowImageLeakage: config.allowTrainTestLeakage,
  });
  const initialValidation = {
    valid: false,
    errors: [] as string[],
    warnings: [] as string[],
    leakageValidation: {
      valid: leakageValidation.valid,
      issues: leakageValidation.issues
        .map((issue) => `${issue.leakageType}:${issue.id}`)
        .sort(),
    },
  };
  const manifest: SegmentationTrainingManifest = {
    schemaVersion: TRAINING_ADAPTER_SCHEMA_VERSION,
    manifestId: `training-${stableHash({
      datasetId: input.dataset.datasetId,
      queueId: input.queue.queueId,
      references: references.map((reference) => reference.sampleId),
      config,
    })}`,
    sourceDatasetId: input.dataset.datasetId,
    sourceQueueId: input.queue.queueId,
    createdAt: input.createdAt ?? input.queue.updatedAt,
    config,
    train: createTrainingSplitBundle('train', references),
    validation: createTrainingSplitBundle('validation', references),
    test: createTrainingSplitBundle('test', references),
    holdout: createTrainingSplitBundle('holdout', references),
    unassigned: createTrainingSplitBundle('unassigned', references),
    targetSummary: summarizeTrainingTargets(references, excludedSampleIds),
    validationResult: initialValidation,
  };

  return {
    ...manifest,
    validationResult: validateTrainingManifest(manifest),
  };
};
