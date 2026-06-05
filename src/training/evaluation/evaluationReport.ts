import { stableStringify } from '../../templates/storage/datasetExport';
import type { LoadedTrainingDataset } from '../schema';
import type {
  SegmentationEvaluationReport,
} from '../schema/evaluation-report.schema';
import { EVALUATION_REPORT_SCHEMA_VERSION } from '../schema/evaluation-report.schema';
import type { BaselineSegmentationEvaluationResult } from './baselineModelEvaluator';
import type { ImageConditionedEvaluationResult } from './imageConditionedModelEvaluator';
import type { ImageConditionedSegmentationModel } from '../schema';
import type { LightweightClassifierEvaluationResult } from './lightweightClassifierEvaluator';
import type { LightweightSegmentationClassifier } from '../schema';

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

export const createEvaluationReportPlaceholder = (input: {
  dataset: LoadedTrainingDataset;
  trainingRunId: string;
  createdAt: string;
}): SegmentationEvaluationReport =>
  createDryRunEvaluationReport(input);

export const createDryRunEvaluationReport = (input: {
  dataset: LoadedTrainingDataset;
  trainingRunId: string;
  createdAt: string;
}): SegmentationEvaluationReport => {
  const failedSamples = input.dataset.samples.filter(
    (sample) => sample.validationIssues.some((issue) => issue.severity === 'error'),
  );

  return {
    schemaVersion: EVALUATION_REPORT_SCHEMA_VERSION,
    reportId: `evaluation-report-${input.trainingRunId}`,
    trainingRunId: input.trainingRunId,
    createdAt: input.createdAt,
    datasetSummary: {
      datasetId: input.dataset.summary.datasetId,
      sampleCount: input.dataset.samples.length,
      splitBalance: input.dataset.summary.splitCounts as SegmentationEvaluationReport['datasetSummary']['splitBalance'],
    },
    regionSummaries: input.dataset.regionTargets.map((target) => {
      const samples = input.dataset.samples.filter(
        (sample) => sample.regionId === target.regionId,
      );
      return {
        regionId: target.regionId,
        sampleCount: samples.length,
        maskAreaMean: average(
          samples.map((sample) => sample.target.humanEditedMask.alphaStats.activeRatio),
        ),
        diffAreaMean: average(
          samples.map((sample) => sample.target.diffSignal.alphaStats.activeRatio),
        ),
      };
    }),
    maskMetricSummary: [
      {
        metricName: 'dry_run_proxy_mask_area',
        value: average(
          input.dataset.samples.map(
            (sample) => sample.target.humanEditedMask.alphaStats.activeRatio,
          ),
        ),
        note: 'dry-run proxy, not real model IoU/Dice',
      },
      {
        metricName: 'dry_run_proxy_diff_area',
        value: average(
          input.dataset.samples.map(
            (sample) => sample.target.diffSignal.alphaStats.activeRatio,
          ),
        ),
        note: 'dry-run proxy, not real model IoU/Dice',
      },
    ],
    failedSampleSummary: {
      failedSampleCount: failedSamples.length,
      sampleIds: failedSamples.map((sample) => sample.sampleId).sort(),
    },
    qualityWeightedSampleCount: Number(
      input.dataset.samples
        .reduce((sum, sample) => sum + sample.qualityScore * sample.sampleWeight, 0)
        .toFixed(4),
    ),
    readinessStatus: input.dataset.summary.readiness,
  };
};

export const validateEvaluationReport = (
  report: SegmentationEvaluationReport,
): string[] => [
  ...(report.schemaVersion !== EVALUATION_REPORT_SCHEMA_VERSION
    ? ['invalid evaluation report schemaVersion']
    : []),
  ...(report.datasetSummary.sampleCount < 0 ? ['sampleCount cannot be negative'] : []),
];

export const attachBaselineEvaluationToReport = (input: {
  report: SegmentationEvaluationReport;
  baselineEvaluation: BaselineSegmentationEvaluationResult;
}): SegmentationEvaluationReport => ({
  ...input.report,
  maskMetricSummary: [
    ...input.report.maskMetricSummary,
    {
      metricName: 'baseline_hard_iou',
      value: input.baselineEvaluation.hardIoU,
      note: 'baseline prior mask-vs-mask metric, not neural segmentation metric',
    },
    {
      metricName: 'baseline_soft_iou',
      value: input.baselineEvaluation.softIoU,
      note: 'baseline prior mask-vs-mask metric, not neural segmentation metric',
    },
    {
      metricName: 'baseline_dice',
      value: input.baselineEvaluation.dice,
      note: 'baseline prior mask-vs-mask metric, not neural segmentation metric',
    },
  ],
  baselineModelEvaluation: {
    metricType: 'baseline-mask-prior',
    note: 'Baseline prior model evaluation compares prior masks against human-edited masks. It is not a neural network segmentation metric.',
    evaluationSplit: input.baselineEvaluation.evaluationSplit,
    evaluationSampleCount: input.baselineEvaluation.evaluationSampleCount,
    perRegionMetrics: input.baselineEvaluation.perRegionMetrics,
    hardIoU: input.baselineEvaluation.hardIoU,
    softIoU: input.baselineEvaluation.softIoU,
    dice: input.baselineEvaluation.dice,
    alphaMAE: input.baselineEvaluation.alphaMAE,
    alphaRMSE: input.baselineEvaluation.alphaRMSE,
    boundsOverlap: input.baselineEvaluation.boundsOverlap,
    areaError: input.baselineEvaluation.areaError,
  },
  readinessStatus:
    input.baselineEvaluation.readinessStatus === 'evaluated-baseline'
      ? 'pass'
      : input.report.readinessStatus,
});

export const attachImageConditionedEvaluationToReport = (input: {
  report: SegmentationEvaluationReport;
  model: ImageConditionedSegmentationModel;
  evaluation: ImageConditionedEvaluationResult;
}): SegmentationEvaluationReport => ({
  ...input.report,
  imageConditionedModelEvaluation: {
    metricType: 'image-conditioned-pixel-prior',
    note: 'Image-conditioned pixel prior metrics compare deterministic pixel-feature predictions against human-edited masks. They are not neural network metrics.',
    pixelFeatureSummary: {
      featureStride: input.model.featureConfig.featureStride,
      positivePixelCount: input.model.trainingSummary.positivePixelCount,
      negativePixelCount: input.model.trainingSummary.negativePixelCount,
    },
    pixelArtifactCoverage: {
      requiredSampleCount: input.report.datasetSummary.sampleCount,
      availablePixelArtifactCount: input.model.trainingSummary.pixelArtifactCount,
    },
    perRegionImageConditionedMetrics: input.evaluation.perRegionMetrics,
    missingPixelArtifactSummary: {
      missingPixelArtifactCount: input.evaluation.missingPixelArtifactCount,
    },
    hardIoU: input.evaluation.hardIoU,
    softIoU: input.evaluation.softIoU,
    dice: input.evaluation.dice,
    alphaMAE: input.evaluation.alphaMAE,
    alphaRMSE: input.evaluation.alphaRMSE,
  },
  readinessStatus:
    input.evaluation.readinessStatus === 'evaluated-image-conditioned-baseline'
      ? 'pass'
      : input.report.readinessStatus,
});

export const attachLightweightClassifierEvaluationToReport = (input: {
  report: SegmentationEvaluationReport;
  model: LightweightSegmentationClassifier;
  evaluation: LightweightClassifierEvaluationResult;
}): SegmentationEvaluationReport => ({
  ...input.report,
  maskMetricSummary: [
    ...input.report.maskMetricSummary,
    {
      metricName: 'lightweight_classifier_f1',
      value: input.evaluation.f1,
      note: 'lightweight classifier pixel-level F1, not neural segmentation metric',
    },
    {
      metricName: 'lightweight_classifier_iou',
      value: input.evaluation.hardIoU,
      note: 'lightweight classifier mask-level IoU, not neural segmentation metric',
    },
  ],
  lightweightClassifierEvaluation: {
    metricType: 'lightweight-segmentation-classifier',
    note: 'Lightweight classifier metrics compare deterministic TypeScript classifier predictions against human-edited masks. They are not deep model metrics.',
    classifierMetrics: {
      classifierKind: input.model.classifierKind,
      hardIoU: input.evaluation.hardIoU,
      softIoU: input.evaluation.softIoU,
      dice: input.evaluation.dice,
    },
    pixelClassificationMetrics: {
      accuracy: input.evaluation.accuracy,
      precision: input.evaluation.precision,
      recall: input.evaluation.recall,
      f1: input.evaluation.f1,
    },
    featureSeparationSummary: {
      meanFeatureSeparation: average(
        input.evaluation.perRegionMetrics.map((metric) => metric.featureSeparationScore),
      ),
    },
    classifierRegionMetrics: input.evaluation.perRegionMetrics.map((metric) => ({
      regionId: metric.regionId,
      sampleCount: metric.sampleCount,
      positivePixelCount: metric.positivePixelCount,
      negativePixelCount: metric.negativePixelCount,
      hardIoU: metric.hardIoU,
      dice: metric.dice,
      f1: metric.f1,
      featureSeparationScore: metric.featureSeparationScore,
    })),
    artifactMaterializationSummary: {
      binaryMaskReady: true,
      binaryDiffReady: true,
    },
  },
  readinessStatus:
    input.evaluation.readinessStatus === 'evaluated-lightweight-classifier'
      ? 'pass'
      : input.report.readinessStatus,
});

export const summarizeEvaluationReport = (
  report: SegmentationEvaluationReport,
): string =>
  `${report.reportId}:samples=${report.datasetSummary.sampleCount}:readiness=${report.readinessStatus}`;

export const exportEvaluationReportJson = (
  report: SegmentationEvaluationReport,
): string => stableStringify(report);
