import { describe, expect, it } from 'vitest';
import {
  addFailedSample,
  classifyTrainingBridgeIssue,
  createFailedSampleQuarantine,
  exportFailedSampleQuarantineJson,
  loadMaterializedDataset,
  quarantineInvalidSamples,
  summarizeFailedSamples,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('failed sample quarantine', () => {
  it('classifies issues and creates quarantine reports without deleting data', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const quarantine = quarantineInvalidSamples({
      dataset,
      minQualityScore: 0.95,
      createdAt: '2026-05-30T00:00:00.000Z',
    });
    const updated = addFailedSample(
      createFailedSampleQuarantine({
        datasetId: dataset.summary.datasetId,
        createdAt: '2026-05-30T00:00:00.000Z',
      }),
      {
        sampleId: 'sample-a',
        regionId: 'lips',
        reason: 'missing-mask-artifact',
        severity: 'blocking',
        message: 'missing mask',
      },
    );

    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'checksum-invalid', message: '' })).toBe('checksum-mismatch');
    expect(quarantine.failedSamples.length).toBeGreaterThan(0);
    expect(summarizeFailedSamples(updated).blockingCount).toBe(1);
    expect(exportFailedSampleQuarantineJson(updated)).toContain(
      'failed-sample-quarantine-v0.1',
    );
  });
});
