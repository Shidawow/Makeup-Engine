import { describe, expect, it } from 'vitest';
import {
  createTrainingBatchIterator,
  createTrainingRuntimeAdapter,
  dryRunTrainingRuntime,
  loadMaterializedDataset,
  summarizeTrainingRuntimePlan,
  validateTrainingRuntimeConfig,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('training runtime adapter boundary', () => {
  it('creates dry-run runtime plans without invoking real runtimes', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const batches = createTrainingBatchIterator(dataset.samples, { batchSize: 2 });
    const config = { runtimeKind: 'dry-run' as const, runtimeVersion: 'dry-run-v0.1' };
    const adapter = createTrainingRuntimeAdapter('dry-run');
    const result = dryRunTrainingRuntime({ batches, config });

    expect(validateTrainingRuntimeConfig(config).valid).toBe(true);
    expect(adapter.capabilities.supportsDryRun).toBe(true);
    expect(result.status).toBe('dry_run_completed');
    expect(summarizeTrainingRuntimePlan(result.plan)).toContain('dryRun=true');
  });
});
