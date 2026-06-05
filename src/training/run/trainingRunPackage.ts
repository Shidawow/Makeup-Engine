import { stableStringify } from '../../templates/storage/datasetExport';
import type { LoadedTrainingDataset } from '../schema';
import type { TrainerConfig } from '../config';
import type { TrainingRuntimeExecutionPlan } from '../runtime';
import type { FailedSampleQuarantineReport } from '../schema/failed-sample.schema';
import type { SegmentationEvaluationReport } from '../schema/evaluation-report.schema';
import type { ModelArtifactManifest } from '../schema/model-artifact.schema';

export interface TrainingRunInputSummary {
  datasetId: string;
  sourcePackageId: string;
  sampleCount: number;
  trainerConfigId: string;
}

export interface TrainingRunOutputSummary {
  modelId: string;
  evaluationReportId: string;
  failedSampleCount: number;
}

export interface TrainingRunTrace {
  traceId: string;
  events: string[];
}

export interface TrainingRunPackage {
  schemaVersion: 'training-run-package-v0.1';
  trainingRunId: string;
  createdAt: string;
  inputSummary: TrainingRunInputSummary;
  outputSummary: TrainingRunOutputSummary;
  runtimePlan: TrainingRuntimeExecutionPlan;
  trace: TrainingRunTrace;
  trainerConfig: TrainerConfig;
  quarantineSummary: FailedSampleQuarantineReport;
  evaluationReport: SegmentationEvaluationReport;
  modelManifest: ModelArtifactManifest;
}

export const createTrainingRunTrace = (input: {
  trainingRunId: string;
  dataset: LoadedTrainingDataset;
}): TrainingRunTrace => ({
  traceId: `training-trace-${input.trainingRunId}`,
  events: [
    'materialized-dataset-loaded',
    `dataset:${input.dataset.summary.datasetId}`,
    'split-jsonl-read',
    'artifact-json-read',
    'batch-iterator-created',
    'runtime-dry-run',
    'model-placeholder-created',
  ],
});

export const createTrainingRunPackage = (input: {
  trainingRunId: string;
  createdAt: string;
  dataset: LoadedTrainingDataset;
  trainerConfig: TrainerConfig;
  runtimePlan: TrainingRuntimeExecutionPlan;
  quarantineSummary: FailedSampleQuarantineReport;
  evaluationReport: SegmentationEvaluationReport;
  modelManifest: ModelArtifactManifest;
}): TrainingRunPackage => ({
  schemaVersion: 'training-run-package-v0.1',
  trainingRunId: input.trainingRunId,
  createdAt: input.createdAt,
  inputSummary: {
    datasetId: input.dataset.summary.datasetId,
    sourcePackageId: input.dataset.summary.sourcePackageId,
    sampleCount: input.dataset.samples.length,
    trainerConfigId: input.trainerConfig.configId,
  },
  outputSummary: {
    modelId: input.modelManifest.modelId,
    evaluationReportId: input.evaluationReport.reportId,
    failedSampleCount: input.quarantineSummary.failedSampleCount,
  },
  runtimePlan: input.runtimePlan,
  trace: createTrainingRunTrace({
    trainingRunId: input.trainingRunId,
    dataset: input.dataset,
  }),
  trainerConfig: input.trainerConfig,
  quarantineSummary: input.quarantineSummary,
  evaluationReport: input.evaluationReport,
  modelManifest: input.modelManifest,
});

export const summarizeTrainingRunPackage = (
  runPackage: TrainingRunPackage,
): string =>
  `${runPackage.trainingRunId}:dataset=${runPackage.inputSummary.datasetId}:model=${runPackage.outputSummary.modelId}`;

export const exportTrainingRunPackageJson = (
  runPackage: TrainingRunPackage,
): string => stableStringify(runPackage);
