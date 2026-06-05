import type {
  LoadedTrainingDataset,
  TrainingBatch,
  TrainingBatchIteratorConfig,
  TrainingBridgeValidationIssue,
} from '../schema';
import { TRAINING_METRICS_SCHEMA_VERSION, type TrainingDryRunMetrics } from '../schema';
import { createTrainingBatchIterator } from '../iterators/trainingBatchIterator';

export interface SegmentationTrainerConfig {
  trainerId: string;
  batchSize: number;
  minQualityScore: number;
  dryRunOnly: boolean;
}

export interface SegmentationTrainingPlan {
  planId: string;
  trainerId: string;
  datasetId: string;
  sampleCount: number;
  batchCount: number;
  validationIssues: TrainingBridgeValidationIssue[];
  dryRunOnly: true;
}

export interface SegmentationTrainingRun {
  runId: string;
  planId: string;
  status: 'dry_run_completed';
  metrics: TrainingDryRunMetrics;
}

export interface SegmentationTrainingDryRunResult {
  plan: SegmentationTrainingPlan;
  run: SegmentationTrainingRun;
  batches: TrainingBatch[];
}

export interface SegmentationEvaluationPlan {
  evaluationPlanId: string;
  datasetId: string;
  split: 'validation' | 'test';
  sampleCount: number;
}

export interface SegmentationTrainerAdapter {
  createPlan(dataset: LoadedTrainingDataset): SegmentationTrainingPlan;
  dryRun(dataset: LoadedTrainingDataset): SegmentationTrainingDryRunResult;
}

const regionCoverage = (dataset: LoadedTrainingDataset): Record<string, number> =>
  Object.fromEntries(
    dataset.regionTargets.map((target) => [target.regionId, target.sampleCount]),
  );

const splitBalance = (dataset: LoadedTrainingDataset): Record<string, number> =>
  dataset.summary.splitCounts;

const readinessScore = (dataset: LoadedTrainingDataset): number => {
  const errorCount = dataset.validationIssues.filter(
    (issue) => issue.severity === 'error',
  ).length;
  const warningCount = dataset.validationIssues.filter(
    (issue) => issue.severity === 'warning',
  ).length;

  return Number(Math.max(0, 1 - errorCount * 0.25 - warningCount * 0.05).toFixed(4));
};

const createDryRunMetrics = (
  dataset: LoadedTrainingDataset,
  batches: readonly TrainingBatch[],
): TrainingDryRunMetrics => ({
  schemaVersion: TRAINING_METRICS_SCHEMA_VERSION,
  sampleCount: dataset.samples.length,
  batchCount: batches.length,
  regionCoverage: regionCoverage(dataset) as TrainingDryRunMetrics['regionCoverage'],
  qualityWeightedSampleCount: Number(
    dataset.samples
      .reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0)
      .toFixed(4),
  ),
  maskAreaDistribution: Object.fromEntries(
    dataset.regionTargets.map((target) => [
      target.regionId,
      Number(
        dataset.samples
          .filter((sample) => sample.regionId === target.regionId)
          .reduce(
            (sum, sample) => sum + sample.target.humanEditedMask.alphaStats.activeRatio,
            0,
          )
          .toFixed(4),
      ),
    ]),
  ) as TrainingDryRunMetrics['maskAreaDistribution'],
  diffAreaDistribution: Object.fromEntries(
    dataset.regionTargets.map((target) => [
      target.regionId,
      Number(
        dataset.samples
          .filter((sample) => sample.regionId === target.regionId)
          .reduce((sum, sample) => sum + sample.target.diffSignal.alphaStats.activeRatio, 0)
          .toFixed(4),
      ),
    ]),
  ) as TrainingDryRunMetrics['diffAreaDistribution'],
  edgeShiftDistribution: Object.fromEntries(
    dataset.regionTargets.map((target) => [target.regionId, 0]),
  ) as TrainingDryRunMetrics['edgeShiftDistribution'],
  splitBalance: splitBalance(dataset) as TrainingDryRunMetrics['splitBalance'],
  excludedSampleSummary: {
    excludedCount: dataset.samples.filter((sample) => !sample.trainingReady).length,
    reasons: dataset.validationIssues.map((issue) => issue.code).sort(),
  },
  readinessScore: readinessScore(dataset),
});

export const validateTrainerInput = (
  dataset: LoadedTrainingDataset,
): TrainingBridgeValidationIssue[] => [
  ...dataset.validationIssues.filter((issue) => issue.severity === 'error'),
  ...(dataset.samples.length === 0
    ? [
        {
          severity: 'error' as const,
          code: 'trainer-no-samples',
          message: 'trainer input has no samples',
        },
      ]
    : []),
];

export const createSegmentationTrainingPlan = (input: {
  dataset: LoadedTrainingDataset;
  config: SegmentationTrainerConfig;
  iteratorConfig?: TrainingBatchIteratorConfig;
}): SegmentationTrainingPlan => {
  const batches = createTrainingBatchIterator(input.dataset.samples, {
    batchSize: input.config.batchSize,
    qualityThreshold: input.config.minQualityScore,
    ...input.iteratorConfig,
  });
  const validationIssues = validateTrainerInput(input.dataset);

  return {
    planId: `segmentation-training-plan-${input.dataset.summary.datasetId}`,
    trainerId: input.config.trainerId,
    datasetId: input.dataset.summary.datasetId,
    sampleCount: input.dataset.samples.length,
    batchCount: batches.length,
    validationIssues,
    dryRunOnly: true,
  };
};

export const dryRunSegmentationTraining = (input: {
  dataset: LoadedTrainingDataset;
  config: SegmentationTrainerConfig;
  iteratorConfig?: TrainingBatchIteratorConfig;
}): SegmentationTrainingDryRunResult => {
  const batches = createTrainingBatchIterator(input.dataset.samples, {
    batchSize: input.config.batchSize,
    qualityThreshold: input.config.minQualityScore,
    ...input.iteratorConfig,
  });
  const plan = createSegmentationTrainingPlan(input);
  const metrics = createDryRunMetrics(input.dataset, batches);

  return {
    plan,
    run: {
      runId: `segmentation-training-dry-run-${input.dataset.summary.datasetId}`,
      planId: plan.planId,
      status: 'dry_run_completed',
      metrics,
    },
    batches,
  };
};

export const summarizeTrainingPlan = (
  plan: SegmentationTrainingPlan,
): string =>
  [
    `plan:${plan.planId}`,
    `dataset:${plan.datasetId}`,
    `samples:${plan.sampleCount}`,
    `batches:${plan.batchCount}`,
    `issues:${plan.validationIssues.length}`,
  ].join('\n');
