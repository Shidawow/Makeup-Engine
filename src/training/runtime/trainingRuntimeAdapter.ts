import type { TrainingBatch } from '../schema';

export type TrainingRuntimeKind =
  | 'dry-run'
  | 'external-python-placeholder'
  | 'webgpu-placeholder'
  | 'onnx-export-placeholder';

export interface TrainingRuntimeCapabilities {
  supportsDryRun: boolean;
  supportsExternalExecution: boolean;
  supportsModelExport: boolean;
}

export interface TrainingRuntimeConfig {
  runtimeKind: TrainingRuntimeKind;
  runtimeVersion: string;
  maxBatches?: number;
}

export interface TrainingRuntimeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TrainingRuntimeExecutionPlan {
  planId: string;
  runtimeKind: TrainingRuntimeKind;
  batchCount: number;
  sampleCount: number;
  capabilities: TrainingRuntimeCapabilities;
  dryRunOnly: boolean;
}

export interface TrainingRuntimeDryRunResult {
  plan: TrainingRuntimeExecutionPlan;
  status: 'dry_run_completed';
  processedBatchIds: string[];
}

export interface TrainingRuntimeAdapter {
  kind: TrainingRuntimeKind;
  capabilities: TrainingRuntimeCapabilities;
  validate(config: TrainingRuntimeConfig): TrainingRuntimeValidationResult;
  createPlan(batches: readonly TrainingBatch[], config: TrainingRuntimeConfig): TrainingRuntimeExecutionPlan;
  dryRun(batches: readonly TrainingBatch[], config: TrainingRuntimeConfig): TrainingRuntimeDryRunResult;
}

const capabilities = (
  kind: TrainingRuntimeKind,
): TrainingRuntimeCapabilities => ({
  supportsDryRun: true,
  supportsExternalExecution: kind === 'external-python-placeholder',
  supportsModelExport: kind === 'onnx-export-placeholder',
});

export const validateTrainingRuntimeConfig = (
  config: TrainingRuntimeConfig,
): TrainingRuntimeValidationResult => ({
  valid: config.runtimeVersion.length > 0,
  errors: config.runtimeVersion.length > 0 ? [] : ['runtimeVersion is required'],
  warnings:
    config.runtimeKind === 'dry-run'
      ? ['dry-run runtime does not train a model']
      : [`${config.runtimeKind} is a placeholder runtime`],
});

export const createTrainingRuntimeExecutionPlan = (input: {
  batches: readonly TrainingBatch[];
  config: TrainingRuntimeConfig;
}): TrainingRuntimeExecutionPlan => ({
  planId: `runtime-plan-${input.config.runtimeKind}-${input.batches.length}`,
  runtimeKind: input.config.runtimeKind,
  batchCount: input.batches.length,
  sampleCount: input.batches.reduce((sum, batch) => sum + batch.sampleCount, 0),
  capabilities: capabilities(input.config.runtimeKind),
  dryRunOnly: true,
});

export const dryRunTrainingRuntime = (input: {
  batches: readonly TrainingBatch[];
  config: TrainingRuntimeConfig;
}): TrainingRuntimeDryRunResult => ({
  plan: createTrainingRuntimeExecutionPlan(input),
  status: 'dry_run_completed',
  processedBatchIds: input.batches.map((batch) => batch.batchId).sort(),
});

export const summarizeTrainingRuntimePlan = (
  plan: TrainingRuntimeExecutionPlan,
): string =>
  `${plan.runtimeKind}:batches=${plan.batchCount}:samples=${plan.sampleCount}:dryRun=${plan.dryRunOnly}`;

export const createTrainingRuntimeAdapter = (
  kind: TrainingRuntimeKind,
): TrainingRuntimeAdapter => ({
  kind,
  capabilities: capabilities(kind),
  validate: validateTrainingRuntimeConfig,
  createPlan: (batches, config) =>
    createTrainingRuntimeExecutionPlan({ batches, config }),
  dryRun: (batches, config) => dryRunTrainingRuntime({ batches, config }),
});
