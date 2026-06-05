import { describe, expect, it } from 'vitest';
import {
  createTrainingSampleInput,
  createTrainingSampleTarget,
  loadMaterializedDataset,
  normalizeQualitySignals,
  normalizeSampleWeight,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('training sample normalizer', () => {
  it('creates stable training input and target structures', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const sample = dataset.samples[0];

    expect(normalizeSampleWeight(-1)).toBe(0);
    expect(normalizeQualitySignals({ qualityScore: 2, sampleWeight: 0.5 })).toEqual({
      qualityScore: 1,
      sampleWeight: 0.5,
    });
    expect(
      createTrainingSampleInput({
        entry: dataset.dataset.entries[0],
        imageReference: sample.input.imageReference,
      }).sampleId,
    ).toBe(dataset.dataset.entries[0].sampleId);
    expect(
      createTrainingSampleTarget({
        entry: dataset.dataset.entries[0],
        originalMask: sample.target.originalMask,
        humanEditedMask: sample.target.humanEditedMask,
        diffSignal: sample.target.diffSignal,
      }).targetWeight,
    ).toBe(1);
  });
});
