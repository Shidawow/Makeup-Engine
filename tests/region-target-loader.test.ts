import { describe, expect, it } from 'vitest';
import {
  computeRegionSampleWeights,
  createRegionTrainingTargets,
  filterTargetsByQuality,
  filterTargetsByRegion,
  groupSamplesByRegion,
  loadMaterializedDataset,
  summarizeRegionCoverage,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('region target loader', () => {
  it('groups, filters, weights, and summarizes region targets', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const groups = groupSamplesByRegion(dataset.samples);
    const targets = createRegionTrainingTargets(dataset.samples);

    expect(groups.lips).toHaveLength(1);
    expect(filterTargetsByRegion(dataset.samples, ['lips'])).toHaveLength(1);
    expect(filterTargetsByQuality(dataset.samples, 0.9)).toHaveLength(2);
    expect(computeRegionSampleWeights(dataset.samples).lips).toBe(1);
    expect(targets.find((target) => target.regionId === 'contour')?.warnings).toContain(
      'region has no training samples:contour',
    );
    expect(summarizeRegionCoverage(dataset.samples)).toContain('lips:1');
  });
});
