import { describe, expect, it } from 'vitest';
import {
  TRAINING_METRICS_SCHEMA_VERSION,
  type TrainingDryRunMetrics,
} from '../src/training';

describe('training metrics schema', () => {
  it('defines dry-run metrics without real model training outputs', () => {
    const metrics = {
      schemaVersion: TRAINING_METRICS_SCHEMA_VERSION,
      sampleCount: 0,
      batchCount: 0,
      regionCoverage: {
        lips: 0,
        blush: 0,
        eyeshadow: 0,
        eyeliner: 0,
        contour: 0,
        highlight: 0,
      },
      qualityWeightedSampleCount: 0,
      maskAreaDistribution: {
        lips: 0,
        blush: 0,
        eyeshadow: 0,
        eyeliner: 0,
        contour: 0,
        highlight: 0,
      },
      diffAreaDistribution: {
        lips: 0,
        blush: 0,
        eyeshadow: 0,
        eyeliner: 0,
        contour: 0,
        highlight: 0,
      },
      edgeShiftDistribution: {
        lips: 0,
        blush: 0,
        eyeshadow: 0,
        eyeliner: 0,
        contour: 0,
        highlight: 0,
      },
      splitBalance: {
        train: 0,
        validation: 0,
        test: 0,
        holdout: 0,
        unassigned: 0,
      },
      excludedSampleSummary: {
        excludedCount: 0,
        reasons: [],
      },
      readinessScore: 0,
    } satisfies TrainingDryRunMetrics;

    expect(metrics.schemaVersion).toBe('segmentation-training-metrics-v0.1');
  });
});
