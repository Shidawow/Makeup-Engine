import { describe, expect, it } from 'vitest';
import {
  createDefaultTrainerConfig,
  createDryRunEvaluationReport,
  createModelArtifactManifestPlaceholder,
  createTrainingBatchIterator,
  createTrainingRunPackage,
  createTrainingRuntimeExecutionPlan,
  exportTrainingRunPackageJson,
  loadMaterializedDataset,
  quarantineInvalidSamples,
  summarizeFailedSamples,
  summarizeTrainingRunPackage,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('training run package trace', () => {
  it('links dataset, config, runtime plan, quarantine, evaluation, and model placeholder', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const config = createDefaultTrainerConfig();
    const trainingRunId = 'training-run-test';
    const runtimePlan = createTrainingRuntimeExecutionPlan({
      batches: createTrainingBatchIterator(dataset.samples, { batchSize: 2 }),
      config: config.runtime,
    });
    const quarantine = quarantineInvalidSamples({
      dataset,
      createdAt: '2026-05-30T00:00:00.000Z',
    });
    const evaluationReport = createDryRunEvaluationReport({
      dataset,
      trainingRunId,
      createdAt: '2026-05-30T00:00:00.000Z',
    });
    const modelManifest = createModelArtifactManifestPlaceholder({
      dataset,
      config,
      trainingRunId,
      createdAt: '2026-05-30T00:00:00.000Z',
    });
    const runPackage = createTrainingRunPackage({
      trainingRunId,
      createdAt: '2026-05-30T00:00:00.000Z',
      dataset,
      trainerConfig: config,
      runtimePlan,
      quarantineSummary: summarizeFailedSamples(quarantine),
      evaluationReport,
      modelManifest,
    });

    expect(runPackage.trace.events).toContain('materialized-dataset-loaded');
    expect(summarizeTrainingRunPackage(runPackage)).toContain(dataset.summary.datasetId);
    expect(exportTrainingRunPackageJson(runPackage)).toContain('training-run-package-v0.1');
  });
});
