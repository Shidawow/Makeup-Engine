import { describe, expect, it } from 'vitest';
import {
  createSegmentationTrainingPlan,
  dryRunSegmentationTraining,
  loadMaterializedDataset,
  summarizeTrainingPlan,
  validateTrainerInput,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('baseline segmentation trainer adapter', () => {
  it('creates a dry-run training plan without training a model', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const config = {
      trainerId: 'baseline-dry-run',
      batchSize: 2,
      minQualityScore: 0.7,
      dryRunOnly: true,
    };
    const plan = createSegmentationTrainingPlan({ dataset, config });
    const result = dryRunSegmentationTraining({ dataset, config });

    expect(validateTrainerInput(dataset)).toEqual([]);
    expect(plan.dryRunOnly).toBe(true);
    expect(result.run.status).toBe('dry_run_completed');
    expect(result.run.metrics.sampleCount).toBe(3);
    expect(summarizeTrainingPlan(plan)).toContain('batches:2');
  });
});
