import { describe, expect, it } from 'vitest';
import {
  loadMaterializedDataset,
  loadMaterializedManifest,
  summarizeLoadedDataset,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('materialized dataset loader', () => {
  it('loads only the materialized dataset directory and summarizes samples', async () => {
    const reader = fixtureReader();
    const manifest = await loadMaterializedManifest(reader);
    const dataset = await loadMaterializedDataset({ reader });

    expect(manifest.datasetId).toBe('materialized-0b059bd6');
    expect(dataset.samples).toHaveLength(3);
    expect(dataset.summary.splitCounts.train).toBe(1);
    expect(dataset.summary.regionCounts.lips).toBe(1);
    expect(dataset.validationIssues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(summarizeLoadedDataset(dataset)).toContain('samples:3');
  });
});
